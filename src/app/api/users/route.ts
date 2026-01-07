import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import type { UserFilters } from '@/types'

// GET /api/users - List users (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const filters: UserFilters = {
      role: searchParams.get('role') as UserFilters['role'] || undefined,
      verificationStatus: searchParams.get('verificationStatus') as UserFilters['verificationStatus'] || undefined,
      isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const where: any = {}

    if (filters.role) {
      where.role = filters.role
    }
    if (filters.verificationStatus) {
      where.verificationStatus = filters.verificationStatus
    }
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: {
              cars: true,
              bookingsAsRenter: true,
              reviewsReceived: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: ((filters.page || 1) - 1) * (filters.limit || 20),
        take: filters.limit || 20,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      total,
      page: filters.page || 1,
      totalPages: Math.ceil(total / (filters.limit || 20)),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
