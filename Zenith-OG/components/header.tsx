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
  const [searchQuery, setSearchQuery] = useState("")
  const { user, loading, signOut } = useAuth()
  const { getItemCount } = useCart()

  const cartItemCount = getItemCount()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/' // Redirect to home after logout
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to dedicated search page for better search experience
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    } else {
      window.location.href = '/browse'
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
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
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-purple-900 transition-all duration-300">
              Zenith
            </span>
            <span className="text-xs text-gray-500 font-medium -mt-1 group-hover:text-gray-600 transition-colors duration-300">
              Student Marketplace
            </span>
          </div>
        </Link>

        {/* Enhanced Search Section - More Prominent */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search for books, electronics, study materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full pl-12 pr-20 h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 placeholder-gray-500"
            />
            <Button 
              type="submit"
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Search
            </Button>
          </form>
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

          {/* Authentication Section - Clean and Intuitive */}
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : user ? (
            <>
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-purple-50 rounded-xl"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 border border-transparent hover:border-purple-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium text-gray-700 max-w-24 truncate">
                    {user.firstName || user.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      {user.university && (
                        <p className="text-xs text-purple-600 font-medium mt-1">{user.university}</p>
                      )}
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Account
                      </Link>
                      <Link 
                        href="/sell"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <BookOpen className="h-4 w-4 mr-3" />
                        Sell Items
                      </Link>
                      <Link 
                        href="/messages"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <MessageSquare className="h-4 w-4 mr-3" />
                        Messages
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Dropdown */}
              {isDropdownOpen && (
                <div className="md:hidden absolute right-4 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    {user.university && (
                      <p className="text-xs text-purple-600 font-medium mt-1">{user.university}</p>
                    )}
                  </div>
                  <div className="py-1">
                    <Link 
                      href="/account"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Account
                    </Link>
                    <Link 
                      href="/sell"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BookOpen className="h-4 w-4 mr-3" />
                      Sell Items
                    </Link>
                    <Link 
                      href="/messages"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4 mr-3" />
                      Messages
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Guest Actions - Clean and Inviting */}
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-6 py-2 font-bold rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200"
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}