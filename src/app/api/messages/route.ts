import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET /api/messages - Get conversations or messages
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const conversationWith = searchParams.get('userId')
    const bookingId = searchParams.get('bookingId')

    // If userId is provided, get messages with that user
    if (conversationWith) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: user.id, receiverId: conversationWith },
            { senderId: conversationWith, receiverId: user.id },
          ],
          ...(bookingId ? { bookingId } : {}),
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          booking: {
            include: {
              car: {
                include: {
                  images: { take: 1 },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          senderId: conversationWith,
          receiverId: user.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return NextResponse.json({ messages })
    }

    // Otherwise, get all conversations (grouped by other user)
    const sentMessages = await prisma.message.findMany({
      where: { senderId: user.id },
      include: {
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        booking: {
          include: {
            car: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: user.id },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        booking: {
          include: {
            car: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Group by conversation partner
    const conversationsMap = new Map()

    for (const msg of sentMessages) {
      const partnerId = msg.receiverId
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partner: msg.receiver,
          lastMessage: msg,
          unreadCount: 0,
          booking: msg.booking,
        })
      }
    }

    for (const msg of receivedMessages) {
      const partnerId = msg.senderId
      const existing = conversationsMap.get(partnerId)
      
      if (!existing) {
        conversationsMap.set(partnerId, {
          partnerId,
          partner: msg.sender,
          lastMessage: msg,
          unreadCount: msg.isRead ? 0 : 1,
          booking: msg.booking,
        })
      } else {
        // Update unread count
        if (!msg.isRead) {
          existing.unreadCount++
        }
        // Update last message if newer
        if (new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
          existing.lastMessage = msg
          existing.booking = msg.booking || existing.booking
        }
      }
    }

    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())

    return NextResponse.json({ conversations })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const { receiverId, content, bookingId } = body

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'receiverId and content are required' },
        { status: 400 }
      )
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    })

    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      )
    }

    // Verify booking if provided
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { car: true },
      })

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      // Verify user is part of the booking
      if (booking.renterId !== user.id && booking.car.ownerId !== user.id) {
        return NextResponse.json(
          { error: 'Not authorized for this booking' },
          { status: 403 }
        )
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
        bookingId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE_RECEIVED',
        title: 'New Message',
        message: `${user.firstName} sent you a message`,
        data: { messageId: message.id, senderId: user.id },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}
