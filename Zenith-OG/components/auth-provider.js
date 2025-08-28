"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on app load
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        // In a real app, you would validate the token with your backend
        // For now, we'll just set a mock user
        setUser({
          id: "1",
          email: "user@example.com",
          name: "John Doe",
          avatar: null,
        })
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
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
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  const signUp = async (email, password, name) => {
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
    } catch (error) {
      return { user: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem("auth_token")
      setUser(null)
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
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
