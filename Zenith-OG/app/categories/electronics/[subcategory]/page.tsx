import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Electronics subcategories data with sample products
const electronicsSubcategories = {
  "laptops-tablets": {
    title: "Laptops & Tablets",
    description: "Essential for research, assignments, and online learning.",
    products: [
      {
        id: "1",
        title: "HP Pavilion 15",
        price: 4500,
        image: "/placeholder.svg?height=200&width=300&text=HP+Pavilion",
        condition: "Like New",
        location: "Johannesburg",
        rating: 4.8,
      },
      {
        id: "2",
        title: "MacBook Air M1",
        price: 12000,
        image: "/placeholder.svg?height=200&width=300&text=MacBook+Air",
        condition: "New",
        location: "Cape Town",
        rating: 4.9,
      },
      {
        id: "3",
        title: "Samsung Galaxy Tab S7",
        price: 7500,
        image: "/placeholder.svg?height=200&width=300&text=Galaxy+Tab",
        condition: "Good",
        location: "Durban",
        rating: 4.6,
      },
      {
        id: "4",
        title: "Lenovo ThinkPad X1",
        price: 8500,
        image: "/placeholder.svg?height=200&width=300&text=ThinkPad",
        condition: "Like New",
        location: "Pretoria",
        rating: 4.7,
      },
    ],
  },
  headphones: {
    title: "Noise-Canceling Headphones",
    description: "Perfect for focusing in noisy environments.",
    products: [
      {
        id: "1",
        title: "Sony WH-1000XM4",
        price: 3500,
        image: "/placeholder.svg?height=200&width=300&text=Sony+Headphones",
        condition: "Like New",
        location: "Johannesburg",
        rating: 4.9,
      },
      {
        id: "2",
        title: "Bose QuietComfort 45",
        price: 4200,
        image: "/placeholder.svg?height=200&width=300&text=Bose+Headphones",
        condition: "New",
        location: "Cape Town",
        rating: 4.8,
      },
    ],
  },
  "smart-notebooks": {
    title: "Smart Notebooks",
    description: "Digital notebooks that sync handwritten notes to the cloud.",
    products: [
      {
        id: "1",
        title: "Rocketbook Smart Notebook",
        price: 450,
        image: "/placeholder.svg?height=200&width=300&text=Rocketbook",
        condition: "New",
        location: "Johannesburg",
        rating: 4.7,
      },
    ],
  },
  "power-banks": {
    title: "Portable Chargers & Power Banks",
    description: "Keeps devices charged on the go.",
    products: [
      {
        id: "1",
        title: "Anker PowerCore 20000mAh",
        price: 650,
        image: "/placeholder.svg?height=200&width=300&text=Anker",
        condition: "New",
        location: "Cape Town",
        rating: 4.8,
      },
    ],
  },
  smartwatches: {
    title: "Smartwatches",
    description: "Helps with time management and fitness tracking.",
    products: [
      {
        id: "1",
        title: "Apple Watch SE",
        price: 4500,
        image: "/placeholder.svg?height=200&width=300&text=Apple+Watch",
        condition: "Like New",
        location: "Johannesburg",
        rating: 4.9,
      },
    ],
  },
  storage: {
    title: "External Hard Drives & USB Flash Drives",
    description: "Useful for storing and backing up important files.",
    products: [
      {
        id: "1",
        title: "WD 2TB External Hard Drive",
        price: 1200,
        image: "/placeholder.svg?height=200&width=300&text=WD+Drive",
        condition: "New",
        location: "Pretoria",
        rating: 4.8,
      },
    ],
  },
  "keyboards-mice": {
    title: "Wireless Keyboards & Mice",
    description: "Enhances productivity for students working on multiple devices.",
    products: [
      {
        id: "1",
        title: "Logitech MX Keys & MX Master 3",
        price: 2200,
        image: "/placeholder.svg?height=200&width=300&text=Logitech+MX",
        condition: "Like New",
        location: "Cape Town",
        rating: 4.9,
      },
    ],
  },
  "e-readers": {
    title: "E-Readers",
    description: "Great for reading textbooks and academic papers without carrying heavy books.",
    products: [
      {
        id: "1",
        title: "Kindle Paperwhite",
        price: 2200,
        image: "/placeholder.svg?height=200&width=300&text=Kindle",
        condition: "Like New",
        location: "Johannesburg",
        rating: 4.8,
      },
    ],
  },
  "desk-lamps": {
    title: "Desk Lamps with Wireless Charging",
    description: "Combines lighting with convenience.",
    products: [
      {
        id: "1",
        title: "TaoTronics LED Desk Lamp with Qi Charging",
        price: 650,
        image: "/placeholder.svg?height=200&width=300&text=TaoTronics",
        condition: "New",
        location: "Cape Town",
        rating: 4.6,
      },
    ],
  },
  projectors: {
    title: "Mini Projectors",
    description: "Useful for presentations and study sessions.",
    products: [
      {
        id: "1",
        title: "Anker Nebula Capsule",
        price: 5500,
        image: "/placeholder.svg?height=200&width=300&text=Nebula",
        condition: "Like New",
        location: "Johannesburg",
        rating: 4.7,
      },
    ],
  },
}

export default function ElectronicsSubcategoryPage({ params }: { params: { subcategory: string } }) {
  const subcategoryId = params.subcategory
  const subcategory = electronicsSubcategories[subcategoryId as keyof typeof electronicsSubcategories]

  if (!subcategory) {
    return (
      <div className="container px-4 md:px-6 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-6">Sorry, the category you're looking for doesn't exist.</p>
        <Link href="/categories/electronics">
          <Button className="bg-purple-700 hover:bg-purple-800">Back to Electronics</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/categories/electronics" className="text-purple-700 hover:underline mb-2 inline-block">
          ← Back to Electronics
        </Link>
        <h1 className="text-3xl font-bold mt-2">{subcategory.title}</h1>
        <p className="text-muted-foreground max-w-2xl">{subcategory.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategory.products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover-card">
            <div className="relative h-48">
              <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
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
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  {product.condition}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center">
              <div className="font-bold">R{product.price}</div>
              <Link href={`/product/electronics-${subcategoryId}-${product.id}`}>
                <Button size="sm" className="bg-purple-700 hover:bg-purple-800 button-hover">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {subcategory.products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found in this category.</p>
          <Link href="/sell">
            <Button className="bg-purple-700 hover:bg-purple-800">Be the first to sell in this category</Button>
          </Link>
        </div>
      )}

      <div className="mt-12 bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Looking for Something Specific?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Create a wanted listing to let other students know what you need.
        </p>
        <Link href="/wanted">
          <Button size="lg" className="bg-purple-700 hover:bg-purple-800 button-hover">
            Create Wanted Listing
          </Button>
        </Link>
      </div>
    </div>
  )
}
