'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export default function SplashScreen({ onComplete, duration = 5000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Show content after a short delay
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 200)

    // Auto-complete timer as backup
    const timer = setTimeout(() => {
      handleComplete()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(contentTimer)
    }
  }, [onComplete, duration])

  const handleVideoLoaded = () => {
    setVideoLoaded(true)
    // Auto-play the video
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Auto-play prevented:', error)
      })
    }
  }

  const handleVideoEnded = () => {
    // Video finished playing, start exit
    handleComplete()
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(onComplete, 800)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Video */}
            <motion.video
              ref={videoRef}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: videoLoaded ? 1 : 0,
                scale: videoLoaded ? 1 : 1.1 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-contain max-w-4xl max-h-4xl"
              muted
              playsInline
              preload="auto"
              onLoadedData={handleVideoLoaded}
              onEnded={handleVideoEnded}
            >
              <source src="/zenith-logo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </motion.video>

            {/* Loading indicator while video loads */}
            <AnimatePresence>
              {!videoLoaded && showContent && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    {/* Loading Spinner */}
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm font-medium">Loading Zenith...</p>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Subtle brand text overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: videoLoaded ? 0.8 : 0, y: videoLoaded ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-gray-700 text-sm font-light"
              >
                Student Marketplace
              </motion.p>
            </div>

            {/* Skip button */}
            <div className="absolute top-6 right-6">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: videoLoaded ? 0.7 : 0 }}
                transition={{ duration: 0.5, delay: 2 }}
                onClick={handleComplete}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Skip →
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}