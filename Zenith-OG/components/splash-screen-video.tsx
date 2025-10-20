'use client'

import { useEffect, useState, useRef } from 'react'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export default function SplashScreen({ onComplete, duration = 8000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-complete timer as backup
    const timer = setTimeout(() => {
      handleComplete()
    }, duration)

    // Force video load after 2 seconds if it hasn't loaded
    const forceLoadTimer = setTimeout(() => {
      if (!videoLoaded && videoRef.current) {
        console.log('Forcing video load...')
        videoRef.current.load()
      }
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(forceLoadTimer)
    }
  }, [onComplete, duration, videoLoaded])

  const handleVideoLoaded = () => {
    console.log('Video loaded successfully')
    setVideoLoaded(true)
    // Auto-play the video
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Auto-play prevented:', error)
        // If autoplay fails, show skip message
      })
    }
  }

  const handleVideoEnded = () => {
    // Video finished playing, start exit
    handleComplete()
  }

  const handleComplete = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 800)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden transition-all duration-800 ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background Video */}
        <video
          ref={videoRef}
          className={`w-full h-full object-contain max-w-4xl max-h-4xl transition-all duration-1000 ${
            videoLoaded ? 'opacity-100 scale-100 blur-none' : 'opacity-0 scale-110 blur-sm'
          }`}
          muted
          playsInline
          preload="auto"
          onLoadedData={handleVideoLoaded}
          onEnded={handleVideoEnded}
          onError={(e) => {
            console.error('Video load error:', e)
            const video = e.target as HTMLVideoElement
            console.error('Video error details:', video.error)
          }}
          onLoadStart={() => console.log('Video load started')}
          onCanPlay={() => console.log('Video can play')}
        >
          <source src="/zenith-logo-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading indicator while video loads */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div 
              className={`flex flex-col items-center transition-all duration-500 ${
                videoLoaded ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
              }`}
            >
              {/* Loading Spinner */}
              <div className="relative">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600 text-sm font-medium">Loading Zenith...</p>
            </div>
          </div>
        )}

        {/* Subtle brand text overlay */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p 
            className={`text-gray-700 text-sm font-light transition-all duration-800 delay-1000 ${
              videoLoaded ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            Student Marketplace
          </p>
        </div>

        {/* Skip button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={handleComplete}
            className={`px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-500 delay-2000 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
              videoLoaded ? 'opacity-70' : 'opacity-0'
            }`}
          >
            Skip →
          </button>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div 
            className={`w-32 h-1 bg-gray-200 rounded-full overflow-hidden transition-opacity duration-500 ${
              videoLoaded ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <div 
              className="h-full bg-purple-600 rounded-full animate-pulse"
              style={{
                width: '100%',
                animation: `progress-fill ${duration}ms linear`
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}