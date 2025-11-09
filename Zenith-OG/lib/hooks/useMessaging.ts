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
  enableRealtime?: boolean
}

export function useMessaging(options: UseMessagingOptions = {}) {
  const { pollInterval = 3000, enablePolling = false, enableRealtime = true } = options
  
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMessageTimestamp = useRef<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

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

  // Real-time connection using Server-Sent Events
  const connectRealtime = useCallback(() => {
    if (!enableRealtime) return

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    try {
      const since = lastMessageTimestamp.current || new Date().toISOString()
      const eventSource = new EventSource(`/api/messages/stream?since=${since}`)
      
      eventSource.onopen = () => {
        console.log('Real-time messaging connected')
        setIsConnected(true)
        setError(null)
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'connected') {
            console.log('SSE connection established')
          } else if (data.type === 'messages' && data.data) {
            // Update messages if they match the active conversation
            const newMessages = data.data as Message[]
            if (newMessages.length > 0 && activeConversation) {
              setMessages(prev => {
                const messageIds = new Set(prev.map(m => m.id))
                const uniqueNewMessages = newMessages.filter(
                  m => !messageIds.has(m.id) && 
                  ((m.sender_id === activeConversation || m.receiver_id === activeConversation))
                )
                if (uniqueNewMessages.length > 0) {
                  const combined = [...prev, ...uniqueNewMessages]
                  const sorted = combined.sort(
                    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  )
                  lastMessageTimestamp.current = sorted[sorted.length - 1].created_at
                  return sorted
                }
                return prev
              })
            }

            // Refresh conversations to update unread counts
            fetchConversations()
          }
        } catch (err) {
          console.error('Error parsing SSE message:', err)
        }
      }

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err)
        setIsConnected(false)
        setError('Real-time connection lost. Retrying...')
        
        // Retry connection after 3 seconds
        setTimeout(() => {
          connectRealtime()
        }, 3000)
      }

      eventSourceRef.current = eventSource
    } catch (err) {
      console.error('Failed to establish SSE connection:', err)
      setError('Failed to connect to real-time messaging')
    }
  }, [enableRealtime, activeConversation, fetchConversations])

  const disconnectRealtime = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }, [])

  // Initialize and start real-time connection or polling
  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      await fetchConversations()
      setLoading(false)
      
      // Use real-time connection if enabled, otherwise fall back to polling
      if (enableRealtime) {
        connectRealtime()
      } else if (enablePolling) {
        startPolling()
      }
    }
    
    initialize()
    
    return () => {
      disconnectRealtime()
      stopPolling()
    }
  }, [fetchConversations, connectRealtime, disconnectRealtime, startPolling, stopPolling, enableRealtime, enablePolling])

  // Reconnect when active conversation changes
  useEffect(() => {
    if (enableRealtime) {
      disconnectRealtime()
      connectRealtime()
    } else if (enablePolling) {
      stopPolling()
      startPolling()
    }
  }, [activeConversation, connectRealtime, disconnectRealtime, startPolling, stopPolling, enableRealtime, enablePolling])

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
    isConnected,
    sendMessage,
    openConversation,
    markAsRead,
    fetchConversations,
    startPolling,
    stopPolling,
    connectRealtime,
    disconnectRealtime,
  }
}