import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

interface JWTPayload {
  userId: string
  email: string
}

export const dynamic = 'force-dynamic'

// Server-Sent Events for real-time message updates
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return new Response('Unauthorized', { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    const userId = decoded.userId

    // Create a readable stream for SSE
    const encoder = new TextEncoder()
    
    const customReadable = new ReadableStream({
      async start(controller) {
        // Send initial connection message
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`)
        )

        // Poll for new messages every 2 seconds
        const interval = setInterval(async () => {
          try {
            // Get the latest message timestamp from the request
            const url = new URL(request.url)
            const since = url.searchParams.get('since')
            
            // Query for new messages
            const where: any = {
              OR: [
                { senderId: userId },
                { receiverId: userId }
              ]
            }

            if (since) {
              where.createdAt = {
                gt: new Date(since)
              }
            }

            const newMessages = await prisma.message.findMany({
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
                }
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 50
            })

            if (newMessages.length > 0) {
              const formattedMessages = newMessages.map(msg => ({
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
                }
              }))

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'messages', data: formattedMessages })}\n\n`)
              )
            }

            // Send heartbeat to keep connection alive
            controller.enqueue(encoder.encode(`: heartbeat\n\n`))
          } catch (error) {
            console.error('SSE polling error:', error)
          }
        }, 2000) // Poll every 2 seconds

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          clearInterval(interval)
          controller.close()
        })
      }
    })

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })
  } catch (error) {
    console.error('SSE error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
