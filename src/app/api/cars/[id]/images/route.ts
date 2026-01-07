import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// POST /api/cars/[id]/images - Add images to car
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()

    const car = await prisma.car.findUnique({
      where: { id },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    if (user.id !== car.ownerId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { images } = body // Array of { url: string, isPrimary?: boolean }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 })
    }

    // Get current max order
    const lastImage = await prisma.carImage.findFirst({
      where: { carId: id },
      orderBy: { order: 'desc' },
    })
    const startOrder = (lastImage?.order ?? -1) + 1

    // If new image is primary, unset existing primary
    const hasPrimary = images.some((img: any) => img.isPrimary)
    if (hasPrimary) {
      await prisma.carImage.updateMany({
        where: { carId: id, isPrimary: true },
        data: { isPrimary: false },
      })
    }

    // Create images
    const createdImages = await prisma.carImage.createMany({
      data: images.map((img: any, index: number) => ({
        carId: id,
        url: img.url,
        isPrimary: img.isPrimary ?? false,
        order: startOrder + index,
      })),
    })

    // Fetch all images
    const allImages = await prisma.carImage.findMany({
      where: { carId: id },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(allImages, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add images' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}

// DELETE /api/cars/[id]/images - Delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    const car = await prisma.car.findUnique({
      where: { id },
    })

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    if (user.id !== car.ownerId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.carImage.delete({
      where: { id: imageId, carId: id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: error.message === 'Unauthorized' ? 401 : error.message === 'Forbidden' ? 403 : 500 }
    )
  }
}
