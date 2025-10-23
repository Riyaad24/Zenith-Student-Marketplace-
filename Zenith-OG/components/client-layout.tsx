'use client'

import { useState, useEffect } from 'react'
import { AuthProvider } from './auth-provider'
import { CartProvider } from './cart-provider'
import { WishlistProvider } from './wishlist-provider'
import SplashScreen from './splash-screen-video'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Force splash screen to always show - clear any existing session storage
    sessionStorage.removeItem('zenith-splash-seen')
    const hasSeenSplash = false // Force splash screen to always show for testing
    
    console.log('ClientLayout mounted - showing splash screen')
    
    if (hasSeenSplash) {
      // Skip splash screen if already seen in this session
      setIsLoading(false)
      setShowContent(true)
      setIsInitialLoad(false)
    } else {
      // Show splash screen for first-time visitors
      setIsInitialLoad(true)
      setIsLoading(true)
    }

    // Also check if page is already loaded
    if (document.readyState === 'complete') {
      if (hasSeenSplash) {
        setIsLoading(false)
        setShowContent(true)
      }
    } else {
      // Wait for page to load
      const handleLoad = () => {
        if (hasSeenSplash) {
          setIsLoading(false)
          setShowContent(true)
        }
      }
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  const handleSplashComplete = () => {
    // Mark splash as seen for this session
    sessionStorage.setItem('zenith-splash-seen', 'true')
    setIsLoading(false)
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowContent(true)
    }, 100)
  }

  // Show splash screen on first visit
  if (isLoading && isInitialLoad) {
    return (
      <SplashScreen 
        onComplete={handleSplashComplete}
        duration={6000} // 6 seconds for optimal experience
      />
    )
  }

  // Show main content with fade-in animation
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div 
            className={`min-h-screen transition-opacity duration-500 ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {children}
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}