"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, ShoppingCart, User, Heart } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-purple-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <span className="font-bold text-xl">Zenith</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/browse" className="text-sm font-medium hover:text-purple-700 transition-colors">
            Browse
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-purple-700 transition-colors">
            Categories
          </Link>
          <Link href="/sell" className="text-sm font-medium hover:text-purple-700 transition-colors">
            Sell
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-purple-700 transition-colors">
            About
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-8" />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Join Now</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link href="/browse" className="text-sm font-medium hover:text-purple-700 transition-colors py-2">
                Browse
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:text-purple-700 transition-colors py-2">
                Categories
              </Link>
              <Link href="/sell" className="text-sm font-medium hover:text-purple-700 transition-colors py-2">
                Sell
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-purple-700 transition-colors py-2">
                About
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Button variant="ghost" size="sm" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
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
