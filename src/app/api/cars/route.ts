import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireOwner, getCurrentUser } from '@/lib/auth'
import type { CarSearchParams } from '@/types'

// GET /api/cars - List cars with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters: CarSearchParams = {
      city: searchParams.get('city') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      category: searchParams.get('category') as CarSearchParams['category'] || undefined,
      transmission: searchParams.get('transmission') as CarSearchParams['transmission'] || undefined,
      fuelType: searchParams.get('fuelType') as CarSearchParams['fuelType'] || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      seats: searchParams.get('seats') ? parseInt(searchParams.get('seats')!) : undefined,
      isInstantBook: searchParams.get('isInstantBook') === 'true',
      sortBy: searchParams.get('sortBy') as CarSearchParams['sortBy'] || 'newest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const where: any = {
      status: 'APPROVED',
      isActive: true,
    }

    if (filters.city) {
      where.city = filters.city
    }
    if (filters.category) {
      where.category = filters.category
    }
    if (filters.transmission) {
      where.transmission = filters.transmission
    }
    if (filters.fuelType) {
      where.fuelType = filters.fuelType
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.pricePerDay = {}
      if (filters.minPrice !== undefined) {
        where.pricePerDay.gte = filters.minPrice
      }
      if (filters.maxPrice !== undefined) {
        where.pricePerDay.lte = filters.maxPrice
      }
    }
    if (filters.seats) {
      where.seats = { gte: filters.seats }
    }
    if (filters.isInstantBook) {
      where.isInstantBook = true
    }

    // Check availability if dates provided
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate)
      const endDate = new Date(filters.endDate)

      where.NOT = {
        bookings: {
          some: {
            OR: [
              {
                AND: [
                  { startDate: { lte: startDate } },
                  { endDate: { gte: startDate } },
                ],
              },
              {
                AND: [
                  { startDate: { lte: endDate } },
                  { endDate: { gte: endDate } },
                ],
              },
              {
                AND: [
                  { startDate: { gte: startDate } },
                  { endDate: { lte: endDate } },
                ],
              },
            ],
            status: {
              in: ['PENDING', 'CONFIRMED', 'ACTIVE'],
            },
          },
        },
      }
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' }
    switch (filters.sortBy) {
      case 'price_asc':
        orderBy = { pricePerDay: 'asc' }
        break
      case 'price_desc':
        orderBy = { pricePerDay: 'desc' }
        break
      case 'rating':
        // Will need to aggregate reviews
        orderBy = { createdAt: 'desc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
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
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy,
        skip: ((filters.page || 1) - 1) * (filters.limit || 20),
        take: filters.limit || 20,
      }),
      prisma.car.count({ where }),
    ])

    return NextResponse.json({
      cars,
      total,
      page: filters.page || 1,
      totalPages: Math.ceil(total / (filters.limit || 20)),
    })
  } catch (error: any) {
    console.error('Error in GET /api/cars:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cars', details: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    )
  }
}

// POST /api/cars - Create a new car (Owner only)
export async function POST(request: NextRequest) {
  try {
    const user = await requireOwner()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'licensePlate', 'color', 'city', 'address', 'pricePerDay']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if license plate already exists
    const existingCar = await prisma.car.findUnique({
      where: { licensePlate: body.licensePlate },
    })

    if (existingCar) {
      return NextResponse.json(
        { error: 'A car with this license plate already exists' },
        { status: 400 }
      )
    }

    const car = await prisma.car.create({
      data: {
        ownerId: user.id,
        make: body.make,
        model: body.model,
        year: body.year,
        licensePlate: body.licensePlate,
        vin: body.vin,
        color: body.color,
        transmission: body.transmission || 'AUTOMATIC',
        fuelType: body.fuelType || 'PETROL',
        seats: body.seats || 5,
        doors: body.doors || 4,
        category: body.category || 'SEDAN',
        features: body.features || [],
        hasAC: body.hasAC ?? true,
        hasGPS: body.hasGPS ?? false,
        hasUSB: body.hasUSB ?? true,
        hasBluetooth: body.hasBluetooth ?? true,
        hasChildSeat: body.hasChildSeat ?? false,
        city: body.city,
        address: body.address,
        latitude: body.latitude || 41.7151,
        longitude: body.longitude || 44.8271,
        pricePerDay: body.pricePerDay,
        pricePerHour: body.pricePerHour,
        securityDeposit: body.securityDeposit || 200,
        minRentalDays: body.minRentalDays || 1,
        maxRentalDays: body.maxRentalDays || 30,
        mileageLimit: body.mileageLimit,
        extraMileageFee: body.extraMileageFee,
        currentMileage: body.currentMileage || 0,
        isInstantBook: body.isInstantBook ?? false,
        status: 'PENDING', // Needs admin approval
      },
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

    return NextResponse.json(car, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create car' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
