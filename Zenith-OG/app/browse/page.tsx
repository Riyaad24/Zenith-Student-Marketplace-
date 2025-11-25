"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { MapPin, Star, Search, Loader2, ShoppingCart, Plus, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useAuth } from "@/components/auth-provider"

interface Product {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  image: string | null
  images: string | null  // JSON array of image URLs
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

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

interface FilterOptions {
  categories: Category[]
  locations: string[]
  universities: string[]
  conditions: string[]
  priceRange: {
    min: number
    max: number
  }
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

export default function BrowsePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalCount: 0,
    totalPages: 0
  })

  const searchParams = useSearchParams()
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()

  // Helper function to get the first image from product
  const getProductImage = (product: Product): string => {
    if (product.images) {
      try {
        const parsed = JSON.parse(product.images)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0]
        }
      } catch {
        // If parsing fails, fall through
      }
    }
    return product.image || "/placeholder.svg"
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      maxQuantity: product.quantity,
      image: getProductImage(product),
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

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [
    searchTerm,
    selectedCategories,
    selectedConditions,
    selectedLocation,
    priceRange,
    sortBy,
    sortOrder,
    pagination.page
  ])

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([category])
    }
    if (page) {
      setPagination(prev => ({ ...prev, page: parseInt(page) }))
    }
    if (search) {
      setSearchTerm(search)
    }
  }, [searchParams])

  const fetchFilterOptions = async () => {
    try {
      // For testing, provide sample filter options
      const sampleFilterOptions: FilterOptions = {
        categories: [
          { id: "textbooks", name: "Textbooks", slug: "textbooks", productCount: 1 },
          { id: "electronics", name: "Electronics", slug: "electronics", productCount: 1 },
          { id: "notes", name: "Study Notes", slug: "notes", productCount: 1 },
          { id: "tutoring", name: "Tutoring", slug: "tutoring", productCount: 1 }
        ],
        locations: ["Cape Town", "Johannesburg", "Durban", "Stellenbosch"],
        universities: [
          "University of Cape Town",
          "University of the Witwatersrand", 
          "University of KwaZulu-Natal",
          "Stellenbosch University"
        ],
        conditions: ["Excellent", "Good", "Fair", "New"],
        priceRange: { min: 0, max: 2000 }
      }
      
      setFilterOptions(sampleFilterOptions)
      setPriceRange([sampleFilterOptions.priceRange.min, sampleFilterOptions.priceRange.max])
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (selectedCategories.length > 0) {
        params.append('category', selectedCategories[0]) // API expects single category
      }

      if (selectedConditions.length > 0) {
        params.append('condition', selectedConditions[0]) // API expects single condition
      }

      if (selectedLocation && selectedLocation !== "all") {
        params.append('location', selectedLocation)
      }

      if (priceRange[0] > 0) {
        params.append('minPrice', priceRange[0].toString())
      }

      if (priceRange[1] < 10000) {
        params.append('maxPrice', priceRange[1].toString())
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      
      if (data.products) {
        setProducts(data.products)
        setPagination(data.pagination)
      } else {
        // Fallback to sample data if API fails
        console.warn('API returned no products, using fallback data')
        const fallbackProducts: Product[] = []
        setProducts(fallbackProducts)
        setPagination({
          page: 1,
          limit: 12,
          totalCount: 0,
          totalPages: 0
        })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setPagination({
        page: 1,
        limit: 12,
        totalCount: 0,
        totalPages: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categorySlug])
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== categorySlug))
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions(prev => [...prev, condition])
    } else {
      setSelectedConditions(prev => prev.filter(cond => cond !== condition))
    }
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedConditions([])
    setSelectedLocation("all")
    setPriceRange([filterOptions?.priceRange.min || 0, filterOptions?.priceRange.max || 10000])
    setSearchTerm("")
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  if (!filterOptions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="space-y-2">
                {filterOptions.categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={category.slug}
                      checked={selectedCategories.includes(category.slug)}
                      onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={category.slug} className="text-sm flex-1">
                      {category.name} ({category.productCount})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Price Range</h3>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={filterOptions.priceRange.min}
                max={filterOptions.priceRange.max}
                step={50}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>R{priceRange[0]}</span>
                <span>R{priceRange[1]}</span>
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Condition</h3>
              <div className="space-y-2">
                {filterOptions.conditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={condition}
                      checked={selectedConditions.includes(condition)}
                      onChange={(e) => handleConditionChange(condition, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={condition} className="text-sm">
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Location</h3>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {filterOptions.locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Listings */}
        <div className="w-full md:w-3/4 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'Browse Products'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {searchTerm 
                  ? `Found ${products.length} of ${pagination.totalCount} products matching your search`
                  : `Showing ${products.length} of ${pagination.totalCount} products`
                }
              </p>
              {searchTerm && products.length > 0 && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchTerm("")}
                  className="p-0 h-auto text-purple-600 hover:text-purple-700"
                >
                  Clear search and view all products
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-')
                setSortBy(newSortBy)
                setSortOrder(newSortOrder)
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover-card">
                    <div className="relative h-48">
                      <Image
                        src={getProductImage(product)}
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
                              title={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
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
                      <div>
                        <div className="font-bold text-lg">R{product.price}</div>
                        <div className="text-sm text-gray-600">
                          {product.quantity} available
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {user && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.quantity === 0}
                            className="flex items-center gap-1 disabled:opacity-50"
                            title={product.quantity === 0 ? "Out of stock" : "Add to cart"}
                          >
                            <Plus className="h-4 w-4" />
                            {product.quantity === 0 ? "Out of Stock" : "Cart"}
                          </Button>
                        )}
                        <Link href={`/product/${product.id}`}>
                          <Button size="sm" className="button-hover">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              )}

              {products.length === 0 && !loading && (
                <div className="text-center py-16 px-4">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {searchTerm ? 'No items found' : 'No products available'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm 
                        ? `Sorry, we couldn't find any products matching "${searchTerm}". Try adjusting your search terms or filters.`
                        : 'No products match your current filters. Try adjusting your criteria.'
                      }
                    </p>
                    <div className="space-y-3">
                      {searchTerm && (
                        <Button 
                          onClick={() => setSearchTerm("")}
                          variant="outline"
                          className="w-full sm:w-auto mr-3"
                        >
                          Clear Search
                        </Button>
                      )}
                      <Button 
                        onClick={clearFilters}
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                    {searchTerm && (
                      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Search Tips:</h4>
                        <ul className="text-sm text-purple-700 space-y-1 text-left">
                          <li>• Check your spelling</li>
                          <li>• Try more general terms</li>
                          <li>• Use different keywords</li>
                          <li>• Browse categories instead</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}