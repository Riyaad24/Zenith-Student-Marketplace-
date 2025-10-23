"use client"

import { useEffect, useState, useCallback, useRef } from "react"

interface Message {
  id: string
  content: string
  read: boolean
  product_id?: string
  created_at: string
  updated_at: string
  sender_id: string
  receiver_id: string
  sender: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    university?: string
  }
  receiver: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    university?: string
  }
}

interface Conversation {
  id: string
  user: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    university?: string
  }
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

interface UseMessagingOptions {
  pollInterval?: number
  enablePolling?: boolean
}

export function useMessaging(options: UseMessagingOptions = {}) {
  const { pollInterval = 3000, enablePolling = true } = options
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMessageTimestamp = useRef<string | null>(null)

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch("/api/messages/conversations")
      const data = await response.json()
      
      if (data.success) {
        setConversations(data.data)
        setError(null)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Failed to fetch conversations")
      console.error("Error fetching conversations:", err)
    }
  }, [])

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationWith: string) => {
    try {
      const response = await fetch(`/api/messages?conversationWith=${conversationWith}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        const sortedMessages = data.data.sort(
          (a: Message, b: Message) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        setMessages(sortedMessages)
        
        // Update last message timestamp
        if (sortedMessages.length > 0) {
          lastMessageTimestamp.current = sortedMessages[sortedMessages.length - 1].created_at
        }
        
        setError(null)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Failed to fetch messages")
      console.error("Error fetching messages:", err)
    }
  }, [])

  // Send a new message
  const sendMessage = useCallback(async (receiverId: string, content: string, productId?: string) => {
    if (!content.trim()) return false
    
    setSending(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId,
          content: content.trim(),
          productId,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Add the new message to the current conversation if it matches
        if (activeConversation === receiverId) {
          setMessages(prev => [...prev, data.data])
        }
        
        // Refresh conversations to update last message and unread counts
        await fetchConversations()
        setError(null)
        return true
      } else {
        setError(data.message)
        return false
      }
    } catch (err) {
      setError("Failed to send message")
      console.error("Error sending message:", err)
      return false
    } finally {
      setSending(false)
    }
  }, [activeConversation, fetchConversations])

  // Mark messages as read
  const markAsRead = useCallback(async (conversationWith: string) => {
    try {
      const response = await fetch("/api/messages/read", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationWith,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update local state to mark messages as read
        setMessages(prev => 
          prev.map(msg => 
            msg.sender_id === conversationWith ? { ...msg, read: true } : msg
          )
        )
        
        // Update conversations to reset unread count
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationWith ? { ...conv, unreadCount: 0 } : conv
          )
        )
        
        setError(null)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError("Failed to mark messages as read")
      console.error("Error marking as read:", err)
    }
  }, [])

  // Set active conversation and fetch its messages
  const openConversation = useCallback(async (userId: string) => {
    setActiveConversation(userId)
    await fetchMessages(userId)
    await markAsRead(userId)
  }, [fetchMessages, markAsRead])

  // Real-time polling for new messages
  const startPolling = useCallback(() => {
    if (!enablePolling) return
    
    pollIntervalRef.current = setInterval(async () => {
      // Refresh conversations for new messages and unread counts
      await fetchConversations()
      
      // If we have an active conversation, check for new messages
      if (activeConversation) {
        await fetchMessages(activeConversation)
      }
    }, pollInterval)
  }, [enablePolling, pollInterval, fetchConversations, fetchMessages, activeConversation])

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }, [])

  // Initialize and start polling
  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      await fetchConversations()
      setLoading(false)
      startPolling()
    }
    
    initialize()
    
    return () => {
      stopPolling()
    }
  }, [fetchConversations, startPolling, stopPolling])

  // Restart polling when active conversation changes
  useEffect(() => {
    stopPolling()
    startPolling()
  }, [activeConversation, startPolling, stopPolling])

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0)

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    sending,
    error,
    totalUnreadCount,
    sendMessage,
    openConversation,
    markAsRead,
    fetchConversations,
    startPolling,
    stopPolling,
  }
}