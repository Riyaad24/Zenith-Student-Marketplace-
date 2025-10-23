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

    // Get all messages where the user is either sender or receiver
    const { data: allMessages, error } = await supabaseAdmin
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
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json(
        { success: false, message: "Failed to fetch conversations" },
        { status: 500 }
      )
    }

    // Group messages by conversation
    const conversationsMap = new Map()

    allMessages?.forEach((message) => {
      const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id
      const otherUser = message.sender_id === user.id ? message.receiver : message.sender
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          id: otherUserId,
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
          messages: []
        })
      }
      
      const conversation = conversationsMap.get(otherUserId)
      conversation.messages.push(message)
      
      // Count unread messages (messages sent to current user that are unread)
      if (message.receiver_id === user.id && !message.read) {
        conversation.unreadCount++
      }
      
      // Update last message if this one is more recent
      if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
        conversation.lastMessage = message
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