import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List, MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Electronics categories data
const electronicsCategories = [
  {
    id: "laptops-tablets",
    title: "Laptops & Tablets",
    description: "Essential for research, assignments, and online learning.",
    image: "/placeholder.svg?height=200&width=300&text=Laptops+Tablets",
    price: 3500,
  },
  {
    id: "headphones",
    title: "Noise-Canceling Headphones",
    description: "Perfect for focusing in noisy environments.",
    image: "/placeholder.svg?height=200&width=300&text=Headphones",
    price: 1200,
  },
  {
    id: "smart-notebooks",
    title: "Smart Notebooks",
    description: "Digital notebooks that sync handwritten notes to the cloud.",
    image: "/placeholder.svg?height=200&width=300&text=Smart+Notebooks",
    price: 850,
  },
  {
    id: "power-banks",
    title: "Portable Chargers & Power Banks",
    description: "Keeps devices charged on the go.",
    image: "/placeholder.svg?height=200&width=300&text=Power+Banks",
    price: 350,
  },
  {
    id: "smartwatches",
    title: "Smartwatches",
    description: "Helps with time management and fitness tracking.",
    image: "/placeholder.svg?height=200&width=300&text=Smartwatches",
    price: 1800,
  },
  {
    id: "storage",
    title: "External Hard Drives & USB Flash Drives",
    description: "Useful for storing and backing up important files.",
    image: "/placeholder.svg?height=200&width=300&text=Storage+Devices",
    price: 650,
  },
  {
    id: "keyboards-mice",
    title: "Wireless Keyboards & Mice",
    description: "Enhances productivity for students working on multiple devices.",
    image: "/placeholder.svg?height=200&width=300&text=Keyboards+Mice",
    price: 750,
  },
  {
    id: "e-readers",
    title: "E-Readers",
    description: "Great for reading textbooks and academic papers without carrying heavy books.",
    image: "/placeholder.svg?height=200&width=300&text=E-Readers",
    price: 1500,
  },
  {
    id: "desk-lamps",
    title: "Desk Lamps with Wireless Charging",
    description: "Combines lighting with convenience.",
    image: "/placeholder.svg?height=200&width=300&text=Desk+Lamps",
    price: 450,
  },
  {
    id: "projectors",
    title: "Mini Projectors",
    description: "Useful for presentations and study sessions.",
    image: "/placeholder.svg?height=200&width=300&text=Mini+Projectors",
    price: 2200,
  },
]

// Mock product data with more variety
const productData = [
  {
    id: "1",
    title: "Calculus Textbook",
    price: 450,
    image: "/placeholder.svg?height=200&width=300&text=Calculus+Textbook",
    condition: "Like New",
    location: "Johannesburg",
    category: "textbooks",
    rating: 4.8,
  },
  {
    id: "2",
    title: "HP Pavilion Laptop",
    price: 3500,
    image: "/placeholder.svg?height=200&width=300&text=HP+Laptop",
    condition: "Good",
    location: "Cape Town",
    category: "electronics",
    rating: 4.5,
  },
  {
    id: "3",
    title: "Economics Notes",
    price: 150,
    image: "/placeholder.svg?height=200&width=300&text=Economics+Notes",
    condition: "Good",
    location: "Durban",
    category: "notes",
    rating: 4.2,
  },
  {
    id: "4",
    title: "Connex Notebook Pro",
    price: 2800,
    image: "/placeholder.svg?height=200&width=300&text=Connex+Laptop",
    condition: "New",
    location: "Pretoria",
    category: "electronics",
    rating: 4.7,
  },
  {
    id: "5",
    title: "Physics Textbook",
    price: 380,
    image: "/placeholder.svg?height=200&width=300&text=Physics+Textbook",
    condition: "Good",
    location: "Port Elizabeth",
    category: "textbooks",
    rating: 4.4,
  },
  {
    id: "6",
    title: "Lenovo ThinkPad",
    price: 4200,
    image: "/placeholder.svg?height=200&width=300&text=Lenovo+Laptop",
    condition: "Like New",
    location: "Johannesburg",
    category: "electronics",
    rating: 4.9,
  },
  {
    id: "7",
    title: "Chemistry Lab Notes",
    price: 120,
    image: "/placeholder.svg?height=200&width=300&text=Chemistry+Notes",
    condition: "Good",
    location: "Cape Town",
    category: "notes",
    rating: 4.3,
  },
  {
    id: "8",
    title: "Dell Inspiron Laptop",
    price: 3800,
    image: "/placeholder.svg?height=200&width=300&text=Dell+Laptop",
    condition: "Good",
    location: "Durban",
    category: "electronics",
    rating: 4.6,
  },
  {
    id: "9",
    title: "Connex Ultrabook",
    price: 3200,
    image: "/placeholder.svg?height=200&width=300&text=Connex+Ultrabook",
    condition: "New",
    location: "Pretoria",
    category: "electronics",
    rating: 4.8,
  },
]

