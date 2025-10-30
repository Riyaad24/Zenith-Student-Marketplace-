'use client'

import { useState, useEffect } from 'react'
import { AuthProvider } from './auth-provider'
import { CartProvider } from './cart-provider'
import { WishlistProvider } from './wishlist-provider'
import { ToastProvider } from './ui/toast'
import SplashScreen from './splash-screen-video'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true) // Always start with splash screen
  const [showContent, setShowContent] = useState(false) // Hide content initially

  useEffect(() => {
    console.log('ClientLayout mounted - showing splash screen on every page load')
    
    // Always show splash screen on every page load/refresh
    setIsLoading(true)
    setShowContent(false)
  }, [])

  const handleSplashComplete = () => {
    console.log('Splash screen completed, showing main content')
    setIsLoading(false)
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true)
    }, 100)
  }

  // Always show splash screen first
  if (isLoading) {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        duration={5000} // 5 seconds for optimal experience
      />
    )
  }

  // Show main content with fade-in animation
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <div 
              className={`min-h-screen transition-opacity duration-500 ${
                showContent ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {children}
            </div>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}