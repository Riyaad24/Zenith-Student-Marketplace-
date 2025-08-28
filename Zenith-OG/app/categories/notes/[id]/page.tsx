"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  Download,
  Eye,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Shield,
  Flag,
  Heart,
  Share2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState("")
  const [userRating, setUserRating] = useState(0)

  // Sample note data (in real app, fetch based on params.id)
  const note = {
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
    sellerRating: 4.9,
    sellerSales: 47,
    description:
      "Comprehensive study guide covering all ACC1001 topics with examples and practice questions. Includes detailed explanations of accounting principles, financial statements, and practical exercises.",
    contents: [
      "Chapter 1: Introduction to Accounting",
      "Chapter 2: The Accounting Equation",
      "Chapter 3: Recording Transactions",
      "Chapter 4: Financial Statements",
      "Chapter 5: Adjusting Entries",
      "Practice Questions & Solutions",
    ],
    preview: true,
    verified: true,
    helpful: 89,
    uploadDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    cover: "/placeholder.svg?height=600&width=400&text=Accounting+Guide",
    previewImages: [
      "/placeholder.svg?height=800&width=600&text=Preview+Page+1",
      "/placeholder.svg?height=800&width=600&text=Preview+Page+2",
      "/placeholder.svg?height=800&width=600&text=Preview+Page+3",
    ],
  }

  const comments = [
    {
      id: 1,
      user: "Mike K.",
      rating: 5,
      date: "2024-01-25",
      comment:
        "Excellent study guide! Really helped me understand the concepts better. The practice questions are especially useful.",
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      user: "Lisa P.",
      rating: 4,
      date: "2024-01-22",
      comment: "Good content overall, but could use more examples in Chapter 3. Still worth the price though.",
      helpful: 8,
      verified: false,
    },
    {
      id: 3,
      user: "David R.",
      rating: 5,
      date: "2024-01-20",
      comment: "Perfect for exam prep! Covers everything you need to know for ACC1001. Highly recommend.",
      helpful: 15,
      verified: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/categories/notes" className="inline-flex items-center gap-2 text-purple-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Notes & Study Guides
        </Link>

        {/* Cover Image */}
        <div className="mb-8">
          <div className="relative h-[300px] w-full max-w-[600px] mx-auto rounded-lg overflow-hidden border">
            <Image src={note.cover || "/placeholder.svg"} alt={note.title} fill className="object-contain" />
            {note.verified && (
              <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Verified Content
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-3">
                      <span className="font-medium">{note.courseCode}</span>
                      <span>•</span>
                      <span>{note.institution}</span>
                      <span>•</span>
                      <span>{note.year}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">{note.type}</Badge>
                      <Badge variant="secondary">{note.faculty}</Badge>
                      {note.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

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

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(note.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{note.rating}</span>
                    <span className="text-gray-600">({note.reviews} reviews)</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{note.description}</p>
              </CardContent>
            </Card>

            {/* Contents */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {note.contents.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Preview Images */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {note.previewImages.map((image, index) => (
                    <div key={index} className="relative h-[200px] border rounded-md overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Preview page ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                        Sample Page {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reviews & Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Review */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Add Your Review</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 cursor-pointer ${
                            i < userRating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                          onClick={() => setUserRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Share your thoughts about this study guide..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-3"
                  />
                  <Button size="sm">Submit Review</Button>
                </div>

                {/* Existing Reviews */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-sm">
                              {comment.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.user}</span>
                              {comment.verified && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < comment.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>{comment.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.comment}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>Helpful ({comment.helpful})</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600">
                          <ThumbsDown className="h-4 w-4" />
                          <span>Not Helpful</span>
                        </button>
                        <button className="text-gray-600 hover:text-purple-600">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Purchase Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {note.price === 0 ? (
                    <div className="text-3xl font-bold text-green-600">FREE</div>
                  ) : (
                    <div className="text-3xl font-bold">R{note.price}</div>
                  )}
                </div>

                <div className="space-y-3">
                  {note.preview && (
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Sample
                    </Button>
                  )}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Download className="h-4 w-4 mr-2" />
                    {note.price === 0 ? "Download Now" : "Buy & Download"}
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>File Format:</span>
                    <span className="font-medium">{note.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span className="font-medium">{note.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span className="font-medium">{note.downloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">{note.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {note.seller
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{note.seller}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>
                        {note.sellerRating} ({note.sellerSales} sales)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mb-2">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Seller
                </Button>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle>Security & Quality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Malware scanned</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>PDF watermarked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure payment via escrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Student verified content</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
