"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, MapPin, MessageSquare, Share2, ShieldCheck, Star, User, Heart, Download, FileText, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  title: string
  description: string
  price: number
  quantity: number
  condition: string
  status: string
  available: boolean
  location: string | null
  university: string | null
  images: string[]
  pdfFile: string | null
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
  }
  seller: {
    id: string
    name: string
    email: string
    avatar: string | null
    university: string | null
    verified: boolean
    documentsUploaded: boolean
    rating: number
    joinedDate: string
  }
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    createdAt: string
    user: {
      id: string
      name: string
      avatar: string | null
    }
  }>
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [checkingPurchase, setCheckingPurchase] = useState(false)

  useEffect(() => {
    fetchProduct()
    if (user) {
      checkPurchaseStatus()
    }
  }, [params.id, user])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        console.error('Failed to fetch product')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkPurchaseStatus = async () => {
    setCheckingPurchase(true)
    try {
      const response = await fetch(`/api/orders/check-purchase?productId=${params.id}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setHasPurchased(data.purchased)
      }
    } catch (error) {
      console.error('Error checking purchase status:', error)
    } finally {
      setCheckingPurchase(false)
    }
  }

  const handlePdfDownload = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!product?.pdfFile) return

    // Check if user is seller or has purchased
    const isSeller = user.id === product.seller.id
    if (!isSeller && !hasPurchased) {
      alert('You need to purchase this item to download the PDF')
      return
    }

    try {
      // Request watermarked PDF
      const response = await fetch(`/api/products/pdf/download?productId=${params.id}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to download PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF')
    }
  }

  const handlePdfPreview = () => {
    if (!user) {
      router.push('/login')
      return
    }

    const isSeller = user.id === product?.seller.id
    if (!isSeller && !hasPurchased) {
      alert('You need to purchase this item to preview the PDF')
      return
    }

    setShowPdfPreview(true)
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setWishlistLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ productId: params.id })
      })

      if (response.ok) {
        setIsInWishlist(true)
        alert('Added to wishlist!')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      alert('Failed to add to wishlist')
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleContactSeller = () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!product) return

    // Navigate to messages page with seller ID as query parameter
    router.push(`/messages?userId=${product.seller.id}&productId=${product.id}`)
  }

  const handleMessage = () => {
    handleContactSeller()
  }

  const handleViewProfile = () => {
    if (!product) return
    // Navigate to seller's profile page (you may need to create this)
    router.push(`/profile/${product.seller.id}`)
  }

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} on Zenith Marketplace`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
          <Link href="/browse">
            <Button className="mt-4 bg-purple-700 hover:bg-purple-800">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const listedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-gray-100">
            <Image 
              src={product.images[currentImage] || "/placeholder.svg"} 
              alt={product.title} 
              fill 
              className="object-contain" 
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index} 
                className={`relative h-24 rounded-lg overflow-hidden border-2 cursor-pointer ${
                  currentImage === index ? 'border-purple-600' : 'border-gray-200'
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="flex items-center mt-2 space-x-4 flex-wrap gap-2">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{product.category.name}</span>
              </div>
              {product.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{listedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">R{product.price.toFixed(2)}</div>
            <div className="text-sm px-2 py-1 bg-purple-100 text-purple-800 rounded-full">{product.condition}</div>
          </div>

          {product.quantity > 0 && (
            <div className="text-sm text-gray-600">
              Available: {product.quantity} {product.quantity === 1 ? 'item' : 'items'}
            </div>
          )}

          <div className="space-y-4">
            <Button 
              className="w-full bg-purple-700 hover:bg-purple-800"
              onClick={handleContactSeller}
              disabled={!product.available || product.status === 'sold'}
            >
              {product.status === 'sold' ? 'Sold Out' : 'Contact Seller'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleAddToWishlist}
              disabled={wishlistLoading || isInWishlist}
            >
              <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-center"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* PDF Download Section */}
          {product.pdfFile && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-purple-900">PDF Available</h3>
                </div>
                
                {user && (user.id === product.seller.id || hasPurchased) ? (
                  <div className="space-y-2">
                    <p className="text-sm text-purple-700 mb-3">
                      {user.id === product.seller.id 
                        ? 'You can access this PDF as the seller'
                        : 'You have access to this PDF'}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-purple-300 hover:bg-purple-100"
                        onClick={handlePdfPreview}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview PDF
                      </Button>
                      <Button 
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={handlePdfDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-purple-700">
                      📄 This item includes a downloadable PDF
                    </p>
                    <p className="text-xs text-purple-600">
                      Purchase this item to access the PDF file
                    </p>
                    {!user && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-2 border-purple-300"
                        onClick={() => router.push('/login')}
                      >
                        Login to Purchase
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {product.seller.avatar ? (
                    <Image
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{product.seller.name}</span>
                    {product.seller.verified && (
                      <div className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                        <ShieldCheck className="h-3 w-3 mr-0.5" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                    <span>
                      {product.seller.rating.toFixed(1)} • Joined {product.seller.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleMessage}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleViewProfile}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Safety Tips</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Meet in a public place</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use Zenith's secure payment system</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check the item before paying</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Report suspicious behavior</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Condition:</span>
                <span>{product.condition}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Category:</span>
                <span>{product.category.name}</span>
              </div>
              {product.university && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">University:</span>
                  <span>{product.university}</span>
                </div>
              )}
              {product.location && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Location:</span>
                  <span>{product.location}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Available Quantity:</span>
                <span>{product.quantity}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{product.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Listed:</span>
                <span>{listedDate}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            {product.reviews.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Reviews Yet</h3>
                <p className="text-muted-foreground">Be the first to review this product</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {review.user.avatar ? (
                            <Image
                              src={review.user.avatar}
                              alt={review.user.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{review.user.name}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-current text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* PDF Preview Modal - Shows only first page */}
      {showPdfPreview && product?.pdfFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">PDF Preview - {product.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPdfPreview(false)}
              >
                ✕ Close
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 relative">
              {/* PDF Viewer showing only first page */}
              <iframe
                src={`/api/products/pdf/preview?productId=${params.id}`}
                className="w-full h-full border-0"
                title="PDF Preview - First Page Only"
              />
              {/* Info banner */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-10">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">Preview shows first page only</span>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-purple-700 font-medium text-sm">
                  <span>💎 Purchase to download and view the complete PDF ({product.pdfFile ? 'All pages included' : ''})</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    🔒 Downloaded PDFs are watermarked with your account information
                  </p>
                  <Button
                    onClick={handlePdfDownload}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Full PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
