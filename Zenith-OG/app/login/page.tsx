"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn } from "@/app/actions/auth"
import Link from "next/link"
import Image from "next/image"
import { InlineLoader } from "@/components/ui/loader"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    const result = await signIn(formData)

    if (result?.error) {
      setMessage({ type: "error", text: result.error })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Text and Background Image */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-white">
        {/* Welcome Text Section */}
        <div className="px-12 pt-12 pb-8 text-gray-800 z-10">
          <h1 className="text-4xl font-bold mb-4">Welcome Back to Zenith</h1>     
          <p className="text-xl mb-8">Your student marketplace for textbooks, notes, electronics, and tutoring</p>
          <div className="space-y-3 text-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
              <span>Buy and sell textbooks</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
              <span>Share study notes</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
              <span>Find tutoring services</span>
            </div>
          </div>
        </div>
        
        {/* Background Image Section */}
        <div className="flex-1 relative">
          <Image
            src="/study-students-bg.png"
            alt="Students studying and collaborating"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-3xl font-bold text-gray-900">Sign In</CardTitle>
            <p className="text-center text-sm text-gray-600">Welcome back to Zenith Marketplace</p>
          </CardHeader>
          <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg text-sm font-medium ${
                  message.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-100"
                    : "bg-green-50 text-green-700 border border-green-100"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {loading ? <InlineLoader text="Signing In..." /> : "Sign In"}
            </Button>
          </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
                  Create account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}