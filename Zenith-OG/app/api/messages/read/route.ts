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

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { messageIds, conversationWith } = body

    let updateQuery

    if (messageIds && Array.isArray(messageIds)) {
      // Mark specific messages as read
      updateQuery = supabaseAdmin
        .from("messages")
        .update({ read: true })
        .in("id", messageIds)
        .eq("receiver_id", user.id)
    } else if (conversationWith) {
      // Mark all messages in conversation as read
      updateQuery = supabaseAdmin
        .from("messages")
        .update({ read: true })
        .eq("sender_id", conversationWith)
        .eq("receiver_id", user.id)
        .eq("read", false)
    } else {
      return NextResponse.json(
        { success: false, message: "Either messageIds or conversationWith is required" },
        { status: 400 }
      )
    }

    const { error } = await updateQuery

    if (error) {
      console.error("Error marking messages as read:", error)
      return NextResponse.json(
        { success: false, message: "Failed to mark messages as read" },
        { status: 500 }
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