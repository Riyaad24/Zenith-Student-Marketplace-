import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, MapPin, MessageSquare, Share2, ShieldCheck, Star, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProductPage({ params }: { params: { id: string } }) {
  // This would normally fetch product data based on the ID
  const product = {
    id: params.id,
    title: "Calculus: Early Transcendentals (8th Edition)",
    price: 450,
    condition: "Like New",
    description:
      "Excellent condition calculus textbook for first-year engineering students. Barely used, no highlights or notes. This is the 8th edition by James Stewart, covering single variable and multivariable calculus.",
    location: "University of Cape Town",
    listedDate: "2 days ago",
    category: "Textbooks",
    seller: {
      name: "Michael S.",
      rating: 4.8,
      joinedDate: "March 2023",
      verified: true,
    },
    images: [
      "/placeholder.svg?height=500&width=500&text=Textbook+Front",
      "/placeholder.svg?height=500&width=500&text=Textbook+Back",
      "/placeholder.svg?height=500&width=500&text=Textbook+Pages",
    ],
    features: [
      "Hardcover in excellent condition",
      "No highlighting or notes",
      "Includes online access code (unused)",
      "8th Edition by James Stewart",
      "ISBN: 978-1285741550",
    ],
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image src={product.images[0] || "/placeholder.svg"} alt={product.title} fill className="object-contain" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="relative h-24 rounded-lg overflow-hidden border">
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
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{product.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{product.listedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">R{product.price}</div>
            <div className="text-sm px-2 py-1 bg-purple-100 text-purple-800 rounded-full">{product.condition}</div>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-purple-700 hover:bg-purple-800">Contact Seller</Button>
            <Button variant="outline" className="w-full">
              Add to Wishlist
            </Button>
            <Button variant="ghost" className="w-full flex items-center justify-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
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
                      {product.seller.rating} • Joined {product.seller.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
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
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="features" className="mt-4">
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Reviews Yet</h3>
              <p className="text-muted-foreground">Be the first to review this product</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Similar Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Link href={`/product/${i + 1}`} key={i}>
              <Card className="overflow-hidden h-full">
                <div className="relative h-40">
                  <Image
                    src={`/placeholder.svg?height=200&width=300&text=Similar+${i + 1}`}
                    alt={`Similar Product ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-1">
                    {i % 2 === 0 ? "Physics Textbook (10th Edition)" : "Linear Algebra Notes"}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold">R{(i + 2) * 100 + 50}</div>
                    <div className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                      {i % 2 === 0 ? "Good" : "Like New"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
