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

    // Get all messages where the user is either sender or receiver
    const allMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.userId },
          { receiverId: user.userId }
        ]
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group messages by conversation
    const conversationsMap = new Map()

    allMessages.forEach((message) => {
      const otherUserId = message.senderId === user.userId ? message.receiverId : message.senderId
      const otherUser = message.senderId === user.userId ? message.receiver : message.sender
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          id: otherUserId,
          user: {
            id: otherUser.id,
            first_name: otherUser.firstName || '',
            last_name: otherUser.lastName || '',
            avatar_url: otherUser.avatar,
            university: otherUser.university
          },
          lastMessage: {
            id: message.id,
            content: message.content,
            read: message.read,
            product_id: message.productId,
            created_at: message.createdAt.toISOString(),
            updated_at: message.updatedAt.toISOString(),
            sender_id: message.senderId,
            receiver_id: message.receiverId,
            sender: {
              id: message.sender.id,
              first_name: message.sender.firstName || '',
              last_name: message.sender.lastName || '',
              avatar_url: message.sender.avatar,
              university: message.sender.university
            },
            receiver: {
              id: message.receiver.id,
              first_name: message.receiver.firstName || '',
              last_name: message.receiver.lastName || '',
              avatar_url: message.receiver.avatar,
              university: message.receiver.university
            }
          },
          unreadCount: 0,
          messages: []
        })
      }
      
      const conversation = conversationsMap.get(otherUserId)
      
      // Count unread messages (messages sent to current user that are unread)
      if (message.receiverId === user.userId && !message.read) {
        conversation.unreadCount++
      }
      
      // Update last message if this one is more recent
      const currentLastMessageTime = new Date(conversation.lastMessage.created_at).getTime()
      const messageTime = new Date(message.createdAt).getTime()
      
      if (messageTime > currentLastMessageTime) {
        conversation.lastMessage = {
          id: message.id,
          content: message.content,
          read: message.read,
          product_id: message.productId,
          created_at: message.createdAt.toISOString(),
          updated_at: message.updatedAt.toISOString(),
          sender_id: message.senderId,
          receiver_id: message.receiverId,
          sender: {
            id: message.sender.id,
            first_name: message.sender.firstName || '',
            last_name: message.sender.lastName || '',
            avatar_url: message.sender.avatar,
            university: message.sender.university
          },
          receiver: {
            id: message.receiver.id,
            first_name: message.receiver.firstName || '',
            last_name: message.receiver.lastName || '',
            avatar_url: message.receiver.avatar,
            university: message.receiver.university
          }
        }
      }
    })

    // Convert map to array and sort by last message time
    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    )

    return NextResponse.json({
      success: true,
      data: conversations
    })

  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}