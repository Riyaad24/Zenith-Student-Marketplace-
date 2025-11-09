"use client"

import { useState, useEffect, useRef } from 'react'
import { Heart, X, ShoppingCart, MapPin, Star, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { useWishlist } from '@/components/wishlist-provider'
import { useCart } from '@/components/cart-provider'
import Link from 'next/link'
import Image from 'next/image'

interface WishlistDropdownProps {
  className?: string
}

export default function WishlistDropdown({ className }: WishlistDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { wishlistItems, removeFromWishlist, loading, getWishlistCount } = useWishlist()
  const { addItem } = useCart()
  
  const wishlistCount = getWishlistCount()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClick = () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }
    setIsOpen(!isOpen)
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId)
  }

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.product.id,
      name: item.product.title,
      price: item.product.price,
      maxQuantity: item.product.quantity,
      image: item.product.image,
      sellerId: item.product.seller.id
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="relative hover:bg-purple-50 hover:text-purple-700 text-gray-700 p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200"
        onClick={handleClick}
      >
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
        <span className="sr-only">Wishlist</span>
      </Button>

      {isOpen && user && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Heart className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Your wishlist is empty</p>
                <p className="text-gray-400 text-sm mt-1">
                  Browse products and save your favorites here
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-purple-600 font-semibold mt-1">
                          R{item.product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="capitalize">{item.product.condition}</span>
                          {item.product.location && (
                            <>
                              <span className="mx-1">•</span>
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{item.product.location}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Added {formatTimeAgo(item.addedAt)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-7"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1 h-7"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  View all wishlist items
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}