"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Loader2, ShoppingCart, Plus, Heart, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useAuth } from "@/components/auth-provider"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string | null
  condition: string
  location: string | null
  university: string | null
  averageRating: number
  reviewCount: number
  category: {
    id: string
    name: string
    slug: string
  }
  seller: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
      // Update URL without navigation
      window.history.pushState(null, '', `/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image || undefined,
      sellerId: product.seller.id
    })
  }

  const handleWishlistToggle = async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      {/* Search Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Zenith Marketplace</h1>
          <p className="text-gray-600 mb-6">
            Find textbooks, electronics, study materials, and more from fellow students
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for books, electronics, study materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 h-14 text-lg bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              />
              <Button 
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-3 text-lg">Searching...</span>
          </div>
        ) : hasSearched ? (
          <div>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Search Results for "{searchParams.get('q') || searchQuery}"
              </h2>
              <p className="text-gray-600">
                Found {products.length} {products.length === 1 ? 'item' : 'items'}
              </p>
              {products.length > 0 && (
                <Link href="/browse" className="text-purple-600 hover:text-purple-700 text-sm">
                  Browse all products →
                </Link>
              )}
            </div>

            {products.length > 0 ? (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover-card">
                    <div className="relative h-48">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2 flex-1 pr-2">{product.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          {user && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleWishlistToggle(product)
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  isInWishlist(product.id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-400 hover:text-red-500'
                                }`}
                              />
                            </button>
                          )}
                          {product.averageRating > 0 && (
                            <div className="flex items-center text-sm">
                              <Star className="h-4 w-4 fill-current text-yellow-400" />
                              <span className="ml-1">{product.averageRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-purple-600 font-medium">
                          {product.category.name}
                        </div>
                        {product.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{product.location}</span>
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          Condition: {product.condition}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between items-center">
                      <div className="font-bold text-lg">R{product.price}</div>
                      <div className="flex gap-2">
                        {user && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-4 w-4" />
                            Cart
                          </Button>
                        )}
                        <Link href={`/product/${product.id}`}>
                          <Button size="sm" className="button-hover">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              /* No Results Found */
              <div className="text-center py-16 px-4">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    Item not found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Sorry, we couldn't find any products matching "{searchParams.get('q') || searchQuery}". 
                    The item may not be registered on our platform yet.
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        setSearchQuery("")
                        setHasSearched(false)
                        setProducts([])
                        window.history.pushState(null, '', '/search')
                      }}
                      variant="outline"
                      className="w-full sm:w-auto mr-3"
                    >
                      Try New Search
                    </Button>
                    <Link href="/browse">
                      <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                        Browse All Products
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Search Tips:</h4>
                    <ul className="text-sm text-purple-700 space-y-1 text-left">
                      <li>• Check your spelling</li>
                      <li>• Try more general terms (e.g., "chemistry" instead of "organic chemistry textbook")</li>
                      <li>• Use different keywords</li>
                      <li>• Browse by category instead</li>
                      <li>• Try searching for the university or condition</li>
                    </ul>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Can't find what you need?</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Post a request and let other students know what you're looking for!
                    </p>
                    <Link href="/sell">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                        Post a Request
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Initial State */
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Start searching to find what you need
            </h3>
            <p className="text-gray-500 mb-6">
              Enter keywords above to search through thousands of student listings
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("textbooks")
                  performSearch("textbooks")
                }}
              >
                Textbooks
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("calculator")
                  performSearch("calculator")
                }}
              >
                Calculators
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("laptop")
                  performSearch("laptop")
                }}
              >
                Laptops
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("notes")
                  performSearch("notes")
                }}
              >
                Study Notes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}