"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string | null
  university?: string
  verified?: boolean
  isAdmin?: boolean
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on app load
    checkAuth()
  }, [])

  const checkAuth = async () => {
    console.log('checkAuth: Starting authentication check...')
    try {
      // Check if user is authenticated by calling our API
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
        cache: 'no-store', // Don't cache this request
      })
      
      console.log('checkAuth: API response status:', response.status)
      
      if (response.ok) {
        const userData = await response.json()
        console.log('checkAuth: User data received:', userData)
        const fetchedUser: User = userData.user
        // Determine admin status from email pattern: local part must be 9 digits followed by 'ads' strictly
        const localPart = fetchedUser?.email?.split('@')[0] || ''
        const isAdminMatch = /^[0-9]{9}ads$/i.test(localPart)
        fetchedUser.isAdmin = isAdminMatch
        setUser(fetchedUser)
        console.log('✅ User authenticated:', fetchedUser.email)
      } else {
        const errorData = await response.text()
        console.log('checkAuth: Not authenticated, response:', errorData)
        setUser(null)
        console.log('❌ No user authenticated')
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
      console.log('checkAuth: Complete')
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return { user: null, error: data.error || 'Login failed' }
      }

      // Refresh user data from the auth cookie
      await checkAuth()
      
      // Return the user that was just set by checkAuth
      return { user: data.user || null, error: null }
    } catch (error: any) {
      return { user: null, error: error.message || 'Login failed' }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return { user: null, error: data.error || 'Registration failed' }
      }

      // Refresh user data from the auth cookie
      await checkAuth()
      
      // Return the user that was just set by checkAuth
      return { user: data.user || null, error: null }
    } catch (error: any) {
      return { user: null, error: error.message || 'Registration failed' }
    }
  }

  const signOut = async () => {
    try {
      // Call logout API to clear cookie
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Clear user state regardless of API response
      setUser(null)
      localStorage.removeItem('auth-token')
      
      if (!response.ok) {
        console.error('Logout API failed, but local state cleared')
      }
      
      return { error: null }
    } catch (error: any) {
      // Still clear local state even if API fails
      setUser(null)
      localStorage.removeItem('auth-token')
      return { error: error.message }
    }
  }

  const refreshUser = async () => {
    console.log('Refreshing user authentication...')
    await checkAuth()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}