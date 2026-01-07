import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { differenceInDays } from 'date-fns'
import { calculateServiceFee } from '@/lib/flitt'

// GET /api/bookings - List user's bookings
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type') // 'renter' or 'host'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    // If user is an owner, they can see bookings for their cars too
    if (user.role === 'OWNER' || user.role === 'ADMIN') {
      if (type === 'host') {
        where.car = { ownerId: user.id }
      } else if (type === 'renter') {
        where.renterId = user.id
      } else {
        // Show both
        where.OR = [
          { renterId: user.id },
          { car: { ownerId: user.id } },
        ]
      }
    } else {
      // Renters can only see their own bookings
      where.renterId = user.id
    }

    if (status) {
      where.status = status
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          car: {
            include: {
              images: { take: 1, orderBy: { order: 'asc' } },
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
              verificationStatus: true,
            },
          },
          review: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ])

    return NextResponse.json({
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const { carId, startDate, endDate, pickupLocation, renterNote } = body

    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: carId, startDate, endDate' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // Get car details
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { owner: true },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    if (car.status !== 'APPROVED' || !car.isActive) {
      return NextResponse.json({ error: 'Car is not available' }, { status: 400 })
    }

    if (car.ownerId === user.id) {
      return NextResponse.json({ error: 'Cannot book your own car' }, { status: 400 })
    }

    // Check if car is available for these dates
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } },
            ],
          },
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } },
            ],
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Car is not available for these dates' },
        { status: 400 }
      )
    }

    // Calculate pricing
    const totalDays = differenceInDays(end, start)

    if (totalDays < car.minRentalDays) {
      return NextResponse.json(
        { error: `Minimum rental period is ${car.minRentalDays} days` },
        { status: 400 }
      )
    }

    if (totalDays > car.maxRentalDays) {
      return NextResponse.json(
        { error: `Maximum rental period is ${car.maxRentalDays} days` },
        { status: 400 }
      )
    }

    const subtotal = totalDays * car.pricePerDay
    const serviceFee = calculateServiceFee(subtotal)
    const totalAmount = subtotal + serviceFee

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        carId,
        renterId: user.id,
        startDate: start,
        endDate: end,
        pickupLocation: pickupLocation || car.address,
        dailyRate: car.pricePerDay,
        totalDays,
        subtotal,
        serviceFee,
        totalAmount,
        securityDeposit: car.securityDeposit,
        status: car.isInstantBook ? 'CONFIRMED' : 'PENDING',
        renterNote,
      },
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

    // Create notification for car owner
    await prisma.notification.create({
      data: {
        userId: car.ownerId,
        type: 'BOOKING_REQUEST',
        title: car.isInstantBook ? 'New Booking Confirmed' : 'New Booking Request',
        message: `${user.firstName} wants to book your ${car.make} ${car.model}`,
        data: { bookingId: booking.id, carId: car.id },
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
