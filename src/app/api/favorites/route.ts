import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/auth'

// GET /api/favorites - Get user's favorites (or check if a car is favorited)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const carId = searchParams.get('carId')

    // If carId is provided, check if this specific car is favorited
    if (carId) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_carId: {
            userId: user.id,
            carId,
          },
        },
      })
      
      return NextResponse.json({ isFavorited: !!favorite })
    }

    // Otherwise, return all favorites
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        car: {
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
              select: {
                reviews: true,
                bookings: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      favorites,
      total: favorites.length,
    })
  } catch (error: any) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add a car to favorites
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const { carId } = body

    if (!carId) {
      return NextResponse.json(
        { error: 'carId is required' },
        { status: 400 }
      )
    }

    // Check if car exists
    const car = await prisma.car.findUnique({
      where: { id: carId },
    })

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Car is already in favorites' },
        { status: 400 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        carId,
      },
      include: {
        car: {
          include: {
            images: { take: 1 },
          },
        },
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add favorite' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// DELETE /api/favorites - Remove a car from favorites
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const carId = searchParams.get('carId')

    if (!carId) {
      return NextResponse.json(
        { error: 'carId is required' },
        { status: 400 }
      )
    }

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to remove favorite' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
