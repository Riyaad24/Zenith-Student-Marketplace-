"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/auth-provider'

export function useNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        setUnreadCount(0)
        return
      }

      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count || 0)
      } else if (response.status === 401) {
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch count on mount and when user changes
  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  // Poll for updates every 30 seconds
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [user, fetchUnreadCount])

  // Function to manually refresh the count
  const refreshCount = useCallback(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  // Function to decrement count (when marking as read)
  const decrementCount = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  // Function to reset count to zero (when marking all as read)
  const resetCount = useCallback(() => {
    setUnreadCount(0)
  }, [])

  return {
    unreadCount,
    loading,
    refreshCount,
    decrementCount,
    resetCount
  }
}
