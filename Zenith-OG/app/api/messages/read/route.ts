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

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { messageIds, conversationWith } = body

    if (messageIds && Array.isArray(messageIds)) {
      // Mark specific messages as read
      await prisma.message.updateMany({
        where: {
          id: {
            in: messageIds
          },
          receiverId: user.userId
        },
        data: {
          read: true
        }
      })
    } else if (conversationWith) {
      // Mark all messages in conversation as read
      await prisma.message.updateMany({
        where: {
          senderId: conversationWith,
          receiverId: user.userId,
          read: false
        },
        data: {
          read: true
        }
      })
    } else {
      return NextResponse.json(
        { success: false, message: "Either messageIds or conversationWith is required" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Messages marked as read"
    })

  } catch (error) {
    console.error("Mark as read API error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}