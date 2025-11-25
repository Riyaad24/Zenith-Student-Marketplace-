"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  price: number
  condition: string
  images: string[]
  category: string
  subcategory: string
  location: string
  createdAt: string
  user: {
    firstName: string
    lastName: string
  }
}

export default function CalculatorsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=Electronics&subcategory=Calculators')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Calculators</h1>
        <p className="text-muted-foreground max-w-2xl">
          Scientific and graphing calculators for math and engineering courses. Find quality calculators at student-friendly prices.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No calculators available at the moment.</p>
          <Link href="/sell">
            <Button className="bg-purple-700 hover:bg-purple-800">List Your Calculator</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover-card group">
              <div className="relative h-48">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-purple-700">
                  {product.condition}
                </Badge>
              </div>
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-purple-700">R{product.price}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/product/${product.id}`} className="w-full">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800 button-hover">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Sell Your Calculator</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          No longer need your calculator? List it on Zenith and help fellow students save money on essential study tools.
        </p>
        <Link href="/sell">
          <Button size="lg" className="bg-purple-700 hover:bg-purple-800 button-hover">
            List Your Calculator
          </Button>
        </Link>
      </div>
    </div>
  )
}
