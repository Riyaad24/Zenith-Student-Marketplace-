'use client'

import { useState, useEffect } from 'react'
import SplashScreen from './splash-screen-video'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // TEMPORARILY DISABLED - Always show splash screen for testing
    // const hasSeenSplash = sessionStorage.getItem('zenith-splash-seen')
    const hasSeenSplash = false // Force splash screen to always show for testing
    
    if (hasSeenSplash) {
      // Skip splash screen if already seen in this session
      setIsLoading(false)
      setShowContent(true)
      setIsInitialLoad(false)
    } else {
      // Show splash screen for first-time visitors
      setIsInitialLoad(true)
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
        duration={8000} // 8 seconds to allow video to play and debug
      />
    )
  }

  // Show main content with fade-in animation
  return (
    <div 
      className={`min-h-screen transition-opacity duration-500 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}