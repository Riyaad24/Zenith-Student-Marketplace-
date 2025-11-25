"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Edit, MapPin, MessageSquare, Package, ShoppingBag, Star, User, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/ui/file-upload"
import { VerificationBadge, VerificationShield } from "@/components/ui/verification-badge"
import { EmailVerificationSection } from "@/components/email-verification"

interface UserProfile {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  avatar?: string | null
  phone?: string
  university?: string
  location?: string
  bio?: string
  verified: boolean
  joinedDate: string
  isAdmin?: boolean // Add admin flag
  // Verification fields
  profilePicture?: string | null
  studentCardImage?: string | null
  idDocumentImage?: string | null
  documentsUploaded: boolean
  adminVerified: boolean
  verificationNotes?: string | null
  verifiedAt?: string | null
  security?: {
    emailVerified: boolean
  }
  stats: {
    listings: number
    totalListings: number
    sales: number
    rating: number
  }
}

export default function AccountPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [listings, setListings] = useState<any[]>([])
  const [listingsLoading, setListingsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    university: '',
    location: '',
    bio: '',
    phone: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
  }, [user, loading, router])

  // Fetch extended profile data
  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchListings()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          university: data.user.university || '',
          location: data.user.location || '',
          bio: data.user.bio || '',
          phone: data.user.phone || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const fetchListings = async () => {
    setListingsLoading(true)
    try {
      const response = await fetch('/api/products/my-listings?status=all', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setListings(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setListingsLoading(false)
    }
  }

  const handleDeleteListing = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/my-listings?id=${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Refresh listings
        fetchListings()
      } else {
        alert('Failed to delete listing')
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
      alert('Failed to delete listing')
    }
  }

  const handleMarkAsSold = async (productId: string) => {
    try {
      const response = await fetch('/api/products/my-listings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ productId, status: 'sold' })
      })

      if (response.ok) {
        // Refresh listings
        fetchListings()
      } else {
        alert('Failed to update listing')
      }
    } catch (error) {
      console.error('Failed to update listing:', error)
      alert('Failed to update listing')
    }
  }

  const handleFileUpload = (type: 'profile' | 'studentCard' | 'idDocument', url: string) => {
    setProfile(prev => {
      if (!prev) return null
      
      const updated = { ...prev }
      
      if (type === 'profile') {
        updated.profilePicture = url
        updated.avatar = url
      } else if (type === 'studentCard') {
        updated.studentCardImage = url
      } else if (type === 'idDocument') {
        updated.idDocumentImage = url
      }
      
      // Check if all documents are uploaded
      const hasAllDocs = !!(updated.profilePicture && updated.studentCardImage && updated.idDocumentImage)
      updated.documentsUploaded = hasAllDocs
      
      return updated
    })
    
    // Refresh profile data from server
    fetchProfile()
  }

  const handleSaveProfile = async () => {
    if (!profile) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, ...data.user } : null)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile data</p>
        </div>
      </div>
    )
  }

  // Purchases will come from the API/database in the future
  const purchases: any[] = []

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {(profile.profilePicture || profile.avatar) ? (
                      <Image
                        src={profile.profilePicture || profile.avatar || "/placeholder.svg"}
                        alt={profile.name}
                        width={96}
                        height={96}
                        className="rounded-full object-cover w-full h-full"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-600" />
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={() => setActiveTab("verification")}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {profile.name || 'No name set'}
                  <VerificationShield 
                    adminVerified={profile.adminVerified} 
                    documentsUploaded={profile.documentsUploaded}
                    size="md"
                  />
                </h2>
                <div className="flex items-center justify-center mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{profile.location || 'Location not set'}</span>
                </div>
                <div className="flex items-center justify-center mt-1 text-sm">
                  <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                  <span>
                    {profile.stats.rating} • Joined {profile.joinedDate}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full mt-4">
                  <div className="text-center">
                    <div className="font-bold">{profile.stats.listings}</div>
                    <div className="text-xs text-muted-foreground">Listings</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{profile.stats.sales}</div>
                    <div className="text-xs text-muted-foreground">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{profile.stats.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-purple-700 hover:bg-purple-800"
                  onClick={() => setActiveTab("verification")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Manage Verification
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-2">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "profile" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            {/* Hide verification tab for admins */}
            {!profile.isAdmin && (
              <Button
                variant={activeTab === "verification" ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === "verification" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
                onClick={() => setActiveTab("verification")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Verification
              </Button>
            )}
            <Button
              variant={activeTab === "listings" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "listings" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              My Listings
            </Button>
            <Button
              variant={activeTab === "purchases" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "purchases" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("purchases")}
            >
              <Package className="h-4 w-4 mr-2" />
              Purchases
            </Button>
            <Button
              variant={activeTab === "messages" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "messages" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Verification Reminder Banner - Hidden for admins */}
          {!profile.isAdmin && !profile.documentsUploaded && (
            <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900">
                    Complete Your Account Verification
                  </h3>
                  <p className="mt-2 text-sm text-yellow-800">
                    To unlock full access to Zenith Marketplace and build trust with other students, please submit your verification documents. 
                    Verified accounts can buy, sell, and trade with confidence.
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() => setActiveTab("verification")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Submit Verification Documents
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Store dismissal in localStorage
                    localStorage.setItem('verification-reminder-dismissed', 'true')
                    const banner = document.getElementById('verification-banner')
                    if (banner) banner.style.display = 'none'
                  }}
                  className="flex-shrink-0 ml-4 text-yellow-600 hover:text-yellow-800"
                  aria-label="Dismiss"
                  id="verification-banner"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={profile.email} 
                    disabled 
                    className="bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g., +27 123 456 7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University/College</Label>
                  <Input 
                    id="university" 
                    value={formData.university}
                    onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                    placeholder="e.g., University of Cape Town"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Cape Town, Western Cape"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell other users about yourself..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setFormData({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    university: profile.university || '',
                    location: profile.location || '',
                    bio: profile.bio || '',
                    phone: profile.phone || ''
                  })}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-purple-700 hover:bg-purple-800"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "verification" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Verification</CardTitle>
                  <CardDescription>
                    Upload your documents to verify your student status and gain full access to the marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <VerificationBadge
                      documentsUploaded={profile.documentsUploaded}
                      adminVerified={profile.adminVerified}
                      verifiedAt={profile.verifiedAt}
                      size="lg"
                    />
                  </div>

                  {profile.verificationNotes && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Message from Zenith Support:</h4>
                      <p className="text-blue-800">{profile.verificationNotes}</p>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    <FileUpload
                      type="profile"
                      currentFile={profile.profilePicture}
                      onUploadSuccess={(url) => handleFileUpload('profile', url)}
                      title="Profile Picture"
                      description="Upload a clear photo of yourself"
                      acceptedFormats="JPEG, PNG, WebP"
                      maxSize="5MB"
                    />

                    <FileUpload
                      type="studentCard"
                      currentFile={profile.studentCardImage}
                      onUploadSuccess={(url) => handleFileUpload('studentCard', url)}
                      title="Proof of registration"
                      description="Upload an official proof of registration/enrolment letter showing your name, institution, and current year/semester."
                      acceptedFormats="JPEG, PNG, WebP, PDF"
                      maxSize="10MB"
                    />

                    <FileUpload
                      type="idDocument"
                      currentFile={profile.idDocumentImage}
                      onUploadSuccess={(url) => handleFileUpload('idDocument', url)}
                      title="ID Document"
                      description="Upload a photo of your South African ID"
                      acceptedFormats="JPEG, PNG, WebP, PDF"
                      maxSize="10MB"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Verification Process:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>1. Upload all three required documents (profile picture, proof of registration, and ID)</li>
                      <li>2. Our support team will review your documents within 24-48 hours</li>
                      <li>3. Once verified, you'll get a green verification badge on your profile</li>
                      <li>4. Verified students get priority in search results and buyer trust</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Email Verification Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Verification</CardTitle>
                  <CardDescription>
                    Verify your email address to enhance account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmailVerificationSection />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "listings" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>Manage your product listings</CardDescription>
                </div>
                <Link href="/sell">
                  <Button className="bg-purple-700 hover:bg-purple-800">Add New Listing</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    <TabsTrigger value="sold">Sold</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className="mt-0 space-y-4">
                    {listingsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading listings...</p>
                      </div>
                    ) : listings.filter((listing) => listing.status === "active").length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No active listings</p>
                        <Link href="/sell">
                          <Button className="mt-4 bg-purple-700 hover:bg-purple-800">Create Your First Listing</Button>
                        </Link>
                      </div>
                    ) : (
                      listings
                        .filter((listing) => listing.status === "active")
                        .map((listing) => (
                          <div key={listing.id} className="flex items-center border rounded-lg p-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={listing.image || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium truncate">{listing.title}</h3>
                                  <div className="text-sm text-muted-foreground">
                                    Listed {new Date(listing.createdAt).toLocaleDateString()} • Qty: {listing.quantity}
                                  </div>
                                  {listing.category && (
                                    <div className="text-xs text-purple-600 mt-1">
                                      {listing.category.name}
                                    </div>
                                  )}
                                </div>
                                <div className="font-bold whitespace-nowrap">R{listing.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="ml-4 flex gap-2 flex-shrink-0">
                              <Link href={`/product/${listing.id}`}>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMarkAsSold(listing.id)}
                              >
                                Mark Sold
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteListing(listing.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>
                  <TabsContent value="pending" className="mt-0 space-y-4">
                    {listingsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading listings...</p>
                      </div>
                    ) : listings.filter((listing) => listing.status === "pending").length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No pending listings</p>
                        <p className="text-sm text-gray-500 mt-2">Listings awaiting admin approval will appear here</p>
                      </div>
                    ) : (
                      listings
                        .filter((listing) => listing.status === "pending")
                        .map((listing) => (
                          <div key={listing.id} className="flex items-center border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={listing.image || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium truncate">{listing.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      ⏳ Awaiting Admin Approval
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Submitted {new Date(listing.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="font-bold whitespace-nowrap">R{listing.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="ml-4 flex gap-2 flex-shrink-0">
                              <Link href={`/product/${listing.id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>
                  <TabsContent value="rejected" className="mt-0 space-y-4">
                    {listingsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading listings...</p>
                      </div>
                    ) : listings.filter((listing) => listing.status === "rejected").length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No rejected listings</p>
                      </div>
                    ) : (
                      listings
                        .filter((listing) => listing.status === "rejected")
                        .map((listing) => (
                          <div key={listing.id} className="flex items-center border rounded-lg p-4 bg-red-50 border-red-200">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={listing.image || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover opacity-75"
                              />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium truncate">{listing.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      ✗ Rejected
                                    </span>
                                  </div>
                                  {listing.rejectionReason && (
                                    <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
                                      <strong>Reason:</strong> {listing.rejectionReason}
                                    </div>
                                  )}
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Rejected {new Date(listing.updatedAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="font-bold whitespace-nowrap">R{listing.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="ml-4 flex gap-2 flex-shrink-0">
                              <Link href={`/sell?edit=${listing.id}`}>
                                <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100">
                                  Edit & Resubmit
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>
                  <TabsContent value="sold" className="mt-0 space-y-4">
                    {listingsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading listings...</p>
                      </div>
                    ) : listings.filter((listing) => listing.status === "sold").length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No sold items yet</p>
                      </div>
                    ) : (
                      listings
                        .filter((listing) => listing.status === "sold")
                        .map((listing) => (
                          <div key={listing.id} className="flex items-center border rounded-lg p-4 opacity-75">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={listing.image || "/placeholder.svg"}
                                alt={listing.title}
                                fill
                                className="object-cover grayscale"
                              />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium truncate">{listing.title}</h3>
                                  <div className="text-sm text-muted-foreground">
                                    Sold on {new Date(listing.updatedAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="font-bold whitespace-nowrap">R{listing.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="ml-4 flex gap-2 flex-shrink-0">
                              <Link href={`/product/${listing.id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>
                  <TabsContent value="drafts" className="mt-0">
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
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
                          className="h-6 w-6 text-muted-foreground"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium">No Draft Listings</h3>
                      <p className="text-muted-foreground mt-1">You don't have any draft listings yet</p>
                      <Link href="/sell">
                        <Button className="mt-4 bg-purple-700 hover:bg-purple-800">Create New Listing</Button>
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {activeTab === "purchases" && (
            <Card>
              <CardHeader>
                <CardTitle>My Purchases</CardTitle>
                <CardDescription>View your purchase history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center border rounded-lg p-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={purchase.image || "/placeholder.svg"}
                          alt={purchase.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{purchase.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              Purchased {purchase.date} from {purchase.seller}
                            </div>
                          </div>
                          <div className="font-bold">R{purchase.price}</div>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "messages" && (
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Your conversations with other users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Message Center</h3>
                  <p className="text-muted-foreground mt-1">View and manage your conversations</p>
                  <Link href="/messages">
                    <Button className="mt-4 bg-purple-700 hover:bg-purple-800">Go to Messages</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
