import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats - Get public platform statistics
export async function GET() {
  try {
    // Get counts from database
    const [
      totalCars,
      totalUsers,
      totalHosts,
      totalBookings,
      carsByCity,
      carsByCategory,
    ] = await Promise.all([
      prisma.car.count({
        where: { status: 'APPROVED', isActive: true },
      }),
      prisma.user.count(),
      prisma.user.count({
        where: { role: 'OWNER' },
      }),
      prisma.booking.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.car.groupBy({
        by: ['city'],
        where: { status: 'APPROVED', isActive: true },
        _count: true,
      }),
      prisma.car.groupBy({
        by: ['category'],
        where: { status: 'APPROVED', isActive: true },
        _count: true,
      }),
    ])

    // Get average rating from reviews
    const avgRatingResult = await prisma.review.aggregate({
      _avg: { rating: true },
    })

    // Get featured cars (approved, active, with instant book)
    const featuredCars = await prisma.car.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 3,
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
          select: { reviews: true, bookings: true },
        },
      },
      orderBy: [
        { isInstantBook: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 12,
    })

    // Format city stats
    const cityStats = carsByCity.reduce((acc, { city, _count }) => {
      acc[city] = _count
      return acc
    }, {} as Record<string, number>)

    // Format category stats
    const categoryStats = carsByCategory.reduce((acc, { category, _count }) => {
      acc[category] = _count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      totalCars,
      totalUsers,
      totalHosts,
      totalBookings,
      avgRating: avgRatingResult._avg.rating || 4.9,
      cityStats,
      categoryStats,
      featuredCars,
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
