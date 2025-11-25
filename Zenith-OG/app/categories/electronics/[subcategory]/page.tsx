"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const subcategoryInfo: Record<string, { title: string; description: string }> = {
  "laptops-tablets": {
    title: "Laptops & Tablets",
    description: "Essential for research, assignments, and online learning.",
  },
  headphones: {
    title: "Noise-Canceling Headphones",
    description: "Perfect for focusing in noisy environments.",
  },
  "smart-notebooks": {
    title: "Smart Notebooks",
    description: "Digital notebooks that sync handwritten notes to the cloud.",
  },
  "power-banks": {
    title: "Portable Chargers & Power Banks",
    description: "Keeps devices charged on the go.",
  },
  smartwatches: {
    title: "Smartwatches",
    description: "Helps with time management and fitness tracking.",
  },
  storage: {
    title: "External Hard Drives & USB Flash Drives",
    description: "Useful for storing and backing up important files.",
  },
  "keyboards-mice": {
    title: "Wireless Keyboards & Mice",
    description: "Enhances productivity for students working on multiple devices.",
  },
  "e-readers": {
    title: "E-Readers",
    description: "Great for reading textbooks and academic papers without carrying heavy books.",
  },
  "desk-lamps": {
    title: "Desk Lamps with Wireless Charging",
    description: "Combines lighting with convenience.",
  },
  projectors: {
    title: "Mini Projectors",
    description: "Useful for presentations and study sessions.",
  },
}

export default function ElectronicsSubcategoryPage({ params }: { params: { subcategory: string } }) {
  const subcategoryId = params.subcategory
  const subcategory = subcategoryInfo[subcategoryId]
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?category=Electronics')
        if (response.ok) {
          const data = await response.json()
          console.log('📦 Products received:', data.products)
          data.products?.forEach((p: any) => {
            console.log(`Product: ${p.title}`, {
              image: p.image,
              images: p.images,
              firstImage: p.images?.[0]
            })
          })
          setProducts(data.products || [])
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (!subcategory) {
    return (
      <div className="container px-4 md:px-6 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-6">Sorry, the category you're looking for doesn't exist.</p>
        <Link href="/categories/electronics">
          <Button className="bg-purple-700 hover:bg-purple-800">Back to Electronics</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/categories/electronics" className="text-purple-700 hover:underline mb-2 inline-block">
          ← Back to Electronics
        </Link>
        <h1 className="text-3xl font-bold mt-2">{subcategory.title}</h1>
        <p className="text-muted-foreground max-w-2xl">{subcategory.description}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found in this category.</p>
          <Link href="/sell">
            <Button className="bg-purple-700 hover:bg-purple-800">Be the first to sell in this category</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover-card">
              <div className="relative h-48">
                <Image 
                  src={product.images?.[0] || product.image || "/placeholder.svg"} 
                  alt={product.title} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  {product.rating && (
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  )}
                </div>
                {product.location && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{product.location}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {product.condition && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {product.condition}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <div className="font-bold">R{product.price}</div>
                <Link href={`/product/${product.id}`}>
                  <Button size="sm" className="bg-purple-700 hover:bg-purple-800 button-hover">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Looking for Something Specific?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Create a wanted listing to let other students know what you need.
        </p>
        <Link href="/wanted">
          <Button size="lg" className="bg-purple-700 hover:bg-purple-800 button-hover">
            Create Wanted Listing
          </Button>
        </Link>
      </div>
    </div>
  )
}
