"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, ShoppingCart, User, ChevronDown, BookOpen, MessageSquare, LogOut } from "lucide-react"
import ZenithLogo from "@/components/ZenithLogo"
import NotificationDropdown from "@/components/notification-dropdown"
import WishlistDropdown from "@/components/wishlist-dropdown"

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, loading, signOut } = useAuth()
  const { getItemCount } = useCart()

  const cartItemCount = getItemCount()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/' // Redirect to home after logout
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-md backdrop-blur-sm">
      <div className="container flex h-24 items-center px-8 mx-auto max-w-[1400px]">
        {/* Enhanced Logo Section - Compact for Better Layout */}
        <Link href="/" className="flex items-center space-x-3 group mr-6">
          <div className="h-14 w-14 flex items-center justify-center bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-all duration-300 shadow-sm">
            {/* Primary: External SVG file */}
            <img 
              src="/logo/zenith-logo.svg" 
              alt="Zenith Student Marketplace Logo" 
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              width={40}
              height={40}
              onError={(e) => {
                // Fallback: Hide img and show inline SVG component
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }}
            />
            {/* Fallback: Inline SVG Component */}
            <div style={{ display: 'none' }}>
              <ZenithLogo className="h-10 w-auto transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <div className="block">
            <span className="font-bold text-xl text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
              Zenith
            </span>
            <p className="text-xs text-gray-500 font-medium -mt-0.5">Student Marketplace</p>
          </div>
        </Link>

        {/* More Dropdown - Compact Positioning */}
        <div className="dropdown-container mr-6">
          <Button 
            variant="ghost" 
            className="text-base font-semibold text-gray-700 hover:text-purple-700 transition-all duration-300 hover:bg-purple-50 px-4 py-2 border border-transparent hover:border-purple-200 rounded-xl"
          >
            More
            <ChevronDown className="ml-2 h-5 w-5 chevron-icon transition-transform duration-200" />
          </Button>
          
          {/* Enhanced Dropdown Menu with Navigation Items */}
          <div className="dropdown-menu">
            <div className="dropdown-arrow"></div>
            
            {/* Navigation Section */}
            <div className="dropdown-section">
              <div className="dropdown-title text-purple-700 font-bold mb-3">
                <Menu className="h-4 w-4 icon inline mr-2" />
                Navigation
              </div>
              <div className="dropdown-subsection">
                <Link href="/browse" className="dropdown-item flex items-center">
                  <Search className="h-4 w-4 mr-3 text-purple-600" />
                  Browse
                </Link>
                <Link href="/categories" className="dropdown-item flex items-center">
                  <BookOpen className="h-4 w-4 mr-3 text-purple-600" />
                  Categories
                </Link>
                <Link href="/sell" className="dropdown-item flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-3 text-purple-600" />
                  Sell
                </Link>
                <Link href="/about" className="dropdown-item flex items-center">
                  <User className="h-4 w-4 mr-3 text-purple-600" />
                  About
                </Link>
              </div>
            </div>
            
            {/* Support Section */}
            <div className="dropdown-section border-t pt-3 mt-3">
              <div className="dropdown-title text-purple-700 font-bold mb-3">
                <MessageSquare className="h-4 w-4 icon inline mr-2" />
                Help & Support
              </div>
              <div className="dropdown-subsection">
                <Link href="/faq" className="dropdown-item">
                  FAQ
                </Link>
                <Link href="/community-guidelines" className="dropdown-item">
                  Community Guidelines
                </Link>
                <Link href="/terms" className="dropdown-item">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="dropdown-item">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar - Button with Proper Spacing */}
        <div className="flex items-center flex-1 max-w-2xl">
          <div className="flex w-full group gap-3">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search for textbooks, electronics, notes, tutoring services..."
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white shadow-lg"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 group-hover:text-purple-600 transition-colors duration-200" />
            </div>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-bold text-base border-2 border-purple-600 hover:border-purple-700"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Right Side Actions - Compact and Well-Spaced */}
        <div className="flex items-center space-x-3 ml-6">
          {/* Icon Actions - Compact and Consistent */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <NotificationDropdown />
            </div>
            
            {/* Wishlist */}
            <div className="relative">
              <WishlistDropdown />
            </div>
          </div>
            
            {/* Shopping Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative hover:bg-purple-50 hover:text-purple-700 text-gray-700 p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
                <span className="sr-only">Shopping Cart ({cartItemCount} items)</span>
              </Button>
            </Link>
          </div>
          
          {/* Authentication Section - Compact */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l-2 border-gray-200">
                  {/* User Profile */}
                  <Link href="/account" className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl px-3 py-2 hover:from-purple-100 hover:to-purple-150 transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="bg-purple-600 text-white rounded-full p-2 shadow-md">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-purple-600 font-medium">View Profile</p>
                    </div>
                  </Link>
                  
                  {/* Enhanced Sign Out Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="border-2 border-red-400 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 px-4 py-2 font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l-2 border-gray-200">
                  <Link href="/login">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-6 py-2 font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}