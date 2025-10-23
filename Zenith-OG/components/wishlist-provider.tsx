'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/components/auth-provider'

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  condition: string
  status: string
  available: boolean
  location?: string
  university?: string
  createdAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  seller: {
    id: string
    name: string
    avatar?: string
  }
}

interface WishlistItem {
  id: string
  addedAt: string
  product: Product
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  getWishlistCount: () => number
  refreshWishlist: () => Promise<void>
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Load wishlist when user changes
  useEffect(() => {
    if (user) {
      refreshWishlist()
    } else {
      setWishlistItems([])
    }
  }, [user])

  const getAuthToken = () => {
    return localStorage.getItem('auth-token')
  }

  const refreshWishlist = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = getAuthToken()
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setWishlistItems(data.wishlist)
      } else if (response.status === 401) {
        // User not authenticated, clear wishlist
        setWishlistItems([])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const token = getAuthToken()
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        const newItem = await response.json()
        setWishlistItems(prev => [newItem, ...prev])
        return true
      } else if (response.status === 409) {
        // Item already in wishlist
        return false
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
    return false
  }

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
        return true
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
    return false
  }

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product.id === productId)
  }

  const getWishlistCount = (): number => {
    return wishlistItems.length
  }

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    refreshWishlist,
    loading
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}