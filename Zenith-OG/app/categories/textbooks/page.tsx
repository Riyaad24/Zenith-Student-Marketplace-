"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Star,
  BookOpen,
  Heart,
  MessageCircle,
  ShoppingCart,
  Grid,
  List,
  Package,
  Shield,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SOUTH_AFRICAN_INSTITUTIONS } from "@/lib/institutions"

export default function TextbooksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const [textbooks, setTextbooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTextbooks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?category=Textbooks')
        if (response.ok) {
          const data = await response.json()
          setTextbooks(data.products || [])
        } else {
          setTextbooks([])
        }
      } catch (error) {
        console.error('Error fetching textbooks:', error)
        setTextbooks([])
      } finally {
        setLoading(false)
      }
    }
    fetchTextbooks()
  }, [])

  const courses = [
    "BUS1501",
    "ACC1501",
    "BIO1501",
    "MAT1512",
    "CSC1501",
  ]

  const conditions = [
    "Brand New",
    "Like New",
    "Very Good",
    "Good",
  ]

  const filteredTextbooks = textbooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = !selectedCourse || selectedCourse === "all" || book.courseCode === selectedCourse
    const matchesInstitution = !selectedInstitution || selectedInstitution === "all" || book.institution === selectedInstitution
    const matchesCondition = !selectedCondition || selectedCondition === "all" || book.condition === selectedCondition
    const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1]
    return matchesSearch && matchesCourse && matchesInstitution && matchesCondition && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Textbooks</h1>
          </div>
          <p className="text-gray-600">
            Buy and sell prescribed textbooks from students across South African institutions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search textbooks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Course</label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Institution</label>
                  <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Institutions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Institutions</SelectItem>
                      {SOUTH_AFRICAN_INSTITUTIONS.map((inst) => (
                        <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      {conditions.map((cond) => (
                        <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price: R{priceRange[0]} - R{priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={2000} step={50} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {loading ? 'Loading...' : `${filteredTextbooks.length} textbooks found`}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading textbooks...</p>
                </div>
              ) : filteredTextbooks.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No textbooks found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              ) : (
                filteredTextbooks.map((book) => {
                  // Get the first image from images array or fall back to single image field
                  let displayImage = "/textbook-illus.png"
                  
                  if (book.images) {
                    try {
                      const imageArray = JSON.parse(book.images)
                      if (Array.isArray(imageArray) && imageArray.length > 0) {
                        displayImage = imageArray[0]
                      }
                    } catch (e) {
                      // If parsing fails, use the single image field
                      if (book.image) {
                        displayImage = book.image
                      }
                    }
                  } else if (book.image) {
                    displayImage = book.image
                  }

                  return (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-32 flex-shrink-0">
                          <div className="relative h-48 w-full rounded-md overflow-hidden border bg-gray-100">
                            <Image
                              src={displayImage}
                              alt={book.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                          {book.description && (
                            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{book.description}</p>
                          )}
                          {book.condition && (
                            <Badge variant="outline">{book.condition}</Badge>
                          )}
                        </div>
                        <div className="w-48">
                          <div className="text-2xl font-bold text-blue-600 mb-4">R{book.price}</div>
                          <Link href={`/product/${book.id}`}>
                            <Button variant="outline" className="w-full mb-2">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/product/${book.id}`}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
