"use client"

import { useState } from "react"
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

  const institutions = [
    "University of Cape Town (UCT)",
    "University of the Witwatersrand (Wits)",
    "University of Pretoria (UP)",
    "Stellenbosch University",
    "University of Johannesburg (UJ)",
    "University of KwaZulu-Natal (UKZN)",
    "Rhodes University",
    "North-West University (NWU)",
    "University of the Free State (UFS)",
    "University of the Western Cape (UWC)",
    "UNISA",
    "Tshwane University of Technology (TUT)",
    "Cape Peninsula University of Technology (CPUT)",
    "Durban University of Technology (DUT)",
    "Central University of Technology (CUT)",
    "Vaal University of Technology (VUT)",
    "Mangosuthu University of Technology (MUT)",
    "Richfield Graduate Institute",
    "Eduvos",
    "Boston City Campus",
    "Damelin",
    "Rosebank College",
    "Varsity College",
    "Milpark Education",
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

  // Update the sampleNotes array to include cover images
  const sampleNotes = [
    {
      id: 1,
      title: "Financial Accounting Fundamentals - Complete Study Guide",
      courseCode: "ACC1001",
      institution: "University of Cape Town (UCT)",
      year: "First Year",
      type: "Study Guide",
      faculty: "Commerce & Management",
      price: 85,
      format: "PDF",
      pages: 45,
      rating: 4.8,
      reviews: 23,
      downloads: 156,
      seller: "Sarah M.",
      description: "Comprehensive study guide covering all ACC1001 topics with examples and practice questions.",
      preview: true,
      verified: true,
      helpful: 89,
      cover: "/placeholder.svg?height=300&width=200&text=Accounting+Guide",
    },
    {
      id: 2,
      title: "Introduction to Psychology: Chapters 1-8 Summary",
      courseCode: "PSY1001",
      institution: "University of the Witwatersrand (Wits)",
      year: "First Year",
      type: "Chapter Summaries",
      faculty: "Humanities & Social Sciences",
      price: 0,
      format: "PDF",
      pages: 28,
      rating: 4.6,
      reviews: 41,
      downloads: 234,
      seller: "Mike K.",
      description: "Detailed chapter summaries with key concepts and theories explained simply.",
      preview: true,
      verified: true,
      helpful: 156,
      cover: "/placeholder.svg?height=300&width=200&text=Psychology+Notes",
    },
    {
      id: 3,
      title: "Java Programming - Past Exam Papers & Solutions",
      courseCode: "CSC2001",
      institution: "Richfield Graduate Institute",
      year: "Second Year",
      type: "Past Exam Papers",
      faculty: "Information Technology",
      price: 120,
      format: "PDF",
      pages: 67,
      rating: 4.9,
      reviews: 18,
      downloads: 89,
      seller: "Alex T.",
      description: "Collection of past exam papers with detailed solutions and explanations.",
      preview: true,
      verified: true,
      helpful: 72,
      cover: "/placeholder.svg?height=300&width=200&text=Java+Exams",
    },
    {
      id: 4,
      title: "Business Law - Contract Law Mind Maps",
      courseCode: "LAW2001",
      institution: "Stellenbosch University",
      year: "Second Year",
      type: "Mind Maps",
      faculty: "Law",
      price: 45,
      format: "PDF",
      pages: 12,
      rating: 4.7,
      reviews: 15,
      downloads: 67,
      seller: "Emma L.",
      description: "Visual mind maps covering all aspects of contract law with case studies.",
      preview: true,
      verified: false,
      helpful: 43,
      cover: "/placeholder.svg?height=300&width=200&text=Law+Mind+Maps",
    },
    {
      id: 5,
      title: "Engineering Mathematics Formula Sheet",
      courseCode: "MAT2001",
      institution: "Tshwane University of Technology (TUT)",
      year: "Second Year",
      type: "Formula Sheets",
      faculty: "Engineering & Technology",
      price: 25,
      format: "PDF",
      pages: 8,
      rating: 4.5,
      reviews: 32,
      downloads: 198,
      seller: "David R.",
      description: "Essential formulas and equations for engineering mathematics with examples.",
      preview: true,
      verified: true,
      helpful: 134,
      cover: "/placeholder.svg?height=300&width=200&text=Math+Formulas",
    },
    {
      id: 6,
      title: "Human Anatomy - Complete Lecture Notes",
      courseCode: "ANA1001",
      institution: "University of KwaZulu-Natal (UKZN)",
      year: "First Year",
      type: "Lecture Notes",
      faculty: "Health Sciences",
      price: 95,
      format: "PDF",
      pages: 89,
      rating: 4.8,
      reviews: 27,
      downloads: 145,
      seller: "Lisa P.",
      description: "Comprehensive lecture notes with diagrams and detailed explanations.",
      preview: true,
      verified: true,
      helpful: 112,
      cover: "/placeholder.svg?height=300&width=200&text=Anatomy+Notes",
    },
  ]

  const filteredNotes = sampleNotes.filter((note) => {
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
                      {institutions.map((institution) => (
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
                <Button className="w-full mt-4" size="sm">
                  Upload Your Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">{filteredNotes.length} study materials found</h2>
                <p className="text-gray-600 text-sm">Showing results for your search criteria</p>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="space-y-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Note Cover Image */}
                      <div className="md:w-32 flex-shrink-0">
                        <div className="relative h-40 md:h-48 w-full rounded-md overflow-hidden border">
                          <Image
                            src={note.cover || "/placeholder.svg?height=300&width=200&text=Study+Material"}
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
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {note.seller
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>by {note.seller}</span>
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
                          {note.preview && (
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          )}
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            <Download className="h-4 w-4 mr-2" />
                            {note.price === 0 ? "Download" : "Buy Now"}
                          </Button>
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
                      <Link href={`/categories/notes/${note.id}`} className="text-purple-600 hover:underline">
                        View Details →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
