"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Star, 
  Calendar, 
  ShieldCheck, 
  MessageSquare,
  ChevronLeft,
  Package,
  TrendingUp
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface SellerProfile {
  id: string
  name: string
  email: string
  avatar: string | null
  university: string | null
  verified: boolean
  documentsUploaded: boolean
  createdAt: string
  stats: {
    totalListings: number
    activeListings: number
    soldItems: number
    averageRating: number
    totalReviews: number
  }
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  condition: string
  status: string
  available: boolean
  images: string[]
  category: {
    name: string
  }
  createdAt: string
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = params.id as string

  useEffect(() => {
    fetchProfile()
    fetchProducts()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      } else {
        setError('User not found')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/products`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleMessage = () => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/messages?userId=${userId}`)
  }

  const getProductImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0]
    }
    return '/placeholder.svg'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This user profile could not be found.'}</p>
          <Button onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                    <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>

                  {/* Verification Badge */}
                  {profile.verified && (
                    <Badge className="mb-3 bg-green-100 text-green-800 border-green-200">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified Seller
                    </Badge>
                  )}

                  {/* University */}
                  {profile.university && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.university}
                    </div>
                  )}

                  {/* Joined Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {formatDate(profile.createdAt)}
                  </div>

                  {/* Message Button */}
                  {user && user.id !== userId && (
                    <Button
                      className="w-full bg-purple-700 hover:bg-purple-800"
                      onClick={handleMessage}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-gray-600">Active Listings</span>
                  </div>
                  <span className="font-semibold">{profile.stats.activeListings}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-gray-600">Items Sold</span>
                  </div>
                  <span className="font-semibold">{profile.stats.soldItems}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="text-gray-600">Average Rating</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">
                      {profile.stats.averageRating > 0 
                        ? profile.stats.averageRating.toFixed(1) 
                        : 'N/A'}
                    </span>
                    {profile.stats.totalReviews > 0 && (
                      <span className="text-xs text-gray-500">
                        ({profile.stats.totalReviews} reviews)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Products */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Active Listings ({products.filter(p => p.available && p.status === 'active').length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products listed yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products
                      .filter(p => p.available && p.status === 'active')
                      .map((product) => (
                        <Link 
                          key={product.id} 
                          href={`/product/${product.id}`}
                          className="block group"
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            <div className="relative h-48">
                              <Image
                                src={getProductImage(product)}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <Badge className="absolute top-2 right-2 bg-white/90 text-purple-700">
                                {product.category.name}
                              </Badge>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors">
                                {product.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-purple-700">
                                  R{product.price.toFixed(2)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {product.condition}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
