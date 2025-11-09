"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  MessageCircle,
  ThumbsUp,
  FileText,
  BookOpen,
  GraduationCap,
  Shield,
  Upload,
  Heart,
} from "lucide-react"
import Link from "next/link"
// Add the Image import if it's not already there
import Image from "next/image"
import { SOUTH_AFRICAN_INSTITUTIONS } from "@/lib/institutions"

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFaculty, setSelectedFaculty] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [showFreeOnly, setShowFreeOnly] = useState(false)
  const [sortBy, setSortBy] = useState("popularity")

  const faculties = [
    "Commerce & Management",
    "Engineering & Technology",
    "Humanities & Social Sciences",
    "Information Technology",
    "Health Sciences",
    "Natural Sciences",
    "Law",
    "Education",
    "Arts & Design",
  ]

  const noteTypes = [
    "Lecture Notes",
    "Study Guides",
    "Past Exam Papers",
    "Assignment Solutions",
    "Chapter Summaries",
    "Formula Sheets",
    "Mind Maps",
    "Practical Guides",
  ]

  // Fetch real notes from database
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?category=Notes')
        if (response.ok) {
          const data = await response.json()
          setNotes(data.products || [])
        } else {
          setNotes([])
        }
      } catch (error) {
        console.error('Error fetching notes:', error)
        setNotes([])
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFaculty = !selectedFaculty || note.faculty === selectedFaculty
    const matchesInstitution = !selectedInstitution || note.institution === selectedInstitution
    const matchesYear = !selectedYear || note.year === selectedYear
    const matchesType = !selectedType || note.type === selectedType
    const matchesPrice = note.price >= priceRange[0] && note.price <= priceRange[1]
    const matchesFree = !showFreeOnly || note.price === 0

    return (
      matchesSearch && matchesFaculty && matchesInstitution && matchesYear && matchesType && matchesPrice && matchesFree
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Notes & Study Guides</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Access high-quality study materials from students across South African institutions. Find notes, study
            guides, past papers, and more to excel in your studies.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search notes, courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Faculty */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Faculty</label>
                  <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Faculties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Faculties</SelectItem>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty} value={faculty}>
                          {faculty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Institution */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Institution</label>
                  <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Institutions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Institutions</SelectItem>
                      {SOUTH_AFRICAN_INSTITUTIONS.map((institution) => (
                        <SelectItem key={institution} value={institution}>
                          {institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Level */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Year Level</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="First Year">First Year</SelectItem>
                      <SelectItem value="Second Year">Second Year</SelectItem>
                      <SelectItem value="Third Year">Third Year</SelectItem>
                      <SelectItem value="Final Year">Final Year</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {noteTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: R{priceRange[0]} - R{priceRange[1]}
                  </label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={5} className="mt-2" />
                </div>

                {/* Free Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="free-only" checked={showFreeOnly} onCheckedChange={setShowFreeOnly} />
                  <label htmlFor="free-only" className="text-sm font-medium">
                    Free downloads only
                  </label>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Upload Guidelines */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Must be original or self-compiled content</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clear, legible, and well-organized</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Include description of contents</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Option for free or paid downloads</span>
                </div>
                <Link href="/sell">
                  <Button className="w-full mt-4" size="sm">
                    Upload Your Notes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {loading ? 'Loading...' : `${filteredNotes.length} study materials found`}
                </h2>
                <p className="text-gray-600 text-sm">
                  {loading ? 'Fetching study materials from database...' : 'Showing results for your search criteria'}
                </p>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading study materials...</p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No study materials found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Note Cover Image */}
                      <div className="md:w-32 flex-shrink-0">
                        <div className="relative h-40 md:h-48 w-full rounded-md overflow-hidden border">
                          <Image
                            src={note.images?.[0] || "/placeholder.svg?height=300&width=200&text=Study+Material"}
                            alt={note.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Note Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{note.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="font-medium">{note.courseCode}</span>
                              <span>•</span>
                              <span>{note.institution}</span>
                              <span>•</span>
                              <span>{note.year}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {note.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <Badge variant="outline">{note.type}</Badge>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4">{note.description}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{note.pages} pages</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{note.format}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{note.downloads} downloads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{note.helpful}% helpful</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(note.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{note.rating}</span>
                              <span className="text-sm text-gray-600">({note.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {note.seller?.firstName?.[0] || ''}{note.seller?.lastName?.[0] || ''}
                                </AvatarFallback>
                              </Avatar>
                              <span>by {note.seller?.name || `${note.seller?.firstName || ''} ${note.seller?.lastName || ''}`.trim() || 'Anonymous'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="md:w-48 flex flex-col justify-between">
                        <div className="text-right mb-4">
                          {note.price === 0 ? (
                            <div className="text-2xl font-bold text-green-600">FREE</div>
                          ) : (
                            <div className="text-2xl font-bold">R{note.price}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {note.pdfFile && (
                            <Link href={`/product/${note.id}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </Link>
                          )}
                          <Link href={`/product/${note.id}`}>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                              <Download className="h-4 w-4 mr-2" />
                              {note.price === 0 ? "Download" : "Buy Now"}
                            </Button>
                          </Link>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Community Features */}
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 hover:text-purple-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>Q&A ({Math.floor(Math.random() * 10) + 1})</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-purple-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Helpful</span>
                        </button>
                      </div>
                      <Link href={`/product/${note.id}`} className="text-purple-600 hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-purple-600 text-white">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features Info */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold mb-1">Secure Downloads</h3>
              <p className="text-sm text-gray-600">PDF watermarking and malware scanning for all files</p>
            </div>
            <div className="flex flex-col items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">Student Verified</h3>
              <p className="text-sm text-gray-600">All uploads verified by student community</p>
            </div>
            <div className="flex flex-col items-center">
              <Download className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold mb-1">Instant Access</h3>
              <p className="text-sm text-gray-600">Download immediately after secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
