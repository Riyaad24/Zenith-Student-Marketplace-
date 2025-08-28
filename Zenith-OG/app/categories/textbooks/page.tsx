"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, LayoutGrid, List, MapPin, Star, Truck, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample textbook data
const textbooks = [
  {
    id: "1",
    title: "Principles of Marketing 9th Edition",
    author: "Philip Kotler, Gary Armstrong",
    cover: "/placeholder.svg?height=300&width=200&text=Marketing",
    module: "BUS1501 - Introduction to Business Management",
    institution: "UNISA",
    price: 280,
    condition: "New",
    sellerType: "Bookstore Partner",
    rating: 4.8,
    reviewCount: 24,
    location: "Pretoria",
    delivery: true,
    isVerified: true,
    isbn: "978-0132167123",
    edition: "9th Edition",
    pages: 720,
    description:
      "The gold standard in marketing management. This textbook is in perfect condition, never used. Still in original packaging.",
    publishYear: 2022,
  },
  {
    id: "2",
    title: "Introduction to Financial Accounting 8th Edition",
    author: "Charles T. Horngren, Gary L. Sundem",
    cover: "/placeholder.svg?height=300&width=200&text=Accounting",
    module: "ACC1501 - Accounting Principles",
    institution: "University of Johannesburg",
    price: 120,
    condition: "Used - Good",
    sellerType: "Student Seller",
    rating: 4.5,
    reviewCount: 18,
    location: "Johannesburg",
    delivery: true,
    isVerified: true,
    isbn: "978-0273771951",
    edition: "8th Edition",
    pages: 648,
    description:
      "Used for one semester only. Some highlighting on first 3 chapters, otherwise in great condition. No torn pages or writing.",
    publishYear: 2020,
  },
  {
    id: "3",
    title: "Campbell Biology 11th Edition",
    author: "Lisa A. Urry, Michael L. Cain",
    cover: "/placeholder.svg?height=300&width=200&text=Biology",
    module: "BIO1501 - Introduction to Biology",
    institution: "University of Cape Town",
    price: 350,
    condition: "New",
    sellerType: "Bookstore Partner",
    rating: 4.9,
    reviewCount: 32,
    location: "Cape Town",
    delivery: true,
    isVerified: true,
    isbn: "978-0134093413",
    edition: "11th Edition",
    pages: 1488,
    description:
      "Brand new biology textbook, still sealed in original packaging. Essential for all first-year biology students.",
    publishYear: 2021,
  },
  {
    id: "4",
    title: "Calculus: Early Transcendentals 8th Edition",
    author: "James Stewart",
    cover: "/placeholder.svg?height=300&width=200&text=Calculus",
    module: "MAT1512 - Calculus I",
    institution: "University of Pretoria",
    price: 180,
    condition: "Used - Like New",
    sellerType: "Student Seller",
    rating: 4.7,
    reviewCount: 15,
    location: "Pretoria",
    delivery: false,
    isVerified: true,
    isbn: "978-1285741550",
    edition: "8th Edition",
    pages: 1368,
    description:
      "Used for one semester. No highlighting or notes. Includes online access code (unused). Perfect condition.",
    publishYear: 2019,
  },
  {
    id: "5",
    title: "Introduction to Java Programming 11th Edition",
    author: "Y. Daniel Liang",
    cover: "/placeholder.svg?height=300&width=200&text=Java",
    module: "CSC1501 - Programming I",
    institution: "DUT",
    price: 150,
    condition: "Used - Fair",
    sellerType: "Student Seller",
    rating: 4.2,
    reviewCount: 9,
    location: "Durban",
    delivery: true,
    isVerified: true,
    isbn: "978-0134670942",
    edition: "11th Edition",
    pages: 1232,
    description:
      "Some wear on the cover and highlighting throughout. All pages intact. Great budget option for CS students.",
    publishYear: 2018,
  },
  {
    id: "6",
    title: "Principles of Economics 7th Edition",
    author: "N. Gregory Mankiw",
    cover: "/placeholder.svg?height=300&width=200&text=Economics",
    module: "ECO1501 - Principles of Economics",
    institution: "UNISA",
    price: 200,
    condition: "Used - Good",
    sellerType: "Student Seller",
    rating: 4.6,
    reviewCount: 21,
    location: "Johannesburg",
    delivery: true,
    isVerified: true,
    isbn: "978-1285165875",
    edition: "7th Edition",
    pages: 880,
    description:
      "Used for two semesters. Some highlighting and notes in the margins. No torn pages. Great condition overall.",
    publishYear: 2020,
  },
  {
    id: "7",
    title: "Psychology: An Introduction 12th Edition",
    author: "Charles G. Morris, Albert A. Maisto",
    cover: "/placeholder.svg?height=300&width=200&text=Psychology",
    module: "PSY1501 - Introduction to Psychology",
    institution: "University of the Witwatersrand",
    price: 160,
    condition: "Used - Good",
    sellerType: "Student Seller",
    rating: 4.4,
    reviewCount: 13,
    location: "Johannesburg",
    delivery: false,
    isVerified: true,
    isbn: "978-0134636856",
    edition: "12th Edition",
    pages: 720,
    description: "Used but in good condition. Some highlighting in first few chapters. No writing or torn pages.",
    publishYear: 2019,
  },
  {
    id: "8",
    title: "Organic Chemistry 9th Edition",
    author: "Leroy G. Wade, Jan W. Simek",
    cover: "/placeholder.svg?height=300&width=200&text=Chemistry",
    module: "CHE2501 - Organic Chemistry",
    institution: "University of Cape Town",
    price: 320,
    condition: "New",
    sellerType: "Bookstore Partner",
    rating: 4.9,
    reviewCount: 28,
    location: "Cape Town",
    delivery: true,
    isVerified: true,
    isbn: "978-0321971371",
    edition: "9th Edition",
    pages: 1392,
    description: "Brand new chemistry textbook. Essential for all organic chemistry students.",
    publishYear: 2021,
  },
]

