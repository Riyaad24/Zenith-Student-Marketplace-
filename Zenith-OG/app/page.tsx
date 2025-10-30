"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Laptop, MessageSquare, ShieldCheck, Users, ArrowLeftRight, Calendar } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import StatsCounter from "@/components/stats-counter"
import { useInView } from "react-intersection-observer"

export default function Home() {
  const { user, loading } = useAuth()
  
  // Intersection observers for scroll animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [tradeRentRef, tradeRentInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [howItWorksRef, howItWorksInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.3 })

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
            <div ref={heroRef} className={`lg:col-span-7 space-y-10 text-center lg:text-left z-10 ${heroInView ? 'scroll-reveal' : 'opacity-0'}`}>
              <div className={`space-y-8 ${heroInView ? 'delay-100' : ''}`}>
                <h1 className="text-6xl font-bold tracking-tight sm:text-7xl xl:text-8xl text-gray-900 leading-tight">
                  Zenith
                  <span className="text-purple-600 block">Student <span className="text-purple-700">Marketplace</span></span>
                </h1>
                <p className="max-w-[700px] text-gray-700 text-2xl md:text-3xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  A safe, affordable, and accessible marketplace for South African tertiary students to buy, sell, rent or trade study materials and tutoring services.
                </p>
              </div>
              
              {/* Action buttons with much better presence */}
              <div className={`flex flex-col gap-6 sm:flex-row sm:justify-center lg:justify-start items-center pt-6 ${heroInView ? 'delay-200' : ''}`}>
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
                <Link href="/categories" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-3 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-4 focus:ring-purple-300 px-12 py-6 rounded-2xl font-bold text-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl w-full sm:w-auto"
                    aria-label="Browse products by category"
                  >
                    Categories
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
                  alt="South African tertiary students using Zenith marketplace on laptops and phones"
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

      {/* Stats Section with Animated Counters */}
      <StatsCounter />

      {/* Trade & Rent Section */}
      <section ref={tradeRentRef} className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-purple-50 to-white" role="region" aria-labelledby="trade-rent-heading">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className={`flex flex-col items-center justify-center space-y-4 text-center mb-12 ${tradeRentInView ? 'scroll-reveal' : 'opacity-0'}`}>
            <h2 id="trade-rent-heading" className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900">
              More Than Just Buying & Selling
            </h2>
            <p className="max-w-3xl text-lg md:text-xl text-gray-700 leading-relaxed">
              Exchange items you don't need or rent equipment for short-term use—flexible options for smart students
            </p>
          </div>
          
          <div className={`grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto ${tradeRentInView ? 'scroll-reveal delay-200' : 'opacity-0'}`}>
            {/* Trade Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <ArrowLeftRight className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Trade Items</h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      Exchange textbooks, course materials, and equipment with other students. No money needed—just swap items you no longer use for things you need.
                    </p>
                  </div>
                  <Button 
                    asChild 
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Link href="/browse?listingType=trade">Browse Trade Items</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Rent Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                    <Calendar className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Rent Items</h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                      Need textbooks or equipment for just one semester? Rent them at a fraction of the cost instead of buying. Save money and reduce waste.
                    </p>
                  </div>
                  <Button 
                    asChild 
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Link href="/browse?listingType=rent">Browse Rental Items</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Scaling */}
      <section ref={featuresRef} id="features" className="w-full py-20 md:py-28 lg:py-36 bg-white" role="region" aria-labelledby="features-heading">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className={`flex flex-col items-center justify-center space-y-6 text-center mb-20 ${featuresInView ? 'scroll-reveal' : 'opacity-0'}`}>
            <div className="space-y-6">
              <h2 id="features-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-gray-900">
                Everything You Need in One Place
              </h2>
              <p className="max-w-4xl text-xl md:text-2xl text-gray-700 leading-relaxed">
                Designed specifically for South African tertiary students, our platform makes buying and selling study materials safe, simple, and affordable.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl items-start gap-12 md:gap-16 sm:grid-cols-2 lg:grid-cols-3">
            <div className={`flex flex-col items-center space-y-6 text-center group ${featuresInView ? 'scroll-reveal delay-100' : 'opacity-0'}`}>
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors duration-200">
                <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Textbooks & Study Materials</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Find affordable textbooks, study guides, and course materials from students at tertiary institutions across South Africa.
                </p>
              </div>
            </div>
            <div className={`flex flex-col items-center space-y-6 text-center group ${featuresInView ? 'scroll-reveal delay-200' : 'opacity-0'}`}>
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
            <div className={`flex flex-col items-center space-y-6 text-center group ${featuresInView ? 'scroll-reveal delay-300' : 'opacity-0'}`}>
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
            <div className={`flex flex-col items-center space-y-6 text-center group ${featuresInView ? 'scroll-reveal delay-100' : 'opacity-0'}`}>
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
            <div className={`flex flex-col items-center space-y-6 text-center group ${featuresInView ? 'scroll-reveal delay-200' : 'opacity-0'}`}>
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
            <div className={`flex flex-col items-center space-y-6 text-center group ${featuresInView ? 'scroll-reveal delay-300' : 'opacity-0'}`}>
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
      <section ref={howItWorksRef} className="w-full py-20 md:py-28 lg:py-36 bg-gray-50" role="region" aria-labelledby="how-it-works-heading">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className={`flex flex-col items-center justify-center space-y-6 text-center mb-20 ${howItWorksInView ? 'scroll-reveal' : 'opacity-0'}`}>
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
            <div className={`flex flex-col items-center space-y-6 text-center ${howItWorksInView ? 'scroll-reveal delay-100' : 'opacity-0'}`}>
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-2xl md:text-3xl">
                1
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Sign Up</h3>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Create your free account using your tertiary institution email address for instant verification.
                </p>
              </div>
            </div>
            <div className={`flex flex-col items-center space-y-6 text-center ${howItWorksInView ? 'scroll-reveal delay-200' : 'opacity-0'}`}>
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
            <div className={`flex flex-col items-center space-y-6 text-center ${howItWorksInView ? 'scroll-reveal delay-300' : 'opacity-0'}`}>
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
      <section ref={ctaRef} className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-r from-purple-600 to-purple-800" role="region" aria-labelledby="cta-heading">
        <div className="container px-8 md:px-12 mx-auto max-w-[1400px]">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className={`space-y-6 ${ctaInView ? 'scroll-reveal' : 'opacity-0'}`}>
              <h2 id="cta-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white">Ready to Get Started?</h2>
              <p className="max-w-4xl text-xl md:text-2xl text-purple-100 leading-relaxed">
                Join thousands of South African students already saving money and making connections on Zenith.
              </p>
            </div>
            <div className={`flex flex-col gap-6 md:gap-8 sm:flex-row sm:justify-center items-center max-w-3xl mx-auto ${ctaInView ? 'scroll-reveal delay-200' : 'opacity-0'}`}>
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