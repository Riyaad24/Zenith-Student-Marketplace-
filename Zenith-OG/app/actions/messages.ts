"use server"

import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function sendMessage(formData: FormData) {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in to send messages" }
  }

  const messageData = {
    sender_id: user.id,
    receiver_id: formData.get("receiver_id") as string,
    product_id: formData.get("product_id") as string,
    content: formData.get("content") as string,
  }

  try {
    const { data, error } = await supabase.from("messages").insert(messageData).select().single()

    if (error) throw error

    return { success: true, message: "Message sent successfully!", data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getMessages(conversationWith?: string) {
  const supabase = createServerClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be logged in" }
  }

  let query = supabase
    .from("messages")
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey (first_name, last_name, avatar_url),
      receiver:profiles!messages_receiver_id_fkey (first_name, last_name, avatar_url),
      products (title, images)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

  if (conversationWith) {
    query = query.or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},receiver_id.eq.${user.id})`,
    )
  }

  const { data, error } = await query.order("created_at", { ascending: true })

  if (error) throw error
  return { success: true, data }
}