// Filter options
const courses = [
  "All Courses",
  "BUS1501 - Introduction to Business Management",
  "ACC1501 - Accounting Principles",
  "BIO1501 - Introduction to Biology",
  "MAT1512 - Calculus I",
  "CSC1501 - Programming I",
  "ECO1501 - Principles of Economics",
  "PSY1501 - Introduction to Psychology",
  "CHE2501 - Organic Chemistry",
]

const institutions = [
  "All Institutions",
  // Universities
  "University of Cape Town (UCT)",
  "University of the Witwatersrand (Wits)",
  "University of Pretoria (UP)",
  "Stellenbosch University",
  "University of Johannesburg (UJ)",
  "University of KwaZulu-Natal (UKZN)",
  "Rhodes University",
  "University of the Western Cape (UWC)",
  "University of the Free State (UFS)",
  "North-West University (NWU)",
  "University of Limpopo",
  "University of Fort Hare",
  "Nelson Mandela University",
  "University of Zululand",
  "University of Venda",
  "Walter Sisulu University",
  "Sefako Makgatho Health Sciences University",
  "University of Mpumalanga",
  "Sol Plaatje University",
  // Universities of Technology
  "Tshwane University of Technology (TUT)",
  "Cape Peninsula University of Technology (CPUT)",
  "Durban University of Technology (DUT)",
  "Central University of Technology (CUT)",
  "Vaal University of Technology (VUT)",
  "Mangosuthu University of Technology (MUT)",
  // Distance Learning
  "University of South Africa (UNISA)",
  // Private Universities
  "Monash South Africa",
  "St Augustine College",
  // Colleges
  "Richfield College",
  "Eduvos",
  "Boston City Campus & Business College",
  "Damelin",
  "Rosebank College",
  "Varsity College",
  "IIE",
  "CTI Education Group",
  "Lyceum College",
  "Midrand Graduate Institute",
  "Pearson Institute of Higher Education",
  "AFDA",
  "Vega School",
  "Red & Yellow Creative School of Business",
  "AAA School of Advertising",
  "IMM Graduate School",
  "MANCOSA",
  "Regent Business School",
  "Milpark Education",
  "STADIO",
  "Cornerstone Institute",
  "Other",
]

