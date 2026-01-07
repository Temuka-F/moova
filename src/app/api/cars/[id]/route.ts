import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/auth'

// GET /api/cars/[id] - Get car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            verificationStatus: true,
            createdAt: true,
            responseRate: true,
            responseTime: true,
            bio: true,
            _count: {
              select: {
                cars: true,
                reviewsReceived: true,
              },
            },
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    })

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found', message: 'This car does not exist or has been removed.' },
        { status: 404 }
      )
    }

    // Only show approved cars publicly, or owner/admin can see their own
    if (car.status !== 'APPROVED' && car.isActive !== true) {
      if (!user || (user.id !== car.ownerId && user.role !== 'ADMIN')) {
        return NextResponse.json(
          { error: 'Car not available', message: 'This car is not currently available for viewing.' },
          { status: 404 }
        )
      }
    }

    // Ensure all required fields are present with defaults
    const carResponse = {
      ...car,
      images: car.images || [],
      reviews: car.reviews || [],
      features: car.features || [],
      owner: car.owner || null,
      _count: car._count || { bookings: 0, reviews: 0 },
    }

    return NextResponse.json(carResponse)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch car' },
      { status: 500 }
    )
  }
}

// PATCH /api/cars/[id] - Update car
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()

    const car = await prisma.car.findUnique({
      where: { id },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    // Only owner or admin can update
    const isOwner = user.id === car.ownerId
    const isAdmin = user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fields that owners can update
    const ownerFields = [
      'color',
      'features',
      'hasAC',
      'hasGPS',
      'hasUSB',
      'hasBluetooth',
      'hasChildSeat',
      'address',
      'latitude',
      'longitude',
      'pricePerDay',
      'pricePerHour',
      'securityDeposit',
      'minRentalDays',
      'maxRentalDays',
      'mileageLimit',
      'extraMileageFee',
      'currentMileage',
      'isInstantBook',
      'isActive',
    ]

    // Fields that only admins can update
    const adminFields = ['status']

    const updateData: any = {}

    // Apply owner-allowed fields
    for (const field of ownerFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Apply admin-only fields if admin
    if (isAdmin) {
      for (const field of adminFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field]
        }
      }

      // Log admin action if status changed
      if (body.status) {
        await prisma.adminLog.create({
          data: {
            adminId: user.id,
            action: body.status === 'APPROVED' 
              ? 'CAR_APPROVED' 
              : body.status === 'REJECTED' 
                ? 'CAR_REJECTED' 
                : 'CAR_SUSPENDED',
            entityType: 'car',
            entityId: id,
            oldData: { status: car.status },
            newData: { status: body.status },
            reason: body.reason,
          },
        })
      }
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            verificationStatus: true,
          },
        },
      },
    })

    return NextResponse.json(updatedCar)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update car' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}

// DELETE /api/cars/[id] - Delete car
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
          },
        },
      },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    // Only owner or admin can delete
    if (user.id !== car.ownerId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Cannot delete car with active bookings
    if (car.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete car with active bookings' },
        { status: 400 }
      )
    }

    await prisma.car.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete car' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
