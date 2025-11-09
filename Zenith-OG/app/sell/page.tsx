"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Trash2, Upload, X, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

interface UploadedImage {
  filename: string
  url: string
  size: number
  type: string
}

interface UploadedPDF {
  filename: string
  url: string
  size: number
  type: string
  originalName: string
}

export default function SellPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [pdfFile, setPdfFile] = useState<UploadedPDF | null>(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [contactPreferences, setContactPreferences] = useState({
    zenithMessages: true,
    email: false,
    phone: false,
  })
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '1',
    category: '',
    condition: '',
    priceType: '',
    city: '',
    campus: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check authentication using auth context
    if (!loading && !user) {
      // User is not authenticated, redirect to login
      router.push('/login')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render the page (redirect will happen)
  if (!user) {
    return null
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    
    // Check if adding these files would exceed the 5 image limit
    if (images.length + files.length > 5) {
      setUploadError('Maximum 5 images allowed per product')
      return
    }

    setUploadingImages(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })

      const response = await fetch('/api/products/images', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload images')
      }

      setImages(prev => [...prev, ...result.images])
      
      // Clear the input value so the same file can be selected again if needed
      if (e.target) {
        e.target.value = ''
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload images')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    
    try {
      // Delete from server
      await fetch(`/api/products/images?filename=${imageToRemove.filename}`, {
        method: 'DELETE',
      })
      
      // Remove from local state
      setImages(images.filter((_, i) => i !== index))
    } catch (error) {
      console.error('Error deleting image:', error)
      // Still remove from UI even if server deletion fails
      setImages(images.filter((_, i) => i !== index))
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    
    setUploadingPdf(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const response = await fetch('/api/products/pdf', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload PDF')
      }

      setPdfFile(result.pdf)
      
      // Clear the input value
      if (e.target) {
        e.target.value = ''
      }

    } catch (error) {
      console.error('PDF upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload PDF')
    } finally {
      setUploadingPdf(false)
    }
  }

  const removePdf = async () => {
    if (!pdfFile) return
    
    try {
      // Delete from server
      await fetch(`/api/products/pdf?filename=${pdfFile.filename}`, {
        method: 'DELETE',
      })
      
      // Remove from local state
      setPdfFile(null)
    } catch (error) {
      console.error('Error deleting PDF:', error)
      // Still remove from UI even if server deletion fails
      setPdfFile(null)
    }
  }

  const handleContactPreferenceChange = (preference: keyof typeof contactPreferences) => {
    setContactPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }))
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    console.log('🚀 List Item button clicked')
    
    if (!termsAgreed) {
      setUploadError('Please agree to the terms and conditions')
      return
    }

    if (images.length === 0) {
      setUploadError('Please add at least one image of your product')
      return
    }

    if (!formData.title || !formData.description || !formData.price || !formData.quantity || !formData.category) {
      setUploadError('Please fill in all required fields')
      return
    }

    if (parseInt(formData.quantity) < 1) {
      setUploadError('Quantity must be at least 1')
      return
    }

    console.log('✅ All validations passed, creating product...')
    console.log('📸 Images array:', images)
    console.log('📄 PDF file:', pdfFile)
    setIsSubmitting(true)
    setUploadError(null)

    try {
      const productData = {
        ...formData,
        images: images.map(img => img.url),
        pdfFile: pdfFile?.url || null,
        contactPreferences,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      }

      console.log('📦 Product data to send:', JSON.stringify(productData, null, 2))

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()
      console.log('📨 API response:', result)
      console.log('📨 Response status:', response.status)

      if (!response.ok) {
        console.error('❌ API Error:', result)
        const errorMessage = result.details 
          ? `${result.error}: ${result.details}` 
          : (result.error || 'Failed to create product listing')
        throw new Error(errorMessage)
      }

      // Show success message with the admin review notification
      alert('✅ Listing Submitted Successfully!\n\nYour product has been submitted for review. An admin will review it before it goes live on Zenith. You\'ll receive a notification once it\'s approved!')

      // Redirect to the account page to see listings
      router.push('/account?tab=listings')
      
    } catch (error) {
      console.error('❌ Submit error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create listing'
      setUploadError(errorMessage)
      
      // Show alert with detailed error
      alert(`❌ Failed to create listing\n\nError: ${errorMessage}\n\nPlease check the browser console (F12) for more details.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">List an Item for Sale</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-medium text-purple-700">{user.name || user.firstName || 'Student'}</span>! 
            Create a listing to sell your items to fellow students.
          </p>
        </div>

        <div className="space-y-8">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Provide details about the item you want to sell</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Calculus Textbook 8th Edition"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="textbooks">Textbooks</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="tutoring">Tutoring Services</SelectItem>
                      <SelectItem value="notes">Notes & Study Guides</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail. Include information about the condition, features, and why you're selling it."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Price and Location */}
          <Card>
            <CardHeader>
              <CardTitle>Price, Quantity & Location</CardTitle>
              <CardDescription>Set your price, available quantity and specify your location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (ZAR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">R</span>
                    <Input 
                      id="price" 
                      type="number" 
                      className="pl-7" 
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Available</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1"
                    max="999"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                  <p className="text-xs text-gray-500">How many items do you have for sale?</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negotiable">Price Type</Label>
                  <Select value={formData.priceType} onValueChange={(value) => handleInputChange('priceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                      <SelectItem value="trade">Trade/Swap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="johannesburg">Johannesburg</SelectItem>
                      <SelectItem value="cape-town">Cape Town</SelectItem>
                      <SelectItem value="durban">Durban</SelectItem>
                      <SelectItem value="pretoria">Pretoria</SelectItem>
                      <SelectItem value="port-elizabeth">Port Elizabeth</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campus">Campus/Area</Label>
                  <Input 
                    id="campus" 
                    placeholder="e.g., UCT Main Campus"
                    value={formData.campus}
                    onChange={(e) => handleInputChange('campus', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Add up to 5 images of your item (first image will be the main image)</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadError && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                    <Image
                      src={image.url}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
                
                {images.length < 5 && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingImages}
                    />
                    <div className="aspect-square border border-dashed rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors">
                      {uploadingImages ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">Add Images</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>• Maximum 5 images (10MB each)</p>
                <p>• Supported formats: JPEG, PNG, WebP</p>
                <p>• First image will be used as the main product image</p>
              </div>
            </CardContent>
          </Card>

          {/* PDF Upload - Only for Textbooks and Study Notes/Guides */}
          {(formData.category === 'textbooks' || formData.category === 'notes') && (
            <Card>
              <CardHeader>
                <CardTitle>PDF File (Optional)</CardTitle>
                <CardDescription>
                  {formData.category === 'textbooks' 
                    ? 'Upload a PDF version of the textbook or sample chapters'
                    : 'Upload your study notes or study guide as a PDF'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pdfFile ? (
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded">
                          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">{pdfFile.originalName}</p>
                          <p className="text-sm text-gray-500">
                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={removePdf}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingPdf}
                    />
                    <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                      {uploadingPdf ? (
                        <>
                          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-3" />
                          <span className="text-sm text-muted-foreground">Uploading PDF...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                          <span className="text-sm font-medium mb-1">Click to upload PDF</span>
                          <span className="text-xs text-muted-foreground">Maximum file size: 50MB</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>• Maximum file size: 50MB</p>
                  <p>• Format: PDF only</p>
                  <p>• {formData.category === 'textbooks' 
                      ? 'Upload the full textbook or sample chapters for buyers to preview'
                      : 'Upload your complete notes/study guide for buyers to access after purchase'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Preferences</CardTitle>
              <CardDescription>Choose how potential buyers can contact you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="zenith-messages"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={contactPreferences.zenithMessages}
                    onChange={() => handleContactPreferenceChange("zenithMessages")}
                  />
                  <label htmlFor="zenith-messages" className="text-sm">
                    Zenith Messages (Required)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="email"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={contactPreferences.email}
                    onChange={() => handleContactPreferenceChange("email")}
                  />
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="phone"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={contactPreferences.phone}
                    onChange={() => handleContactPreferenceChange("phone")}
                  />
                  <label htmlFor="phone" className="text-sm">
                    Phone
                  </label>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Your contact information will only be shared with users you approve.
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 mt-1"
                  checked={termsAgreed}
                  onChange={() => setTermsAgreed(!termsAgreed)}
                />
                <label htmlFor="terms" className="text-sm">
                  I confirm that my listing complies with Zenith's{" "}
                  <Link href="/terms" className="text-purple-700 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/community-guidelines" className="text-purple-700 hover:underline">
                    Community Guidelines
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled={isSubmitting}>
                Save as Draft
              </Button>
              <Button 
                className="bg-purple-700 hover:bg-purple-800" 
                onClick={handleSubmit}
                disabled={isSubmitting || !termsAgreed || images.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  'List Item'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
