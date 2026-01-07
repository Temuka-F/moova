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

    // Get current user to check role
    const currentUser = await prisma.user.findUnique({
      where: { email: authUser.email },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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
      'activeProfileMode',
    ]

    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Validate activeProfileMode - only OWNER users can switch
        if (field === 'activeProfileMode') {
          if (currentUser.role !== 'OWNER') {
            return NextResponse.json(
              { error: 'Only owners can switch profile modes' },
              { status: 403 }
            )
          }
          // Validate the mode value
          if (body[field] !== 'RENTER' && body[field] !== 'OWNER') {
            return NextResponse.json(
              { error: 'Invalid profile mode' },
              { status: 400 }
            )
          }
        }
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

    // Also update Supabase user metadata for profile fields
    if (body.firstName || body.lastName || body.avatarUrl || body.phone) {
      try {
        await supabase.auth.updateUser({
          data: {
            first_name: updatedUser.firstName,
            last_name: updatedUser.lastName,
            avatar_url: updatedUser.avatarUrl,
            phone: updatedUser.phone,
          },
        })
      } catch (metadataError) {
        console.error('Failed to sync user metadata to Supabase:', metadataError)
        // Continue even if metadata sync fails - the main database is the source of truth
      }
    }

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}
