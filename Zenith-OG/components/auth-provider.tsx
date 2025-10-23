"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string | null
  university?: string
  verified?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  refreshUser: () => void
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
    try {
      // Check if user is authenticated by calling our API
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Mock sign in - replace with actual API call
      const mockUser = {
        id: "1",
        email: email,
        name: "John Doe",
        avatar: null,
      }

      localStorage.setItem("auth_token", "mock_token_123")
      setUser(mockUser)
      return { user: mockUser, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Mock sign up - replace with actual API call
      const mockUser = {
        id: "1",
        email: email,
        name: name,
        avatar: null,
      }

      localStorage.setItem("auth_token", "mock_token_123")
      setUser(mockUser)
      return { user: mockUser, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      // Call logout API to clear cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const refreshUser = () => {
    checkAuth()
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