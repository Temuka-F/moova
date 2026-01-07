import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/bookings/[id] - Get booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: {
          include: {
            images: { orderBy: { order: 'asc' } },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            phone: true,
            email: true,
            verificationStatus: true,
          },
        },
        review: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only renter, car owner, or admin can view
    const isRenter = booking.renterId === user.id
    const isOwner = booking.car.ownerId === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isRenter && !isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(booking)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// PATCH /api/bookings/[id] - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: true,
        renter: true,
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const isRenter = booking.renterId === user.id
    const isOwner = booking.car.ownerId === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isRenter && !isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, reason } = body
    const updateData: any = {}
    let notificationData: any = null

    switch (action) {
      case 'confirm':
        // Only owner or admin can confirm
        if (!isOwner && !isAdmin) {
          return NextResponse.json({ error: 'Only the host can confirm bookings' }, { status: 403 })
        }
        if (booking.status !== 'PENDING') {
          return NextResponse.json({ error: 'Can only confirm pending bookings' }, { status: 400 })
        }
        updateData.status = 'CONFIRMED'
        notificationData = {
          userId: booking.renterId,
          type: 'BOOKING_CONFIRMED',
          title: 'Booking Confirmed!',
          message: `Your booking for ${booking.car.make} ${booking.car.model} has been confirmed`,
          data: { bookingId: id },
        }
        break

      case 'start':
        // Owner marks car as picked up
        if (!isOwner && !isAdmin) {
          return NextResponse.json({ error: 'Only the host can start bookings' }, { status: 403 })
        }
        if (booking.status !== 'CONFIRMED') {
          return NextResponse.json({ error: 'Can only start confirmed bookings' }, { status: 400 })
        }
        updateData.status = 'ACTIVE'
        updateData.actualStartDate = new Date()
        if (body.startMileage) {
          updateData.startMileage = body.startMileage
        }
        break

      case 'complete':
        // Owner marks car as returned
        if (!isOwner && !isAdmin) {
          return NextResponse.json({ error: 'Only the host can complete bookings' }, { status: 403 })
        }
        if (booking.status !== 'ACTIVE') {
          return NextResponse.json({ error: 'Can only complete active bookings' }, { status: 400 })
        }
        updateData.status = 'COMPLETED'
        updateData.actualEndDate = new Date()
        if (body.endMileage) {
          updateData.endMileage = body.endMileage
        }
        notificationData = {
          userId: booking.renterId,
          type: 'BOOKING_COMPLETED',
          title: 'Trip Completed',
          message: `Your trip with ${booking.car.make} ${booking.car.model} is complete. Leave a review!`,
          data: { bookingId: id },
        }
        break

      case 'cancel':
        // Both renter and owner can cancel (with restrictions)
        if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
          return NextResponse.json({ error: 'Cannot cancel this booking' }, { status: 400 })
        }
        updateData.status = 'CANCELLED'
        updateData.cancelledAt = new Date()
        updateData.cancelledBy = isRenter ? 'renter' : 'host'
        updateData.cancellationReason = reason

        // TODO: Calculate refund amount based on cancellation policy
        
        notificationData = {
          userId: isRenter ? booking.car.ownerId : booking.renterId,
          type: 'BOOKING_CANCELLED',
          title: 'Booking Cancelled',
          message: `The booking for ${booking.car.make} ${booking.car.model} has been cancelled`,
          data: { bookingId: id },
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        car: {
          include: {
            images: { take: 1 },
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                phone: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            phone: true,
          },
        },
      },
    })

    // Create notification if needed
    if (notificationData) {
      await prisma.notification.create({ data: notificationData })
    }

    // Log admin actions
    if (isAdmin && !isOwner && !isRenter) {
      await prisma.adminLog.create({
        data: {
          adminId: user.id,
          action: action === 'cancel' ? 'BOOKING_CANCELLED' : 'BOOKING_CANCELLED',
          entityType: 'booking',
          entityId: id,
          oldData: { status: booking.status },
          newData: { status: updateData.status },
          reason,
        },
      })
    }

    return NextResponse.json(updatedBooking)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
