"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Globe, MapPin, Star, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample tutor data
const tutors = [
  {
    id: "1",
    name: "Sarah Johnson",
    photo: "/placeholder.svg?height=100&width=100&text=SJ",
    courses: ["MATH151", "MATH152", "STAT101"],
    institution: "University of Cape Town",
    hourlyRate: 200,
    mode: ["Online", "In-person"],
    location: "Cape Town Central",
    rating: 4.8,
    reviewCount: 24,
    verified: true,
    qualification: "MSc Mathematics (3rd Year)",
  },
  {
    id: "2",
    name: "David Nkosi",
    photo: "/placeholder.svg?height=100&width=100&text=DN",
    courses: ["PHY101", "PHY202", "CHEM101"],
    institution: "University of the Witwatersrand",
    hourlyRate: 180,
    mode: ["Online"],
    location: "Johannesburg",
    rating: 4.9,
    reviewCount: 31,
    verified: true,
    qualification: "BSc Physics (Honours)",
  },
  {
    id: "3",
    name: "Thandi Mbeki",
    photo: "/placeholder.svg?height=100&width=100&text=TM",
    courses: ["ACC101", "FIN201", "ECON102"],
    institution: "University of Pretoria",
    hourlyRate: 220,
    mode: ["In-person"],
    location: "Pretoria",
    rating: 4.7,
    reviewCount: 18,
    verified: true,
    qualification: "BCom Accounting (3rd Year)",
  },
  {
    id: "4",
    name: "Michael van der Merwe",
    photo: "/placeholder.svg?height=100&width=100&text=MM",
    courses: ["CS101", "CS202", "DATA301"],
    institution: "Stellenbosch University",
    hourlyRate: 250,
    mode: ["Online", "In-person"],
    location: "Stellenbosch",
    rating: 4.9,
    reviewCount: 42,
    verified: true,
    qualification: "MSc Computer Science (Final Year)",
  },
  {
    id: "5",
    name: "Lerato Molefe",
    photo: "/placeholder.svg?height=100&width=100&text=LM",
    courses: ["BIO101", "BIO202", "MBIO301"],
    institution: "University of KwaZulu-Natal",
    hourlyRate: 190,
    mode: ["Online"],
    location: "Durban",
    rating: 4.6,
    reviewCount: 15,
    verified: true,
    qualification: "BSc Biology (Honours)",
  },
  {
    id: "6",
    name: "James Peterson",
    photo: "/placeholder.svg?height=100&width=100&text=JP",
    courses: ["ENG101", "LIT202", "WRIT101"],
    institution: "Rhodes University",
    hourlyRate: 170,
    mode: ["Online", "In-person"],
    location: "Makhanda",
    rating: 4.7,
    reviewCount: 22,
    verified: false,
    qualification: "BA English Literature (3rd Year)",
  },
]

// Filter options
const institutions = [
  "All Institutions",
  "University of Cape Town",
  "University of the Witwatersrand",
  "University of Pretoria",
  "Stellenbosch University",
  "University of KwaZulu-Natal",
  "Rhodes University",
  "University of Johannesburg",
  "UNISA",
  "DUT",
]

const subjects = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Accounting",
  "Economics",
  "Finance",
  "English",
  "Engineering",
]

const qualificationLevels = [
  "All Levels",
  "Undergraduate (NQF 5-6)",
  "Bachelor's Degree (NQF 7)",
  "Honours (NQF 8)",
  "Master's (NQF 9)",
  "PhD (NQF 10)",
]

const deliveryMethods = ["All Methods", "Online", "In-person", "Both"]

const locations = [
  "All Locations",
  "Cape Town",
  "Johannesburg",
  "Pretoria",
  "Durban",
  "Stellenbosch",
  "Makhanda",
  "Port Elizabeth",
  "Bloemfontein",
]

