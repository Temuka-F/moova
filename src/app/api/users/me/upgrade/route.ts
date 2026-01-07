import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// POST /api/users/me/upgrade - Upgrade current user to OWNER role
export async function POST(_request: NextRequest) {
  try {
    const currentUser = await requireAuth()

    // Already OWNER/ADMIN => nothing to do
    if (currentUser.role === 'OWNER' || currentUser.role === 'ADMIN') {
      return NextResponse.json(currentUser)
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { role: 'OWNER', activeProfileMode: 'OWNER' },
    })

    return NextResponse.json(updatedUser)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upgrade user'
    return NextResponse.json(
      { error: message },
      { status: message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
