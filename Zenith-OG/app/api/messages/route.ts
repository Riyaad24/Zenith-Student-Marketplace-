import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { cookies } from "next/headers"

async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('sb-access-token') || cookieStore.get('sb-bjqwjqnqqttpbqafixdy-auth-token')
    
    if (!authCookie?.value) {
      return null
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(authCookie.value)
    
    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

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
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (
          id,
          first_name, 
          last_name, 
          avatar_url,
          university
        ),
        receiver:profiles!messages_receiver_id_fkey (
          id,
          first_name, 
          last_name, 
          avatar_url,
          university
        )
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

    if (conversationWith) {
      query = query.or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},receiver_id.eq.${user.id})`
      )
    }

    const { data: messages, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching messages:", error)
      return NextResponse.json(
        { success: false, message: "Failed to fetch messages" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: messages || [],
      pagination: {
        page,
        limit,
        total: messages?.length || 0
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
    const user = await getCurrentUser()

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

    const messageData = {
      sender_id: user.id,
      receiver_id: receiverId,
      content: content.trim(),
      product_id: productId || null,
      read: false
    }

    const { data: newMessage, error } = await supabaseAdmin
      .from("messages")
      .insert(messageData)
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (
          id,
          first_name, 
          last_name, 
          avatar_url,
          university
        ),
        receiver:profiles!messages_receiver_id_fkey (
          id,
          first_name, 
          last_name, 
          avatar_url,
          university
        )
      `)
      .single()

    if (error) {
      console.error("Error sending message:", error)
      return NextResponse.json(
        { success: false, message: "Failed to send message" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newMessage,
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