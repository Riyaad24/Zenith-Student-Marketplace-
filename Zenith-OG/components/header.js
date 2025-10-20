"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, ShoppingCart, User, Heart, ChevronDown, BookOpen, MessageSquare, Laptop, Bell } from "lucide-react"
import ZenithLogo from "@/components/ZenithLogo"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm" style={{ display: 'block', visibility: 'visible' }}>
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl" style={{ minHeight: '64px' }}>
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 flex items-center justify-center">
            {/* Primary: External SVG file */}
            <img 
              src="/logo/zenith-logo.svg" 
              alt="Zenith Student Marketplace Logo" 
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              width={32}
              height={32}
              onError={(e) => {
                // Fallback: Hide img and show inline SVG component
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            {/* Fallback: Inline SVG Component */}
            <div style={{ display: 'none' }}>
              <ZenithLogo className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>
          <span className="font-bold text-xl text-gray-900 hidden sm:block group-hover:text-purple-700 transition-colors duration-200">
            Zenith
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4" style={{ display: 'flex', alignItems: 'center' }}>
          {/* Enhanced Pure CSS Hover Dropdown Menu */}
          <div className="dropdown-container" style={{ position: 'relative' }}>
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-gray-700 hover:text-purple-700 transition-all duration-300 ease-in-out hover:bg-purple-50 px-4 py-2 border border-transparent hover:border-purple-200"
              style={{ display: 'flex', alignItems: 'center', minWidth: 'auto' }}
            >
              Menu
              <ChevronDown className="ml-2 h-4 w-4 chevron-icon" />
            </Button>
            
            {/* Enhanced Dropdown Menu */}
            <div className="dropdown-menu">
              <div className="dropdown-arrow"></div>
              
              {/* Browse Section */}
              <div className="dropdown-section">
                <Link href="/browse" className="dropdown-title">
                  <Search className="h-4 w-4 icon" />
                  Browse All Products
                </Link>
                <div className="dropdown-subsection">
                  <Link href="/browse?category=new" className="dropdown-item">
                    New Arrivals
                  </Link>
                  <Link href="/browse?category=popular" className="dropdown-item">
                    Popular Items
                  </Link>
                  <Link href="/browse?category=featured" className="dropdown-item">
                    Featured Products
                  </Link>
                </div>
              </div>
              
              {/* Categories Section */}
              <div className="dropdown-section">
                <Link href="/categories" className="dropdown-title">
                  <Menu className="h-4 w-4 icon" />
                  Categories
                </Link>
                <div className="dropdown-subsection">
                  <Link href="/categories/textbooks" className="dropdown-item">
                    <BookOpen className="h-3 w-3 mr-2 text-purple-500" />
                    Textbooks
                  </Link>
                  <Link href="/categories/notes" className="dropdown-item">
                    <MessageSquare className="h-3 w-3 mr-2 text-purple-500" />
                    Study Notes
                  </Link>
                  <Link href="/categories/electronics" className="dropdown-item">
                    <Laptop className="h-3 w-3 mr-2 text-purple-500" />
                    Electronics
                  </Link>
                  <Link href="/categories/tutoring" className="dropdown-item">
                    <User className="h-3 w-3 mr-2 text-purple-500" />
                    Tutoring
                  </Link>
                </div>
              </div>
              
              {/* Other Actions */}
              <div className="dropdown-section">
                <Link href="/sell" className="dropdown-title">
                  <ShoppingCart className="h-4 w-4 icon" />
                  Sell Items
                </Link>
                <Link href="/messages" className="dropdown-title">
                  <MessageSquare className="h-4 w-4 icon" />
                  Messages
                </Link>
                <Link href="/account" className="dropdown-title">
                  <User className="h-4 w-4 icon" />
                  My Account
                </Link>
              </div>
              
              {/* Support & Info */}
              <div className="dropdown-section">
                <Link href="/help" className="dropdown-title">
                  <svg className="h-4 w-4 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                  Help & Support
                </Link>
                <Link href="/about" className="dropdown-title">
                  <Heart className="h-4 w-4 icon" />
                  About Us
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-6" style={{ display: 'flex', minWidth: '300px' }}>
          <div className="relative flex-1" style={{ minWidth: '250px' }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search textbooks, electronics, tutoring..." 
              className="pl-10 bg-white border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900" 
              style={{ width: '100%', minWidth: '250px' }}
            />
          </div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white px-4 whitespace-nowrap" style={{ minWidth: 'auto' }}>
            Search
          </Button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-purple-50 hover:text-purple-700 text-gray-700 p-2" style={{ position: 'relative' }}>
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold" style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          
          {/* Wishlist */}
          <Button variant="ghost" size="sm" className="relative hover:bg-purple-50 hover:text-purple-700 text-gray-700 p-2">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          
          {/* Shopping Cart */}
          <Button variant="ghost" size="sm" className="relative hover:bg-purple-50 hover:text-purple-700 text-gray-700 p-2" style={{ position: 'relative' }}>
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold" style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
              0
            </span>
            <span className="sr-only">Shopping Cart</span>
          </Button>
          
          {/* User Profile */}
          <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-700 text-gray-700 p-2">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
          
          {/* Authentication Buttons */}
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-4 py-2 font-semibold" style={{ minWidth: 'auto' }}>
              Sign In
            </Button>
          </Link>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 font-semibold" style={{ minWidth: 'auto' }}>
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden transition-all duration-200 hover:scale-110 text-gray-700 hover:text-purple-700 p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="relative w-5 h-5" style={{ position: 'relative' }}>
            <Menu className={`h-5 w-5 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} style={{ position: 'absolute' }} />
            <X className={`h-5 w-5 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} style={{ position: 'absolute' }} />
          </div>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1">
              {/* Simplified Mobile Menu */}
              <Link href="/browse" className="text-sm font-medium hover:text-purple-700 transition-colors py-2 px-2 rounded hover:bg-purple-50" onClick={() => setIsMenuOpen(false)}>
                � Browse Products
              </Link>
              
              <div className="pl-4 space-y-1">
                <Link href="/browse?category=new" className="text-xs text-muted-foreground hover:text-purple-700 transition-colors py-1 block" onClick={() => setIsMenuOpen(false)}>
                  • New Arrivals
                </Link>
                <Link href="/browse?category=popular" className="text-xs text-muted-foreground hover:text-purple-700 transition-colors py-1 block" onClick={() => setIsMenuOpen(false)}>
                  • Popular Items
                </Link>
              </div>

              <Link href="/categories" className="text-sm font-medium hover:text-purple-700 transition-colors py-2 px-2 rounded hover:bg-purple-50" onClick={() => setIsMenuOpen(false)}>
                � Categories
              </Link>
              
              <div className="pl-4 space-y-1">
                <Link href="/categories/textbooks" className="text-xs text-muted-foreground hover:text-purple-700 transition-colors py-1 block" onClick={() => setIsMenuOpen(false)}>
                  � Textbooks
                </Link>
                <Link href="/categories/electronics" className="text-xs text-muted-foreground hover:text-purple-700 transition-colors py-1 block" onClick={() => setIsMenuOpen(false)}>
                  � Electronics
                </Link>
              </div>

              <Link href="/sell" className="text-sm font-medium hover:text-purple-700 transition-colors py-2 px-2 rounded hover:bg-purple-50" onClick={() => setIsMenuOpen(false)}>
                💰 Sell
              </Link>
              
              <Link href="/about" className="text-sm font-medium hover:text-purple-700 transition-colors py-2 px-2 rounded hover:bg-purple-50" onClick={() => setIsMenuOpen(false)}>
                ℹ️ About
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t">
              <Button variant="ghost" size="sm" className="flex items-center justify-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center justify-center">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>

            <div className="flex space-x-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button size="sm" className="w-full">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
