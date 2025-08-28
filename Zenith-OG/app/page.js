import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Laptop, MessageSquare, ShieldCheck, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Zenith Student Marketplace
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                A safe, affordable, and accessible marketplace for university and college students in South Africa to
                buy, sell, rent or trade study materials and tutoring services.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 button-hover">
                    Join Now
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 button-hover">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[350px] lg:h-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Students using Zenith marketplace"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Designed specifically for South African students with features that make buying and selling educational
                resources easy and secure.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg hover-card">
              <div className="p-2 bg-purple-100 rounded-full hover-scale">
                <BookOpen className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold">Study Materials</h3>
              <p className="text-center text-gray-500">
                Buy, sell, or trade textbooks, notes, and other study materials at affordable prices.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg hover-card">
              <div className="p-2 bg-purple-100 rounded-full hover-scale">
                <Laptop className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold">Electronics & Gadgets</h3>
              <p className="text-center text-gray-500">
                Find affordable laptops, calculators, and other electronics needed for your studies.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg hover-card">
              <div className="p-2 bg-purple-100 rounded-full hover-scale">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold">Tutoring Services</h3>
              <p className="text-center text-gray-500">
                Connect with tutors or offer your expertise to help fellow students excel.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg hover-card">
              <div className="p-2 bg-purple-100 rounded-full hover-scale">
                <ShieldCheck className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold">Secure Escrow System</h3>
              <p className="text-center text-gray-500">
                Our escrow system holds payment until the buyer confirms receipt of the product.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg hover-card">
              <div className="p-2 bg-purple-100 rounded-full hover-scale">
                <MessageSquare className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold">Message Center</h3>
              <p className="text-center text-gray-500">
                Communicate securely with buyers and sellers through our built-in messaging system.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg hover-card">
              <div className="p-2 bg-purple-100 rounded-full hover-scale">
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
                  className="h-6 w-6 text-purple-700"
                >
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Location-Based Search</h3>
              <p className="text-center text-gray-500">
                Find products and services near your campus or city for convenient exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple steps to start buying and selling on Zenith Student Marketplace.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-700 text-white font-bold text-xl hover-scale">
                1
              </div>
              <h3 className="text-xl font-bold">Create an Account</h3>
              <p className="text-center text-gray-500">
                Sign up with your student email to verify your status as a student.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-700 text-white font-bold text-xl hover-scale">
                2
              </div>
              <h3 className="text-xl font-bold">Browse or List Products</h3>
              <p className="text-center text-gray-500">
                Search for what you need or list items you want to sell or rent out.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-700 text-white font-bold text-xl hover-scale">
                3
              </div>
              <h3 className="text-xl font-bold">Secure Transactions</h3>
              <p className="text-center text-gray-500">
                Use our secure payment system and escrow service for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-700 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of South African students already saving money and making connections on Zenith.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 button-hover">
                  Create Account
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 button-hover">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
