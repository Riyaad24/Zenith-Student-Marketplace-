"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  // This would normally check if the user is authenticated
  // For demo purposes, we'll use a state to simulate authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Simulate checking authentication status
  useEffect(() => {
    // In a real app, this would check for a token or session
    // For now, we'll just set it to false to show the empty cart for non-signed in users
    setIsAuthenticated(false)
  }, [])

  if (!isAuthenticated) {
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

  // This part would show the actual cart if the user is authenticated
  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Cart items would go here */}
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items in your cart yet.</p>
                <Link href="/browse">
                  <Button className="mt-4 bg-purple-700 hover:bg-purple-800">Browse Products</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>R0.00</span>
                </div>
                <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                  <span>Total</span>
                  <span>R0.00</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-purple-700 hover:bg-purple-800" disabled>
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
