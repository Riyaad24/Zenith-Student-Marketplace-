"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Laptop, MessageSquare, ShieldCheck, Users } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Better Space Utilization */}
      <section className="relative w-full min-h-[95vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100" role="banner">        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-purple-400/15 rounded-full blur-md"></div>
        
        <div className="relative container px-8 md:px-12 mx-auto max-w-[1400px] w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[80vh]">
            {/* Content Section - Much Larger and Better Spaced */}
            <div className="lg:col-span-7 space-y-10 text-center lg:text-left z-10">
              <div className="space-y-8">
                <h1 className="text-6xl font-bold tracking-tight sm:text-7xl xl:text-8xl text-gray-900 leading-tight">
                  Zenith
                  <span className="text-purple-600 block">Student <span className="text-purple-700">Marketplace</span></span>
                </h1>
                <p className="max-w-[700px] text-gray-700 text-2xl md:text-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  A safe, affordable, and accessible marketplace for Richfield Graduate Institute students to buy, sell, rent or trade study materials and tutoring services.
                </p>
              </div>
              
              {/* Action buttons with much better presence */}
              <div className="flex flex-col gap-6 sm:flex-row sm:justify-center lg:justify-start items-center pt-6">
                {!loading && !user && (
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl w-full sm:w-auto"
                      aria-label="Create your account to start buying and selling"
                    >
                      Create Account
                    </Button>
                  </Link>
                )}
                <Link href="/browse" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-3 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-4 focus:ring-purple-300 px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl w-full sm:w-auto"
                    aria-label="Browse available products and services"
                  >
                    Browse Products
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators with much more prominence */}
              <div className="flex flex-col sm:flex-row gap-10 items-center justify-center lg:justify-start text-lg text-gray-600 pt-8">
                <div className="flex items-center gap-4">
                  <ShieldCheck className="h-8 w-8 text-purple-600" />
                  <span className="font-bold text-xl">Verified Students Only</span>
                </div>
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-purple-600" />
                  <span className="font-bold text-xl">10,000+ Active Students</span>
                </div>
              </div>
            </div>
            
            {/* Image Section - Fully integrated without box */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full">
                {/* Remove the white box and integrate directly */}
                <Image
                  src="/homepage-hero.png"
                  alt="South African students using Zenith marketplace on laptops and phones"
                  width={700}
                  height={500}
                  className="w-full h-auto object-cover opacity-90 mix-blend-multiply transform hover:scale-[1.02] transition-all duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='500' fill='%23e5e7eb'%3E%3Crect width='700' height='500' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='0.35em' font-family='Arial, sans-serif' font-size='18' fill='%236b7280'%3EStudent Marketplace%3C/text%3E%3C/svg%3E"
                  }}
                  priority
                />
                
                {/* Overlay gradient for better integration */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-50/10 to-purple-100/20 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Much Better Scaling */}
      <section className="w-full py-20 md:py-28 bg-white">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 text-center">
            <div className="space-y-4">
              <div className="text-5xl md:text-7xl font-bold text-purple-600">10K+</div>
              <div className="text-xl md:text-2xl text-gray-600 font-bold">Active Students</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl md:text-7xl font-bold text-purple-600">25K+</div>
              <div className="text-xl md:text-2xl text-gray-600 font-bold">Items Sold</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl md:text-7xl font-bold text-purple-600">15</div>
              <div className="text-xl md:text-2xl text-gray-600 font-bold">Universities</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl md:text-7xl font-bold text-purple-600">R2M+</div>
              <div className="text-xl md:text-2xl text-gray-600 font-bold">Money Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Scaling */}
      <section id="features" className="w-full py-20 md:py-28 lg:py-36 bg-white" role="region" aria-labelledby="features-heading">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20">
            <div className="space-y-6">
              <h2 id="features-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-gray-900">
                Everything You Need in One Place
              </h2>
              <p className="max-w-4xl text-xl md:text-2xl text-gray-700 leading-relaxed">
                Designed specifically for South African students, our platform makes buying and selling study materials safe, simple, and affordable.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl items-start gap-12 md:gap-16 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Textbooks & Study Materials</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Find affordable textbooks, study guides, and course materials from students at your university.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                <Laptop className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Electronics & Tech</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Buy and sell laptops, tablets, calculators, and other tech essentials for your studies.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Tutoring Services</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Connect with experienced students and tutors for personalized academic support.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Safe & Secure</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Verified student accounts and secure payment options ensure safe transactions.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                <Users className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Student Community</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Join a vibrant community of students across South African universities and colleges.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 text-center group">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                <svg className="h-10 w-10 md:h-12 md:w-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Affordable Prices</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Save money with student-friendly prices and flexible payment options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Enhanced Scaling */}
      <section className="w-full py-20 md:py-28 lg:py-36 bg-gray-50" role="region" aria-labelledby="how-it-works-heading">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20">
            <div className="space-y-6">
              <h2 id="how-it-works-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-gray-900">
                How Zenith Works
              </h2>
              <p className="max-w-4xl text-xl md:text-2xl text-gray-700 leading-relaxed">
                Getting started on Zenith is simple. Follow these easy steps to begin buying and selling.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl items-start gap-12 md:gap-16 sm:grid-cols-1 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-2xl md:text-3xl">
                1
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Sign Up</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Create your free account using your university email address for instant verification.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-2xl md:text-3xl">
                2
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">List or Browse</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Post items you want to sell or browse through hundreds of listings from fellow students.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-2xl md:text-3xl">
                3
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Connect & Trade</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Message sellers directly, arrange meetups, and complete secure transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section with Enhanced Scaling */}
      <section className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-r from-purple-600 to-purple-800" role="region" aria-labelledby="cta-heading">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-6">
              <h2 id="cta-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white">Ready to Get Started?</h2>
              <p className="max-w-4xl text-xl md:text-2xl text-purple-100 leading-relaxed">
                Join thousands of South African students already saving money and making connections on Zenith.
              </p>
            </div>
            <div className="flex flex-col gap-6 md:gap-8 sm:flex-row sm:justify-center items-center max-w-3xl mx-auto">
              {!loading && !user && (
                <Link href="/register" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="bg-white text-purple-700 hover:bg-gray-100 focus:ring-4 focus:ring-white/30 button-hover font-semibold px-12 py-6 rounded-xl text-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[200px]"
                    aria-label="Create your account to join Zenith Student Marketplace"
                  >
                    Create Account
                  </Button>
                </Link>
              )}
              <Link href="/about" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-3 border-white text-white hover:bg-white hover:text-purple-700 focus:ring-4 focus:ring-white/30 button-hover font-semibold px-12 py-6 rounded-xl text-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[200px]"
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