import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireOwner } from '@/lib/auth'

// GET /api/me/cars - Get current user's cars
export async function GET(request: NextRequest) {
  try {
    const user = await requireOwner()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      ownerId: user.id,
    }

    if (status) {
      where.status = status
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: {
          images: { orderBy: { order: 'asc' } },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.car.count({ where }),
    ])

    return NextResponse.json({
      cars,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cars' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
