import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { syncUser } from '@/lib/auth'

// GET /api/me - Get current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { email: authUser.email },
      include: {
        _count: {
          select: {
            cars: true,
            bookingsAsRenter: true,
            reviewsReceived: true,
          },
        },
      },
    })

    // If user doesn't exist in our DB, create them
    if (!user) {
      const newUser = await syncUser({
        id: authUser.id,
        email: authUser.email!,
        user_metadata: authUser.user_metadata as any,
      })

      // Re-fetch with counts
      user = await prisma.user.findUnique({
        where: { id: newUser.id },
        include: {
          _count: {
            select: {
              cars: true,
              bookingsAsRenter: true,
              reviewsReceived: true,
            },
          },
        },
      })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error fetching current user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PATCH /api/me - Update current user profile
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Fields that users can update themselves
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'avatarUrl',
      'dateOfBirth',
      'bio',
      'drivingLicenseNo',
      'drivingLicenseExp',
      'drivingLicenseUrl',
      'idNumber',
      'idDocumentUrl',
      'bankName',
      'bankAccountNumber',
      'bankAccountName',
    ]

    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // If user submits verification documents, set status to PENDING
    if (body.drivingLicenseUrl || body.idDocumentUrl) {
      const user = await prisma.user.findUnique({
        where: { email: authUser.email },
      })

      if (user && user.verificationStatus === 'UNVERIFIED') {
        updateData.verificationStatus = 'PENDING'
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email: authUser.email },
      data: updateData,
      include: {
        _count: {
          select: {
            cars: true,
            bookingsAsRenter: true,
            reviewsReceived: true,
          },
        },
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
