'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Cookie, Settings, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted))
    
    // Enable analytics if accepted
    if (typeof window !== 'undefined') {
      const gtag = (window as any).gtag
      if (gtag) {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted'
        })
      }
    }
    
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleDeclineAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary))
    
    // Deny analytics if declined
    if (typeof window !== 'undefined') {
      const gtag = (window as any).gtag
      if (gtag) {
        gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied'
        })
      }
    }
    
    setPreferences(onlyNecessary)
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleSavePreferences = () => {
    const savedPreferences = {
      ...preferences,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('cookie-consent', JSON.stringify(savedPreferences))
    
    // Update consent based on preferences
    if (typeof window !== 'undefined') {
      const gtag = (window as any).gtag
      if (gtag) {
        gtag('consent', 'update', {
          'analytics_storage': preferences.analytics ? 'granted' : 'denied',
          'ad_storage': preferences.marketing ? 'granted' : 'denied'
        })
      }
    }
    
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
        <Card className="max-w-5xl mx-auto pointer-events-auto shadow-2xl border-2 border-purple-200 bg-white/95 backdrop-blur-sm">
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              {/* Cookie Icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-purple-600" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  🍪 We Value Your Privacy
                </h3>
                <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  Cookies help us provide you with a better, faster, and safer experience on Zenith Student Marketplace. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline font-medium">
                    Learn more
                  </a>
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept All Cookies
                  </Button>
                  <Button
                    onClick={handleDeclineAll}
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-2.5 rounded-lg transition-all duration-200"
                  >
                    Decline All
                  </Button>
                  <Button
                    onClick={handleOpenSettings}
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Customize Settings
                  </Button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDeclineAll}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close cookie banner"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Cookie className="w-6 h-6 text-purple-600" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="necessary" className="text-base font-semibold text-gray-900">
                    Necessary Cookies
                  </Label>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are essential for the website to function properly. They enable basic features like 
                  page navigation, access to secure areas, and remembering your login status.
                </p>
              </div>
              <Switch
                id="necessary"
                checked={preferences.necessary}
                disabled
                className="mt-1"
              />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <div className="flex-1 pr-4">
                <Label htmlFor="functional" className="text-base font-semibold text-gray-900 mb-2 block">
                  Functional Cookies
                </Label>
                <p className="text-sm text-gray-600">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences 
                  (language, region), wishlist items, and cart contents.
                </p>
              </div>
              <Switch
                id="functional"
                checked={preferences.functional}
                onCheckedChange={(checked: boolean) =>
                  setPreferences({ ...preferences, functional: checked })
                }
                className="mt-1"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <div className="flex-1 pr-4">
                <Label htmlFor="analytics" className="text-base font-semibold text-gray-900 mb-2 block">
                  Analytics Cookies
                </Label>
                <p className="text-sm text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. This helps us improve the user experience.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked: boolean) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
                className="mt-1"
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <div className="flex-1 pr-4">
                <Label htmlFor="marketing" className="text-base font-semibold text-gray-900 mb-2 block">
                  Marketing Cookies
                </Label>
                <p className="text-sm text-gray-600">
                  These cookies track your online activity to help advertisers deliver more relevant advertising or 
                  to limit how many times you see an ad. They may be shared with other organizations.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked: boolean) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Dialog Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={handleSavePreferences}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Save Preferences
            </Button>
            <Button
              onClick={handleAcceptAll}
              variant="outline"
              className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-2.5 rounded-lg transition-all duration-200"
            >
              Accept All
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            You can change your preferences at any time by visiting our{' '}
            <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
              Privacy Policy
            </a>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
