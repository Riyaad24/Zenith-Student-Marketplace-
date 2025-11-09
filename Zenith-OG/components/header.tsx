"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, ShoppingCart, User, ChevronDown, BookOpen, MessageSquare, LogOut, Laptop, GraduationCap, HelpCircle, Info, Mail, Grid3X3 } from "lucide-react"
import ZenithLogo from "@/components/ZenithLogo"
import NotificationDropdown from "@/components/notification-dropdown"
import WishlistDropdown from "@/components/wishlist-dropdown"

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, loading, signOut } = useAuth()
  const { getItemCount } = useCart()
  const navDropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  const cartItemCount = getItemCount()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
        setIsNavDropdownOpen(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNavDropdownOpen(false)
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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

  // Navigation menu data
  const navigationMenu = {
    categories: [
      {
        title: "Textbooks & Study Materials",
        href: "/categories/textbooks",
        icon: BookOpen,
        description: "Academic textbooks, study guides, and course materials"
      },
      {
        title: "Electronics & Tech",
        href: "/categories/electronics", 
        icon: Laptop,
        description: "Laptops, tablets, calculators, and tech essentials"
      },
      {
        title: "Tutoring Services",
        href: "/categories/tutoring",
        icon: GraduationCap,
        description: "One-on-one tutoring and academic support"
      },
      {
        title: "Study Notes",
        href: "/categories/notes",
        icon: MessageSquare,
        description: "Student notes and study materials"
      }
    ],
    pages: [
      {
        title: "Browse All Products", 
        href: "/browse",
        icon: Grid3X3,
        description: "Explore all available items"
      },
      {
        title: "FAQ",
        href: "/faq",
        icon: HelpCircle,
        description: "Frequently asked questions"
      },
      {
        title: "About Us",
        href: "/about",
        icon: Info,
        description: "Learn about Zenith Marketplace"
      },
      {
        title: "Contact",
        href: "/contact",
        icon: Mail,
        description: "Get in touch with our team"
      }
    ]
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

        {/* Navigation Dropdown - Left of Search */}
        <div className="relative mr-4" ref={navDropdownRef}>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 border border-transparent hover:border-purple-200"
            onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
            aria-expanded={isNavDropdownOpen}
            aria-haspopup="true"
            aria-label="Browse categories and pages"
          >
            <Menu className="h-5 w-5" />
            <span className="hidden md:inline font-medium">Browse</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isNavDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Navigation Dropdown Menu */}
          {isNavDropdownOpen && (
            <>
              {/* Mobile backdrop */}
              <div className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" onClick={() => setIsNavDropdownOpen(false)} />
              
              <div className="absolute left-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-50">
                {/* Categories Section */}
                <div className="px-4 pb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Categories</h3>
                  <div className="grid gap-2">
                    {navigationMenu.categories.map((category) => {
                      const IconComponent = category.icon
                      return (
                        <Link
                          key={category.href}
                          href={category.href}
                          className="flex items-start p-3 rounded-lg hover:bg-purple-50 hover:border-purple-200 border border-transparent transition-all duration-200 group"
                          onClick={() => setIsNavDropdownOpen(false)}
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                            <IconComponent className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-purple-700 truncate">{category.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{category.description}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Pages Section */}
                <div className="px-4 pt-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Quick Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {navigationMenu.pages.map((page) => {
                      const IconComponent = page.icon
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          className="flex items-center p-2 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                          onClick={() => setIsNavDropdownOpen(false)}
                        >
                          <IconComponent className="h-4 w-4 text-gray-400 group-hover:text-purple-600 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 truncate">{page.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="border-t border-gray-100 mt-4 pt-4 px-4">
                  <Link
                    href="/sell"
                    className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    onClick={() => setIsNavDropdownOpen(false)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Selling
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

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
              <div className="hidden md:flex items-center relative" ref={userDropdownRef}>
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
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        {user.isAdmin && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      {user.university && (
                        <p className="text-xs text-purple-600 font-medium mt-1">{user.university}</p>
                      )}
                    </div>
                    <div className="py-1">
                      {user.isAdmin && (
                        <Link 
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 mx-2 rounded-lg transition-colors duration-150 mb-1"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <GraduationCap className="h-4 w-4 mr-3" />
                          Admin Dashboard
                        </Link>
                      )}
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
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      {user.isAdmin && (
                        <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    {user.university && (
                      <p className="text-xs text-purple-600 font-medium mt-1">{user.university}</p>
                    )}
                  </div>
                  <div className="py-1">
                    {user.isAdmin && (
                      <Link 
                        href="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 mx-2 rounded-lg transition-colors duration-150 mb-1"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <GraduationCap className="h-4 w-4 mr-3" />
                        Admin Dashboard
                      </Link>
                    )}
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