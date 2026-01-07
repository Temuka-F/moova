import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/stats - Get admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const [
      totalUsers,
      totalCars,
      totalBookings,
      pendingVerifications,
      pendingCarApprovals,
      activeBookings,
      recentUsers,
      recentCars,
      recentBookings,
      completedBookings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.car.count(),
      prisma.booking.count(),
      prisma.user.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.car.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'ACTIVE' } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              cars: true,
              bookingsAsRenter: true,
              reviewsReceived: true,
            },
          },
        },
      }),
      prisma.car.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { take: 1 },
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
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
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
              verificationStatus: true,
            },
          },
        },
      }),
      prisma.booking.findMany({
        where: { status: 'COMPLETED' },
        select: { totalAmount: true },
      }),
    ])

    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0)

    // Get stats by time periods
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [newUsersThisMonth, newCarsThisMonth, bookingsThisMonth] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.car.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.booking.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue,
      pendingVerifications,
      pendingCarApprovals,
      activeBookings,
      newUsersThisMonth,
      newCarsThisMonth,
      bookingsThisMonth,
      recentUsers,
      recentCars,
      recentBookings,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
