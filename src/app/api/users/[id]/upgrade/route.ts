import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// POST /api/users/[id]/upgrade - Upgrade user to OWNER role
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await requireAuth()
    const { id } = await params

    // Only the user themselves can request upgrade (or admin)
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.role === 'OWNER' || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'User is already an owner' }, { status: 400 })
    }

    // Update role to OWNER
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: 'OWNER' },
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to upgrade user' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