export default function TutoringPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState("All Institutions")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedQualification, setSelectedQualification] = useState("All Levels")
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("All Methods")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [minRating, setMinRating] = useState(0)

  // Filter tutors based on selected filters
  const filteredTutors = tutors.filter((tutor) => {
    // Search query filter
    if (
      searchQuery &&
      !tutor.courses.some((course) => course.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Institution filter
    if (selectedInstitution !== "All Institutions" && tutor.institution !== selectedInstitution) {
      return false
    }

    // Subject filter (simplified for demo)
    if (selectedSubject !== "All Subjects") {
      const subjectMap: { [key: string]: string[] } = {
        Mathematics: ["MATH", "STAT"],
        Physics: ["PHY"],
        Chemistry: ["CHEM"],
        Biology: ["BIO", "MBIO"],
        "Computer Science": ["CS", "DATA"],
        Accounting: ["ACC"],
        Economics: ["ECON"],
        Finance: ["FIN"],
        English: ["ENG", "LIT", "WRIT"],
      }

      const relevantPrefixes = subjectMap[selectedSubject] || []
      if (!tutor.courses.some((course) => relevantPrefixes.some((prefix) => course.startsWith(prefix)))) {
        return false
      }
    }

    // Delivery method filter
    if (
      selectedDeliveryMethod !== "All Methods" &&
      !tutor.mode.includes(selectedDeliveryMethod === "Both" ? "Online" : selectedDeliveryMethod)
    ) {
      return false
    }

    // Location filter (simplified)
    if (selectedLocation !== "All Locations" && !tutor.location.includes(selectedLocation)) {
      return false
    }

    // Price range filter
    if (tutor.hourlyRate < priceRange[0] || tutor.hourlyRate > priceRange[1]) {
      return false
    }

    // Rating filter
    if (tutor.rating < minRating) {
      return false
    }

    return true
  })

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Find a Tutor</h1>
        <p className="text-muted-foreground max-w-2xl">
          Connect with qualified student tutors to help you excel in your studies.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search by Module Name or Code (e.g., MAT151, Accounting 1A)"
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
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
                <Label htmlFor="subject">Module/Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification Level</Label>
                <Select value={selectedQualification} onValueChange={setSelectedQualification}>
                  <SelectTrigger id="qualification">
                    <SelectValue placeholder="Select qualification level" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualificationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery">Delivery Method</Label>
                <Select value={selectedDeliveryMethod} onValueChange={setSelectedDeliveryMethod}>
                  <SelectTrigger id="delivery">
                    <SelectValue placeholder="Select delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location/Campus</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range (Hourly Rate)</Label>
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
                <Label>Minimum Rating</Label>
                <div className="flex items-center space-x-2 pt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`p-1 rounded-full ${minRating >= rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-2 bg-purple-700 hover:bg-purple-800">Apply Filters</Button>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Are you a tutor?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share your knowledge and earn money by becoming a verified tutor on Zenith.
            </p>
            <Link href="/categories/tutoring/become-tutor">
              <Button className="w-full bg-purple-700 hover:bg-purple-800">Become a Tutor</Button>
            </Link>
          </div>
        </div>

        {/* Tutors List */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTutors.length} of {tutors.length} tutors
              </div>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTutors.map((tutor) => (
                  <Card key={tutor.id} className="overflow-hidden hover-card">
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden">
                          <Image
                            src={tutor.photo || "/placeholder.svg"}
                            alt={tutor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{tutor.name}</h3>
                            {tutor.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" title="Verified Tutor" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{tutor.qualification}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm ml-1">
                              {tutor.rating} ({tutor.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Tutors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tutor.courses.map((course) => (
                              <Badge key={course} variant="outline" className="bg-purple-50">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{tutor.institution}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {tutor.mode.includes("Online") && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <Globe className="h-3 w-3 mr-1" />
                                Online
                              </Badge>
                            )}
                            {tutor.mode.includes("In-person") && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <MapPin className="h-3 w-3 mr-1" />
                                In-person
                              </Badge>
                            )}
                          </div>
                          <div className="font-bold">R{tutor.hourlyRate}/hr</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 flex gap-2">
                      <Link href={`/categories/tutoring/profile/${tutor.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Link href={`/categories/tutoring/request/${tutor.id}`} className="flex-1">
                        <Button className="w-full bg-purple-700 hover:bg-purple-800">Request Session</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {filteredTutors.map((tutor) => (
                  <Card key={tutor.id} className="overflow-hidden hover-card">
                    <div className="p-4 flex flex-col md:flex-row gap-4">
                      <div className="flex items-center md:items-start gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={tutor.photo || "/placeholder.svg"}
                            alt={tutor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{tutor.name}</h3>
                            {tutor.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" title="Verified Tutor" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{tutor.qualification}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm ml-1">
                              {tutor.rating} ({tutor.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div>
                          <span className="text-sm font-medium">Tutors:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tutor.courses.map((course) => (
                              <Badge key={course} variant="outline" className="bg-purple-50">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{tutor.institution}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {tutor.mode.includes("Online") && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Globe className="h-3 w-3 mr-1" />
                              Online
                            </Badge>
                          )}
                          {tutor.mode.includes("In-person") && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <MapPin className="h-3 w-3 mr-1" />
                              In-person
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end justify-between gap-4">
                        <div className="font-bold text-lg">R{tutor.hourlyRate}/hr</div>
                        <div className="flex gap-2">
                          <Link href={`/categories/tutoring/profile/${tutor.id}`}>
                            <Button variant="outline">View Profile</Button>
                          </Link>
                          <Link href={`/categories/tutoring/request/${tutor.id}`}>
                            <Button className="bg-purple-700 hover:bg-purple-800">Request Session</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredTutors.length === 0 && (
            <div className="text-center py-12 border rounded-lg">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tutors found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to find more tutors</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
