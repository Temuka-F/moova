import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Debug endpoint to check database state in real-time
 * Access at: http://localhost:3000/api/debug
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const check = searchParams.get('check') || 'all'

    const debug: any = {
      timestamp: new Date().toISOString(),
      checks: {},
    }

    // Check bookings
    if (check === 'all' || check === 'bookings') {
      const bookings = await prisma.booking.findMany({
        where: { isSeedData: true },
        include: {
          car: {
            select: {
              id: true,
              make: true,
              model: true,
              ownerId: true,
            },
          },
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })

      debug.checks.bookings = {
        count: bookings.length,
        data: bookings.map(b => ({
          id: b.id,
          carId: b.carId,
          car: b.car ? `${b.car.make} ${b.car.model}` : 'NOT FOUND',
          renterId: b.renterId,
          renter: b.renter ? `${b.renter.firstName} ${b.renter.lastName}` : 'NOT FOUND',
          status: b.status,
          linked: !!(b.car && b.renter),
        })),
      }
    }

    // Check cars
    if (check === 'all' || check === 'cars') {
      const cars = await prisma.car.findMany({
        where: { isSeedData: true },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              bookings: true,
            },
          },
        },
        take: 10,
      })

      debug.checks.cars = {
        count: cars.length,
        data: cars.map(c => ({
          id: c.id,
          make: c.make,
          model: c.model,
          ownerId: c.ownerId,
          owner: c.owner ? `${c.owner.firstName} ${c.owner.lastName}` : 'NOT FOUND',
          bookingsCount: c._count.bookings,
        })),
      }
    }

    // Check users
    if (check === 'all' || check === 'users') {
      const users = await prisma.user.findMany({
        where: { isSeedData: true },
        include: {
          _count: {
            select: {
              cars: true,
              bookingsAsRenter: true,
            },
          },
        },
        take: 10,
      })

      debug.checks.users = {
        count: users.length,
        data: users.map(u => ({
          id: u.id,
          email: u.email,
          name: `${u.firstName} ${u.lastName}`,
          role: u.role,
          carsCount: u._count.cars,
          bookingsCount: u._count.bookingsAsRenter,
        })),
      }
    }

    return NextResponse.json(debug, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