// Generate more products for additional pages
const generateMoreProducts = (page: number, baseProducts: typeof productData) => {
  return baseProducts.map((product) => ({
    ...product,
    id: `${page}-${product.id}`,
    title:
      product.title.includes("Laptop") || product.title.includes("Ultrabook") || product.title.includes("Notebook")
        ? `${product.title} (${page === 2 ? "i5" : page === 3 ? "i7" : page === 4 ? "Ryzen 5" : page === 5 ? "Ryzen 7" : "M1"})`
        : `${product.title} (Edition ${page})`,
    price: Math.round(product.price * (0.9 + page * 0.1)),
  }))
}

export default function BrowsePage({ searchParams }: { searchParams: { page?: string; category?: string } }) {
  // Get current page from URL params or default to 1
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const selectedCategory = searchParams.category || "all"

  // Get products for the current page
  const currentProducts = currentPage === 1 ? productData : generateMoreProducts(currentPage, productData)

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Filters</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="textbooks" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="textbooks" className="text-sm">
                      Textbooks
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="electronics" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="electronics" className="text-sm">
                      Electronics
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="tutoring" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="tutoring" className="text-sm">
                      Tutoring
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notes" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="notes" className="text-sm">
                      Notes & Study Guides
                    </label>
                  </div>
                </div>
              </div>

              {/* Electronics Sub-categories - Only show when Electronics is selected */}
              {selectedCategory === "electronics" && (
                <div className="space-y-2 pl-6 border-l-2 border-purple-200">
                  <h3 className="text-sm font-medium">Electronics Types</h3>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="laptops" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="laptops" className="text-sm">
                        Laptops & Tablets
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="headphones" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="headphones" className="text-sm">
                        Headphones
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="smart-notebooks" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="smart-notebooks" className="text-sm">
                        Smart Notebooks
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="power-banks" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="power-banks" className="text-sm">
                        Power Banks
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="other-electronics" className="h-4 w-4 rounded border-gray-300" />
                      <label htmlFor="other-electronics" className="text-sm">
                        Other Electronics
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Price Range</h3>
                <Slider defaultValue={[0, 1000]} min={0} max={5000} step={100} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">R0</span>
                  <span className="text-sm">R5000</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Condition</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="new" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="new" className="text-sm">
                      New
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="like-new" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="like-new" className="text-sm">
                      Like New
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="good" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="good" className="text-sm">
                      Good
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="fair" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="fair" className="text-sm">
                      Fair
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Location</h3>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="johannesburg">Johannesburg</SelectItem>
                    <SelectItem value="cape-town">Cape Town</SelectItem>
                    <SelectItem value="durban">Durban</SelectItem>
                    <SelectItem value="pretoria">Pretoria</SelectItem>
                    <SelectItem value="port-elizabeth">Port Elizabeth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Seller Rating</h3>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="5-stars" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="5-stars" className="text-sm flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="4-stars" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="4-stars" className="text-sm flex items-center">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <Star className="h-4 w-4 text-gray-300" />
                      <span className="ml-1">& up</span>
                    </label>
                  </div>
                </div>
              </div>
              <Button className="w-full button-hover">Apply Filters</Button>
            </div>
          </div>
        </div>

        {/* Product Listings */}
        <div className="w-full md:w-3/4 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Browse Products</h1>
              <p className="text-sm text-muted-foreground">
                Showing {selectedCategory === "electronics" ? electronicsCategories.length : currentProducts.length} of{" "}
                {selectedCategory === "electronics" ? electronicsCategories.length : 156} products
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial">
                <Select defaultValue="newest">
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="rounded-none rounded-l-md hover-scale">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-none rounded-r-md hover-scale">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
              <TabsTrigger value="electronics">Electronics</TabsTrigger>
              <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Cards */}
                {currentProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover-card">
                    <div className="relative h-48">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{product.location}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.category === "textbooks"
                          ? "Excellent condition textbook for university students."
                          : product.category === "electronics"
                            ? "Great condition, perfect for students. Includes charger and carrying case."
                            : "Comprehensive notes covering all course topics."}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between items-center">
                      <div className="font-bold">R{product.price}</div>
                      <Link href={`/product/${product.id}`}>
                        <Button size="sm" className="button-hover">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link href="/browse">
                  <Button variant={currentPage === 1 ? "default" : "outline"} className="mx-1 hover-scale">
                    1
                  </Button>
                </Link>
                <Link href="/browse?page=2">
                  <Button variant={currentPage === 2 ? "default" : "outline"} className="mx-1 hover-scale">
                    2
                  </Button>
                </Link>
                <Link href="/browse?page=3">
                  <Button variant={currentPage === 3 ? "default" : "outline"} className="mx-1 hover-scale">
                    3
                  </Button>
                </Link>
                <Link href="/browse?page=4">
                  <Button variant={currentPage === 4 ? "default" : "outline"} className="mx-1 hover-scale">
                    4
                  </Button>
                </Link>
                <Link href="/browse?page=5">
                  <Button variant={currentPage === 5 ? "default" : "outline"} className="mx-1 hover-scale">
                    5
                  </Button>
                </Link>
                <Link href="/browse?page=6">
                  <Button variant={currentPage === 6 ? "default" : "outline"} className="mx-1 hover-scale">
                    6
                  </Button>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="textbooks" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts
                  .filter((product) => product.category === "textbooks")
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden hover-card">
                      <div className="relative h-48">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.title}</CardTitle>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="ml-1">{product.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{product.location}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Excellent condition textbook for university students.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center">
                        <div className="font-bold">R{product.price}</div>
                        <Link href={`/product/${product.id}`}>
                          <Button size="sm" className="button-hover">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="electronics" className="mt-0">
              {/* Electronics Categories Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Electronics Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {electronicsCategories.map((category) => (
                    <Card key={category.id} className="overflow-hidden hover-card">
                      <div className="relative h-48">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center">
                        <div className="font-bold">From R{category.price}</div>
                        <Link href={`/browse/electronics/${category.id}`}>
                          <Button size="sm" className="button-hover">
                            Browse Items
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Featured Electronics Products */}
              <h2 className="text-xl font-semibold mb-4">Featured Electronics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts
                  .filter((product) => product.category === "electronics")
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden hover-card">
                      <div className="relative h-48">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.title}</CardTitle>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="ml-1">{product.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{product.location}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Great condition, perfect for students. Includes charger and carrying case.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center">
                        <div className="font-bold">R{product.price}</div>
                        <Link href={`/product/${product.id}`}>
                          <Button size="sm" className="button-hover">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="notes" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts
                  .filter((product) => product.category === "notes")
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden hover-card">
                      <div className="relative h-48">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{product.title}</CardTitle>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="ml-1">{product.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{product.location}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Comprehensive notes covering all course topics.
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center">
                        <div className="font-bold">R{product.price}</div>
                        <Link href={`/product/${product.id}`}>
                          <Button size="sm" className="button-hover">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
