import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Laptop, MessageSquare, ShieldCheck, Users } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white to-purple-50" role="banner">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center min-h-[600px]">
            {/* Content Section */}
            <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-gray-900 leading-tight">
                  Zenith Student 
                  <span className="text-purple-600 block lg:inline lg:ml-3">Marketplace</span>
                </h1>
                <p className="max-w-[600px] text-gray-700 text-lg md:text-xl mx-auto lg:mx-0 leading-relaxed">
                  A safe, affordable, and accessible marketplace for university and college students in South Africa to buy, sell, rent or trade study materials and tutoring services.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start items-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl w-full sm:w-auto"
                    aria-label="Create your account to start buying and selling"
                  >
                    Create Account
                  </Button>
                </Link>
                <Link href="/browse" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-4 focus:ring-purple-300 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg w-full sm:w-auto"
                    aria-label="Browse available products and services"
                  >
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Image Section */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-lg lg:max-w-2xl">
                <Image
                  src="/homepage-hero.png"
                  alt="Four diverse college students standing together in front of a university building with purple accents, representing the inclusive and academic-focused community of Zenith Student Marketplace"
                  width={600}
                  height={450}
                  priority
                  className="w-full h-auto object-contain drop-shadow-lg"
                  style={{
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                  loading="eager"
                />
                {/* Decorative background circle */}
                <div 
                  className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-purple-100 to-purple-200 rounded-full opacity-20"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Student Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>South Africa Wide</span>
              </div>
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
            <div className="flex flex-col items-center space-y-4 border border-gray-200 p-6 rounded-xl hover-card focus-within:ring-2 focus-within:ring-purple-300 transition-all duration-200">
              <div className="p-3 bg-purple-100 rounded-full hover-scale">
                <BookOpen className="h-7 w-7 text-purple-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Study Materials</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Buy, sell, or trade textbooks, notes, and other study materials at affordable prices.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 border border-gray-200 p-6 rounded-xl hover-card focus-within:ring-2 focus-within:ring-purple-300 transition-all duration-200">
              <div className="p-3 bg-purple-100 rounded-full hover-scale">
                <Laptop className="h-7 w-7 text-purple-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Electronics & Gadgets</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Find affordable laptops, calculators, and other electronics needed for your studies.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 border border-gray-200 p-6 rounded-xl hover-card focus-within:ring-2 focus-within:ring-purple-300 transition-all duration-200">
              <div className="p-3 bg-purple-100 rounded-full hover-scale">
                <Users className="h-7 w-7 text-purple-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tutoring Services</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Connect with tutors or offer your expertise to help fellow students excel.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 border border-gray-200 p-6 rounded-xl hover-card focus-within:ring-2 focus-within:ring-purple-300 transition-all duration-200">
              <div className="p-3 bg-purple-100 rounded-full hover-scale">
                <ShieldCheck className="h-7 w-7 text-purple-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Secure Escrow System</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Our escrow system holds payment until the buyer confirms receipt of the product.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 border border-gray-200 p-6 rounded-xl hover-card focus-within:ring-2 focus-within:ring-purple-300 transition-all duration-200">
              <div className="p-3 bg-purple-100 rounded-full hover-scale">
                <MessageSquare className="h-7 w-7 text-purple-700" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Message Center</h3>
              <p className="text-center text-gray-600 leading-relaxed">
                Communicate securely with buyers and sellers through our built-in messaging system.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 border border-gray-200 p-6 rounded-xl hover-card focus-within:ring-2 focus-within:ring-purple-300 transition-all duration-200">
              <div className="p-3 bg-purple-100 rounded-full hover-scale">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 text-purple-700"
                  aria-hidden="true"
                >
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Location-Based Search</h3>
              <p className="text-center text-gray-600 leading-relaxed">
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
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100 focus:ring-4 focus:ring-white/30 button-hover font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg w-full sm:w-auto"
                  aria-label="Create your account to join Zenith Student Marketplace"
                >
                  Create Account
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-700 focus:ring-4 focus:ring-white/30 button-hover font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg w-full sm:w-auto"
                  aria-label="Learn more about our platform and services"
                >
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
