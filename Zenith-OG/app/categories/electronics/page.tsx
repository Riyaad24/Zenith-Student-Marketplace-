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
    image: "/laptop-tablet-cover.png",
  },
  {
    id: "headphones",
    title: "Noise-Canceling Headphones",
    description: "Perfect for focusing in noisy environments.",
    image: "/headphone-cover.png",
  },
  {
    id: "calculators",
    title: "Calculators",
    description: "Scientific and graphing calculators for math and engineering courses.",
    image: "/calculator-cover.png",
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
