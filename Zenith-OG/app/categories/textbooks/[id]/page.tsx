"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
  Truck,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample textbook data
const textbooks = {
  "1": {
    id: "1",
    title: "Principles of Marketing 9th Edition",
    author: "Philip Kotler, Gary Armstrong",
    cover: "/placeholder.svg?height=600&width=400&text=Marketing",
    additionalImages: [
      "/placeholder.svg?height=600&width=400&text=Marketing+Back",
      "/placeholder.svg?height=600&width=400&text=Marketing+TOC",
      "/placeholder.svg?height=600&width=400&text=Marketing+Chapter",
    ],
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
    seller: {
      id: "s1",
      name: "Campus Bookstore",
      rating: 4.9,
      reviewCount: 156,
      verified: true,
      joinedDate: "January 2020",
    },
    conditionDetails: "Brand new, sealed in original packaging. Never used or opened.",
    deliveryOptions: ["Campus Pickup", "Courier (R50)", "Post Office (R30)"],
    similarBooks: [
      {
        id: "sim1",
        title: "Marketing Management 15th Edition",
        cover: "/placeholder.svg?height=150&width=100&text=Marketing+Mgmt",
        price: 320,
        condition: "New",
      },
      {
        id: "sim2",
        title: "Consumer Behavior 12th Edition",
        cover: "/placeholder.svg?height=150&width=100&text=Consumer",
        price: 250,
        condition: "Used - Good",
      },
      {
        id: "sim3",
        title: "Strategic Marketing 8th Edition",
        cover: "/placeholder.svg?height=150&width=100&text=Strategic",
        price: 180,
        condition: "Used - Like New",
      },
    ],
    reviews: [
      {
        id: "r1",
        user: "Michael P.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent service! The book arrived quickly and was exactly as described.",
      },
      {
        id: "r2",
        user: "Thabo M.",
        rating: 5,
        date: "1 month ago",
        comment: "Perfect condition, fast delivery. Very happy with my purchase.",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Introduction to Financial Accounting 8th Edition",
    author: "Charles T. Horngren, Gary L. Sundem",
    cover: "/placeholder.svg?height=600&width=400&text=Accounting",
    additionalImages: [
      "/placeholder.svg?height=600&width=400&text=Accounting+Back",
      "/placeholder.svg?height=600&width=400&text=Accounting+Inside",
    ],
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
    seller: {
      id: "s2",
      name: "Lerato M.",
      rating: 4.7,
      reviewCount: 12,
      verified: true,
      joinedDate: "March 2022",
    },
    conditionDetails:
      "Used for one semester. Some highlighting in chapters 1-3 (yellow highlighter). No writing or notes in margins. Cover has slight wear on corners. All pages intact and clean.",
    deliveryOptions: ["Campus Meetup", "Courier (R60)"],
    similarBooks: [
      {
        id: "sim4",
        title: "Cost Accounting 16th Edition",
        cover: "/placeholder.svg?height=150&width=100&text=Cost+Accounting",
        price: 150,
        condition: "Used - Good",
      },
      {
        id: "sim5",
        title: "Managerial Accounting 10th Edition",
        cover: "/placeholder.svg?height=150&width=100&text=Managerial",
        price: 135,
        condition: "Used - Fair",
      },
    ],
    reviews: [
      {
        id: "r3",
        user: "Sarah K.",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Book was in good condition as described. There was a bit more highlighting than I expected, but overall I'm satisfied.",
      },
    ],
  },
}

export default function TextbookDetailPage({ params }: { params: { id: string } }) {
  const textbookId = params.id
  const textbook = textbooks[textbookId as keyof typeof textbooks]
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!textbook) {
    return (
      <div className="container px-4 md:px-6 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Textbook Not Found</h1>
        <p className="mb-6">Sorry, the textbook you're looking for doesn't exist.</p>
        <Link href="/categories/textbooks">
          <Button className="bg-purple-700 hover:bg-purple-800">Back to Textbooks</Button>
        </Link>
      </div>
    )
  }

  const allImages = [textbook.cover, ...(textbook.additionalImages || [])]

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const selectImage = (index: number) => {
    setActiveImageIndex(index)
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="mb-6">
        <Link href="/categories/textbooks" className="text-purple-700 hover:underline mb-2 inline-flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Textbooks
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Textbook Images */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <div className="relative aspect-[2/3] border rounded-lg overflow-hidden">
              <Image
                src={allImages[activeImageIndex] || "/placeholder.svg"}
                alt={textbook.title}
                fill
                className="object-contain"
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
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`relative h-20 w-14 flex-shrink-0 border rounded overflow-hidden ${
                    activeImageIndex === index ? "ring-2 ring-purple-700" : ""
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${textbook.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Textbook Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
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
                <Badge variant="outline" className="bg-purple-50">
                  {textbook.module}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">{textbook.title}</h1>
              <p className="text-lg text-muted-foreground">{textbook.author}</p>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 fill-current text-yellow-400" />
                <span className="ml-1">
                  {textbook.rating} ({textbook.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y">
              <div className="text-3xl font-bold">R{textbook.price}</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity((prev) => prev + 1)}>
                    +
                  </Button>
                </div>
                <Button className="bg-purple-700 hover:bg-purple-800">Add to Cart</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Seller
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">ISBN:</span>
                  <span className="text-sm">{textbook.isbn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Edition:</span>
                  <span className="text-sm">{textbook.edition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Pages:</span>
                  <span className="text-sm">{textbook.pages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Published:</span>
                  <span className="text-sm">{textbook.publishYear}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm">{textbook.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Institution:</span>
                  <span className="text-sm">{textbook.institution}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Listed:</span>
                  <span className="text-sm">2 days ago</span>
                </div>
                {textbook.delivery && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Delivery:</span>
                    <span className="text-sm">Available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Buyer Protection</h3>
                <p className="text-sm text-muted-foreground">
                  All payments are held in escrow until you confirm receipt of the textbook in the described condition.
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                Description
              </TabsTrigger>
              <TabsTrigger value="condition" className="flex-1">
                Condition
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex-1">
                Delivery
              </TabsTrigger>
              <TabsTrigger value="seller" className="flex-1">
                Seller
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                <p>{textbook.description}</p>
                <p>
                  This textbook is required for {textbook.module} at {textbook.institution}. It covers all the essential
                  topics for the course and includes access to online resources.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="condition" className="mt-4">
              <div className="space-y-4">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    textbook.condition === "New"
                      ? "bg-blue-100 text-blue-800"
                      : textbook.condition.includes("Like New")
                        ? "bg-green-100 text-green-800"
                        : textbook.condition.includes("Good")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {textbook.condition}
                </div>
                <p>{textbook.conditionDetails}</p>
                {textbook.condition !== "New" && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Condition Guidelines</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="font-medium">Like New:</span>
                        <span className="text-muted-foreground">
                          No damage, marking, or wear. May still be in original packaging.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium">Good:</span>
                        <span className="text-muted-foreground">
                          Minor wear or highlighting. All pages intact and readable.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium">Fair:</span>
                        <span className="text-muted-foreground">
                          Noticeable wear, may have writing or significant highlighting.
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="delivery" className="mt-4">
              <div className="space-y-4">
                <h3 className="font-medium">Delivery Options</h3>
                <ul className="space-y-2">
                  {textbook.deliveryOptions.map((option, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full border flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-purple-700"></div>
                      </div>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Estimated Delivery Times</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Campus Pickup/Meetup:</span>
                      <span className="text-muted-foreground">Same day or next day, by arrangement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Courier:</span>
                      <span className="text-muted-foreground">1-3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Post Office:</span>
                      <span className="text-muted-foreground">3-7 business days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="seller" className="mt-4">
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-gray-600" />
                  {textbook.seller.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-xs p-1 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{textbook.seller.name}</h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span className="text-sm ml-1">
                      {textbook.seller.rating} ({textbook.seller.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Member since {textbook.seller.joinedDate}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t mt-6 pt-4">
                <h3 className="font-medium mb-2">Seller Policies</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-medium">Returns:</span>
                    <span className="text-muted-foreground">
                      Accepted within 7 days if item doesn't match description
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">Payment:</span>
                    <span className="text-muted-foreground">Secure payment through Zenith escrow system</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-6">
                {textbook.reviews && textbook.reviews.length > 0 ? (
                  textbook.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium">{review.user}</div>
                            <div className="text-xs text-muted-foreground">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Reviews Yet</h3>
                    <p className="text-muted-foreground">Be the first to review this seller</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Similar Textbooks */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Textbooks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {textbook.similarBooks.map((book) => (
            <Link href={`/categories/textbooks/${book.id}`} key={book.id}>
              <Card className="overflow-hidden hover-card h-full">
                <div className="relative pt-[150%]">
                  <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                  <div
                    className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${
                      book.condition === "New" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {book.condition}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2">{book.title}</h3>
                  <div className="mt-2 font-bold text-sm">R{book.price}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Trade or Rent Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
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
                className="h-5 w-5 mr-2 text-purple-700"
              >
                <path d="M16 3h5v5" />
                <path d="M8 3H3v5" />
                <path d="M21 13v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" />
                <path d="m7 10 5-5 5 5" />
                <path d="M12 5v14" />
              </svg>
              Trade Instead of Buy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Have a textbook you don't need anymore? Propose a trade with the seller and save money.
            </p>
            <Button className="w-full bg-purple-700 hover:bg-purple-800">Propose a Trade</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
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
                className="h-5 w-5 mr-2 text-purple-700"
              >
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Rent for the Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Need the book temporarily? Rent it for the semester at a fraction of the purchase price.
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Rental Period:</span>
              <span className="font-bold">4 months</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Rental Price:</span>
              <span className="font-bold">R{Math.round(textbook.price * 0.4)}</span>
            </div>
            <Button className="w-full bg-purple-700 hover:bg-purple-800">Rent This Textbook</Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <div className="mt-12 border p-6 rounded-lg bg-blue-50">
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
          AI-Powered Recommendations
        </h3>
        <p className="text-sm mb-4">Students who bought this textbook also purchased:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border bg-white rounded-lg p-3 flex items-center">
            <div className="relative h-12 w-12 mr-3">
              <Image
                src="/placeholder.svg?height=100&width=100&text=Study+Guide"
                alt="Study Guide"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium">Marketing Principles Study Guide</h4>
              <p className="text-xs text-muted-foreground">Companion to main textbook</p>
            </div>
          </div>
          <div className="border bg-white rounded-lg p-3 flex items-center">
            <div className="relative h-12 w-12 mr-3">
              <Image
                src="/placeholder.svg?height=100&width=100&text=Case+Studies"
                alt="Case Studies"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium">Marketing Case Studies</h4>
              <p className="text-xs text-muted-foreground">Recommended by your lecturer</p>
            </div>
          </div>
          <div className="border bg-white rounded-lg p-3 flex items-center">
            <div className="relative h-12 w-12 mr-3">
              <Image
                src="/placeholder.svg?height=100&width=100&text=Notes"
                alt="Lecture Notes"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium">BUS1501 Lecture Notes</h4>
              <p className="text-xs text-muted-foreground">From top-performing students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
