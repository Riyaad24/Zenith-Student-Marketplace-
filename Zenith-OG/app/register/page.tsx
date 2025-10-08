"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signUp } from "@/app/actions/auth"
import Link from "next/link"
import Image from "next/image"
import { InlineLoader } from "@/components/ui/loader"

const universities = [
  "University of Cape Town",
  "University of the Witwatersrand",
  "Stellenbosch University",
  "University of Pretoria",
  "University of KwaZulu-Natal",
  "University of Johannesburg",
  "Rhodes University",
  "North-West University",
  "University of the Free State",
  "University of the Western Cape",
  "Nelson Mandela University",
  "University of South Africa (UNISA)",
  "Tshwane University of Technology",
  "Cape Peninsula University of Technology",
  "Durban University of Technology",
  "Central University of Technology",
  "Vaal University of Technology",
  "Mangosuthu University of Technology",
  "Richfield Graduate Institute of Technology",
  "Eduvos",
  "Boston City Campus",
  "Damelin",
  "Rosebank College",
  "Varsity College",
  "The Independent Institute of Education (IIE)",
  "Monash South Africa",
  "University of Fort Hare",
  "Walter Sisulu University",
  "University of Limpopo",
  "University of Zululand",
  "Sol Plaatje University",
  "University of Mpumalanga",
]

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    const result = await signUp(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else if (result.success) {
      setMessage({ type: "success", text: result.message || "Account created successfully!" })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Image Section - Left Side */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="w-full max-w-2xl">
              <img
                src="/register-hero.png"
                alt="Three diverse students standing in front of university building - perfect illustration for student registration"
                className="w-full h-auto max-w-full"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            </div>
          </div>
          
          {/* Registration Form - Right Side */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
          <p className="text-center text-sm text-gray-600">Join the Zenith Marketplace</p>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University/College
              </label>
              <select
                id="university"
                name="university"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your institution</option>
                {universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">
                Student Number
              </label>
              <input
                id="studentNumber"
                name="studentNumber"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <InlineLoader text="Creating Account..." /> : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
  )
}