const conditions = ["All Conditions", "New", "Used - Like New", "Used - Good", "Used - Fair"]

export default function TextbooksPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedCourse, setSelectedCourse] = useState("All Courses")
  const [selectedInstitution, setSelectedInstitution] = useState("All Institutions")
  const [selectedCondition, setSelectedCondition] = useState("All Conditions")
  const [priceRange, setPriceRange] = useState([0, 400])
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter textbooks based on selected filters
  const filteredTextbooks = textbooks.filter((textbook) => {
    // Tab filter (New vs Used)
    if (activeTab === "new" && textbook.condition !== "New") return false
    if (activeTab === "used" && textbook.condition === "New") return false

    // Course filter
    if (selectedCourse !== "All Courses" && textbook.module !== selectedCourse) return false

    // Institution filter
    if (selectedInstitution !== "All Institutions" && textbook.institution !== selectedInstitution) return false

    // Condition filter
    if (selectedCondition !== "All Conditions" && textbook.condition !== selectedCondition) return false

    // Price range filter
    if (textbook.price < priceRange[0] || textbook.price > priceRange[1]) return false

    // Search query filter
    if (
      searchQuery &&
      !textbook.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !textbook.author.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !textbook.module.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Sort textbooks based on selected sort option
  const sortedTextbooks = [...filteredTextbooks].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "recent") return 0 // In a real app, this would sort by date listed
    return 0
  })

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse New & Used Textbooks</h1>
        <p className="text-muted-foreground max-w-2xl">
          Find affordable textbooks for your courses from student sellers and bookstore partners.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search by title, author, or course code"
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Textbooks</TabsTrigger>
            <TabsTrigger value="new">New Textbooks</TabsTrigger>
            <TabsTrigger value="used">Used Textbooks</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "grid" ? "bg-muted" : ""}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={viewMode === "list" ? "bg-muted" : ""}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger id="institution">
                    <SelectValue placeholder="Select institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution} value={institution}>
                        {institution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="pt-4 px-2">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={500}
                    step={10}
                    onValueChange={setPriceRange}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Listed</SelectItem>
                    <SelectItem value="price-low">Lowest Price</SelectItem>
                    <SelectItem value="price-high">Highest Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full mt-2 bg-purple-700 hover:bg-purple-800">Apply Filters</Button>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Sell Your Textbooks</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Done with your textbooks? Sell them to other students and make some money back.
            </p>
            <Link href="/sell">
              <Button className="w-full bg-purple-700 hover:bg-purple-800">List Your Textbooks</Button>
            </Link>
          </div>

          <div className="border p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Bundle Offers</h3>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-medium text-sm">First Year Accounting Bundle</h4>
                <p className="text-xs text-muted-foreground">All 4 required textbooks</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold">R750</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Save 20%</Badge>
                </div>
              </div>
              <div className="border-b pb-4">
                <h4 className="font-medium text-sm">Computer Science Starter Pack</h4>
                <p className="text-xs text-muted-foreground">3 essential programming books</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold">R620</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Save 15%</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm">Biology Complete Set</h4>
                <p className="text-xs text-muted-foreground">Textbook, lab manual & study guide</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold">R580</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Save 25%</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Bundles
              </Button>
            </div>
          </div>
        </div>

        {/* Textbooks List */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Showing {sortedTextbooks.length} of {textbooks.length} textbooks
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTextbooks.map((textbook) => (
                <Card key={textbook.id} className="overflow-hidden hover-card">
                  <div className="relative pt-[120%]">
                    <Image
                      src={textbook.cover || "/placeholder.svg"}
                      alt={textbook.title}
                      fill
                      className="object-cover"
                    />
                    {textbook.isVerified && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    )}
                    <div
                      className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${
                        textbook.condition === "New" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {textbook.condition}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2">{textbook.title}</h3>
                    <p className="text-sm text-muted-foreground">{textbook.author}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-purple-50">
                        {textbook.module}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-2 text-sm">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">{textbook.institution}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="text-sm ml-1">
                          {textbook.rating} ({textbook.reviewCount})
                        </span>
                      </div>
                      <div className="font-bold">R{textbook.price}</div>
                    </div>
                    <div className="flex items-center mt-2 text-xs">
                      <Badge
                        variant="outline"
                        className={
                          textbook.sellerType === "Bookstore Partner"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                        }
                      >
                        {textbook.sellerType}
                      </Badge>
                      {textbook.delivery && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                          <Truck className="h-3 w-3 mr-1" />
                          Delivery
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link href={`/categories/textbooks/${textbook.id}`} className="flex-1">
                      <Button className="w-full bg-purple-700 hover:bg-purple-800">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTextbooks.map((textbook) => (
                <Card key={textbook.id} className="overflow-hidden hover-card">
                  <div className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative h-[180px] w-[120px] flex-shrink-0">
                      <Image
                        src={textbook.cover || "/placeholder.svg"}
                        alt={textbook.title}
                        fill
                        className="object-cover"
                      />
                      {textbook.isVerified && (
                        <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </div>
                      )}
                      <div
                        className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${
                          textbook.condition === "New" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {textbook.condition}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{textbook.title}</h3>
                      <p className="text-sm text-muted-foreground">{textbook.author}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-purple-50">
                          {textbook.module}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{textbook.institution}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="text-sm ml-1">
                          {textbook.rating} ({textbook.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-xs">
                        <Badge
                          variant="outline"
                          className={
                            textbook.sellerType === "Bookstore Partner"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700"
                          }
                        >
                          {textbook.sellerType}
                        </Badge>
                        {textbook.delivery && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                            <Truck className="h-3 w-3 mr-1" />
                            Delivery
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end justify-between gap-4">
                      <div className="font-bold text-lg">R{textbook.price}</div>
                      <Link href={`/categories/textbooks/${textbook.id}`}>
                        <Button className="bg-purple-700 hover:bg-purple-800">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {sortedTextbooks.length === 0 && (
            <div className="text-center py-12 border rounded-lg">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No textbooks found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find more textbooks</p>
            </div>
          )}

          {/* AI Suggestions */}
          {sortedTextbooks.length > 0 && (
            <div className="mt-8 border p-6 rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 mr-2 text-blue-600"
                >
                  <path d="M12 2c1.7 0 3.3.2 4.6.6a12 12 0 0 1 7 7c.4 1.3.6 2.9.6 4.6 0 1.7-.2 3.3-.6 4.6a12 12 0 0 1-7 7c-1.3.4-2.9.6-4.6.6-1.7 0-3.3-.2-4.6-.6a12 12 0 0 1-7-7C.2 17.3 0 15.7 0 14c0-1.7.2-3.3.6-4.6a12 12 0 0 1 7-7C8.7 2.2 10.3 2 12 2Z" />
                  <path d="M8 15h8" />
                  <path d="M8 9h2" />
                  <path d="M14 9h2" />
                </svg>
                AI-Powered Suggestions
              </h3>
              <p className="text-sm mb-4">Based on your search history and enrolled modules, you might also need:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border bg-white rounded-lg p-3 flex items-center">
                  <div className="relative h-12 w-12 mr-3">
                    <Image
                      src="/placeholder.svg?height=100&width=100&text=Stats"
                      alt="Statistics Textbook"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Statistics for Business</h4>
                    <p className="text-xs text-muted-foreground">Required for BUS2601</p>
                  </div>
                </div>
                <div className="border bg-white rounded-lg p-3 flex items-center">
                  <div className="relative h-12 w-12 mr-3">
                    <Image
                      src="/placeholder.svg?height=100&width=100&text=Python"
                      alt="Python Programming"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Python Programming</h4>
                    <p className="text-xs text-muted-foreground">Recommended for CSC1502</p>
                  </div>
                </div>
                <div className="border bg-white rounded-lg p-3 flex items-center">
                  <div className="relative h-12 w-12 mr-3">
                    <Image
                      src="/placeholder.svg?height=100&width=100&text=Finance"
                      alt="Corporate Finance"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Corporate Finance</h4>
                    <p className="text-xs text-muted-foreground">Popular with BUS1501</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
