import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth'

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireAuth()
    const { id } = await params

    // Users can view their own profile, admins can view anyone
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        cars: {
          include: { images: true },
        },
        _count: {
          select: {
            cars: true,
            bookingsAsRenter: true,
            reviewsReceived: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireAuth()
    const { id } = await params
    const body = await request.json()

    // Users can update their own profile, admins can update anyone
    const isAdmin = currentUser.role === 'ADMIN'
    const isOwnProfile = currentUser.id === id

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fields that regular users can update
    const userFields = [
      'firstName',
      'lastName',
      'phone',
      'avatarUrl',
      'dateOfBirth',
      'bio',
      'bankName',
      'bankAccountNumber',
      'bankAccountName',
    ]

    // Fields that only admins can update
    const adminFields = [
      'role',
      'verificationStatus',
      'isEmailVerified',
      'isPhoneVerified',
      'isIdVerified',
      'isLicenseVerified',
      'isActive',
      'isBanned',
      'banReason',
    ]

    const updateData: any = {}

    // Apply user-allowed fields
    for (const field of userFields) {
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

      // Handle verification
      if (body.verificationStatus === 'VERIFIED') {
        updateData.verifiedAt = new Date()
        updateData.verifiedBy = currentUser.id
      }

      // Handle ban
      if (body.isBanned) {
        updateData.bannedAt = new Date()
        updateData.bannedBy = currentUser.id
      }

      // Log admin action
      if (Object.keys(updateData).some(key => adminFields.includes(key))) {
        await prisma.adminLog.create({
          data: {
            adminId: currentUser.id,
            action: body.isBanned 
              ? 'USER_BANNED' 
              : body.verificationStatus === 'VERIFIED' 
                ? 'USER_VERIFIED' 
                : body.verificationStatus === 'REJECTED'
                  ? 'USER_REJECTED'
                  : body.role 
                    ? 'USER_ROLE_CHANGED' 
                    : 'USER_VERIFIED',
            entityType: 'user',
            entityId: id,
            newData: updateData,
            reason: body.reason,
          },
        })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
