import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Laptop, MessageSquare, StickyNoteIcon as Notes } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Main categories data
const categories = [
  {
    id: "textbooks",
    title: "Textbooks",
    description: "New and used textbooks for all courses",
    icon: BookOpen,
    image: "/placeholder.svg?height=300&width=400&text=Textbooks",
  },
  {
    id: "electronics",
    title: "Electronics",
    description: "Laptops, calculators, and other devices",
    icon: Laptop,
    image: "/placeholder.svg?height=300&width=400&text=Electronics",
  },
  {
    id: "tutoring",
    title: "Tutoring",
    description: "Find tutors or offer your services",
    icon: MessageSquare,
    image: "/placeholder.svg?height=300&width=400&text=Tutoring",
  },
  {
    id: "notes",
    title: "Notes & Study Guides",
    description: "Class notes, study guides, and past papers",
    icon: Notes,
    image: "/placeholder.svg?height=300&width=400&text=Notes",
  },
]

export default function CategoriesPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse through our categories to find exactly what you need for your academic journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden hover-card">
            <div className="relative h-48">
              <Image src={category.image || "/placeholder.svg"} alt={category.title} fill className="object-cover" />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-purple-700" />
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-muted-foreground">{category.description}</p>
            </CardContent>
            <CardFooter className="p-4">
              <Link href={`/categories/${category.id}`} className="w-full">
                <Button className="w-full bg-purple-700 hover:bg-purple-800 button-hover">Browse Category</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Use our search feature to find specific items or create a wanted listing to let other students know what you
          need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search">
            <Button size="lg" className="bg-purple-700 hover:bg-purple-800 button-hover">
              Search Products
            </Button>
          </Link>
          <Link href="/wanted">
            <Button size="lg" variant="outline" className="button-hover">
              Create Wanted Listing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
