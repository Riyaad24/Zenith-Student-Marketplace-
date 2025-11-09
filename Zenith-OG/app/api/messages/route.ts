import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

interface JWTPayload {
  userId: string
  email: string
}

async function getAuthenticatedUser(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationWith = searchParams.get("conversationWith")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      OR: [
        { senderId: user.userId },
        { receiverId: user.userId }
      ]
    }

    // If conversation with specific user, filter for that conversation
    if (conversationWith) {
      where.OR = [
        {
          AND: [
            { senderId: user.userId },
            { receiverId: conversationWith }
          ]
        },
        {
          AND: [
            { senderId: conversationWith },
            { receiverId: user.userId }
          ]
        }
      ]
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            university: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            university: true
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Format messages
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      read: msg.read,
      product_id: msg.productId,
      created_at: msg.createdAt.toISOString(),
      updated_at: msg.updatedAt.toISOString(),
      sender_id: msg.senderId,
      receiver_id: msg.receiverId,
      sender: {
        id: msg.sender.id,
        first_name: msg.sender.firstName || '',
        last_name: msg.sender.lastName || '',
        avatar_url: msg.sender.avatar,
        university: msg.sender.university
      },
      receiver: {
        id: msg.receiver.id,
        first_name: msg.receiver.firstName || '',
        last_name: msg.receiver.lastName || '',
        avatar_url: msg.receiver.avatar,
        university: msg.receiver.university
      },
      product: msg.product
    }))

    return NextResponse.json({
      success: true,
      data: formattedMessages,
      pagination: {
        page,
        limit,
        total: formattedMessages.length
      }
    })

  } catch (error) {
    console.error("Messages API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { receiverId, content, productId } = body

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, message: "Receiver ID and content are required" },
        { status: 400 }
      )
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        senderId: user.userId,
        receiverId: receiverId,
        content: content.trim(),
        productId: productId || null,
        read: false
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            university: true
          }
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            university: true
          }
        },
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            image: true
          }
        }
      }
    })

    // Format the message
    const formattedMessage = {
      id: newMessage.id,
      content: newMessage.content,
      read: newMessage.read,
      product_id: newMessage.productId,
      created_at: newMessage.createdAt.toISOString(),
      updated_at: newMessage.updatedAt.toISOString(),
      sender_id: newMessage.senderId,
      receiver_id: newMessage.receiverId,
      sender: {
        id: newMessage.sender.id,
        first_name: newMessage.sender.firstName || '',
        last_name: newMessage.sender.lastName || '',
        avatar_url: newMessage.sender.avatar,
        university: newMessage.sender.university
      },
      receiver: {
        id: newMessage.receiver.id,
        first_name: newMessage.receiver.firstName || '',
        last_name: newMessage.receiver.lastName || '',
        avatar_url: newMessage.receiver.avatar,
        university: newMessage.receiver.university
      },
      product: newMessage.product
    }

    return NextResponse.json({
      success: true,
      data: formattedMessage,
      message: "Message sent successfully"
    })

  } catch (error) {
    console.error("Send message API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}