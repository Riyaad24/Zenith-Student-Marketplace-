"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CartPage() {
  const { user, loading } = useAuth()
  const { items: cartItems, updateQuantity, removeItem, getSubtotal } = useCart()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show sign-in prompt for non-authenticated users
  if (!user) {
    return (
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <ShoppingCart className="h-24 w-24 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty.</h1>
          <p className="text-muted-foreground mb-6">Sign in to retrieve your saved items or continue shopping.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800">Sign In</Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate totals
  const subtotal = getSubtotal()
  const shipping = cartItems.length > 0 ? 50 : 0 // R50 shipping if there are items
  const total = subtotal + shipping

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Cart</h1>

        {cartItems.length === 0 ? (
          // Empty cart state for signed-in users
          <div className="text-center py-12">
            <div className="flex justify-center mb-8">
              <Image
                src="/images/empty-cart.png"
                alt="Empty cart illustration"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">There are no items in your cart.</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Browse our marketplace to find textbooks, electronics, study materials, and more from fellow students.
            </p>
            
            {/* Summary Section for Empty Cart */}
            <div className="max-w-md mx-auto mb-8">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-400">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-400">—</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-semibold text-gray-400">—</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                  Start Shopping
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" className="px-8 py-3 text-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Cart with items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-gray-400 text-xs text-center">No Image</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-gray-600 text-sm">R{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">R{(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">R{shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-lg text-gray-900">Total</span>
                        <span className="font-bold text-lg text-gray-900">R{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                  <Link href="/browse">
                    <Button variant="outline" className="w-full mt-3">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
