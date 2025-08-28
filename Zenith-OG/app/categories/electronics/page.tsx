import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

// Electronics subcategories data
const electronicsSubcategories = [
  {
    id: "laptops-tablets",
    title: "Laptops & Tablets",
    description: "Essential for research, assignments, and online learning.",
    image: "/placeholder.svg?height=200&width=300&text=Laptops+Tablets",
  },
  {
    id: "headphones",
    title: "Noise-Canceling Headphones",
    description: "Perfect for focusing in noisy environments.",
    image: "/placeholder.svg?height=200&width=300&text=Headphones",
  },
  {
    id: "smart-notebooks",
    title: "Smart Notebooks",
    description: "Digital notebooks that sync handwritten notes to the cloud.",
    image: "/placeholder.svg?height=200&width=300&text=Smart+Notebooks",
  },
  {
    id: "power-banks",
    title: "Portable Chargers & Power Banks",
    description: "Keeps devices charged on the go.",
    image: "/placeholder.svg?height=200&width=300&text=Power+Banks",
  },
  {
    id: "smartwatches",
    title: "Smartwatches",
    description: "Helps with time management and fitness tracking.",
    image: "/placeholder.svg?height=200&width=300&text=Smartwatches",
  },
  {
    id: "storage",
    title: "External Hard Drives & USB Flash Drives",
    description: "Useful for storing and backing up important files.",
    image: "/placeholder.svg?height=200&width=300&text=Storage+Devices",
  },
  {
    id: "keyboards-mice",
    title: "Wireless Keyboards & Mice",
    description: "Enhances productivity for students working on multiple devices.",
    image: "/placeholder.svg?height=200&width=300&text=Keyboards+Mice",
  },
  {
    id: "e-readers",
    title: "E-Readers",
    description: "Great for reading textbooks and academic papers without carrying heavy books.",
    image: "/placeholder.svg?height=200&width=300&text=E-Readers",
  },
  {
    id: "desk-lamps",
    title: "Desk Lamps with Wireless Charging",
    description: "Combines lighting with convenience.",
    image: "/placeholder.svg?height=200&width=300&text=Desk+Lamps",
  },
  {
    id: "projectors",
    title: "Mini Projectors",
    description: "Useful for presentations and study sessions.",
    image: "/placeholder.svg?height=200&width=300&text=Mini+Projectors",
  },
]

export default function ElectronicsPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Electronics</h1>
        <p className="text-muted-foreground max-w-2xl">
          Find affordable and quality electronics to enhance your academic journey. From essential devices for studying
          to tools that make student life easier.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {electronicsSubcategories.map((subcategory) => (
          <Card key={subcategory.id} className="overflow-hidden hover-card">
            <div className="relative h-48">
              <Image
                src={subcategory.image || "/placeholder.svg"}
                alt={subcategory.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{subcategory.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{subcategory.description}</p>
            </CardContent>
            <CardFooter className="p-4">
              <Link href={`/categories/electronics/${subcategory.id}`} className="w-full">
                <Button className="w-full bg-purple-700 hover:bg-purple-800 button-hover">Browse Products</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Sell Your Electronics</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Upgrade your tech? Sell your gently used electronics to fellow students who can put them to good use.
        </p>
        <Link href="/sell">
          <Button size="lg" className="bg-purple-700 hover:bg-purple-800 button-hover">
            List Your Electronics
          </Button>
        </Link>
      </div>
    </div>
  )
}
