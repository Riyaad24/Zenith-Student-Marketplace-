"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function SellPage() {
  const [images, setImages] = useState<string[]>([])
  const [contactPreferences, setContactPreferences] = useState({
    zenithMessages: true,
    email: false,
    phone: false,
  })
  const [termsAgreed, setTermsAgreed] = useState(false)

  // This would normally handle file uploads
  const handleImageUpload = () => {
    // Simulate adding a placeholder image
    setImages([...images, `/placeholder.svg?height=200&width=200&text=Image+${images.length + 1}`])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleContactPreferenceChange = (preference: keyof typeof contactPreferences) => {
    setContactPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }))
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">List an Item for Sale</h1>

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
                <Input id="title" placeholder="e.g., Calculus Textbook 8th Edition" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
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
                  <Select>
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
                />
              </div>
            </CardContent>
          </Card>

          {/* Price and Location */}
          <Card>
            <CardHeader>
              <CardTitle>Price and Location</CardTitle>
              <CardDescription>Set your price and specify your location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (ZAR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">R</span>
                    <Input id="price" type="number" className="pl-7" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negotiable">Price Type</Label>
                  <Select>
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
                  <Select>
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
                  <Input id="campus" placeholder="e.g., UCT Main Campus" />
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    onClick={handleImageUpload}
                    className="aspect-square border border-dashed rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors"
                  >
                    <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Add Image</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

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
              <Button variant="outline">Save as Draft</Button>
              <Button className="bg-purple-700 hover:bg-purple-800">List Item</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
