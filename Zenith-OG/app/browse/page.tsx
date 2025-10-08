"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { MapPin, Star, Search, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

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
      const response = await fetch('/api/products/filters')
      const data = await response.json()
      setFilterOptions(data)
      setPriceRange([data.priceRange.min, data.priceRange.max])
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(cat => params.append('category', cat))
      }
      if (selectedConditions.length > 0) {
        selectedConditions.forEach(cond => params.append('condition', cond))
      }
      if (selectedLocation && selectedLocation !== "all") params.append('location', selectedLocation)
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString())
      if (priceRange[1] < 10000) params.append('maxPrice', priceRange[1].toString())

      const response = await fetch(`/api/products?${params}`)
      const data: ProductsResponse = await response.json()
      
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
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
              <h1 className="text-2xl font-bold">Browse Products</h1>
              <p className="text-sm text-muted-foreground">
                Showing {products.length} of {pagination.totalCount} products
              </p>
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
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                        {product.averageRating > 0 && (
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="ml-1">{product.averageRating.toFixed(1)}</span>
                          </div>
                        )}
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
                      <Link href={`/product/${product.id}`}>
                        <Button size="sm" className="button-hover">
                          View Details
                        </Button>
                      </Link>
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

              {products.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}