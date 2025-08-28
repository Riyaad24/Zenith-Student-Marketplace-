"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Upload, User } from "lucide-react"
import Link from "next/link"

export default function BecomeTutorPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    institution: "",
    modules: [] as string[],
    qualification: "",
    hourlyRate: "",
    bio: "",
    studentCardUploaded: false,
    transcriptUploaded: false,
  })

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the form data to the server
    setCurrentStep(4) // Move to success step
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Become a Tutor</h1>
          <p className="text-muted-foreground">
            Share your knowledge, help fellow students, and earn money as a verified tutor.
          </p>
        </div>

        <div className="mb-8">
          <Tabs value={`step-${currentStep}`} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="step-1" disabled>
                1. Create Account
              </TabsTrigger>
              <TabsTrigger value="step-2" disabled>
                2. Build Profile
              </TabsTrigger>
              <TabsTrigger value="step-3" disabled>
                3. Verification
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Create Your Account"}
              {currentStep === 2 && "Build Your Tutor Profile"}
              {currentStep === 3 && "Verification"}
              {currentStep === 4 && "Application Submitted"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Please provide your details to create an account"}
              {currentStep === 2 && "Tell us about your tutoring expertise"}
              {currentStep === 3 && "Upload documents to verify your student status"}
              {currentStep === 4 && "Your application has been submitted for review"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@myunisa.ac.za"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be a valid student email (e.g., @myunisa.ac.za, @dut.ac.za)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="h-4 w-4 rounded border-gray-300" />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-700 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-700 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </form>
            )}

            {currentStep === 2 && (
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-picture">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                    <Button variant="outline" type="button">
                      Upload Photo
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Select
                    value={formData.institution}
                    onValueChange={(value) => handleInputChange("institution", value)}
                  >
                    <SelectTrigger id="institution">
                      <SelectValue placeholder="Select your institution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uct">University of Cape Town</SelectItem>
                      <SelectItem value="wits">University of the Witwatersrand</SelectItem>
                      <SelectItem value="up">University of Pretoria</SelectItem>
                      <SelectItem value="ukzn">University of KwaZulu-Natal</SelectItem>
                      <SelectItem value="su">Stellenbosch University</SelectItem>
                      <SelectItem value="ru">Rhodes University</SelectItem>
                      <SelectItem value="uj">University of Johannesburg</SelectItem>
                      <SelectItem value="unisa">UNISA</SelectItem>
                      <SelectItem value="dut">Durban University of Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modules">Modules You Tutor</Label>
                  <Input
                    id="modules"
                    placeholder="e.g., MATH151, PHY101 (comma separated)"
                    onChange={(e) =>
                      handleInputChange(
                        "modules",
                        e.target.value.split(",").map((m) => m.trim()),
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground">Enter module codes separated by commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    placeholder="e.g., 2nd Year BSc Computer Science"
                    value={formData.qualification}
                    onChange={(e) => handleInputChange("qualification", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourly-rate">Hourly Rate (ZAR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">R</span>
                    <Input
                      id="hourly-rate"
                      type="number"
                      className="pl-7"
                      placeholder="0"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio/Experience</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell students about your tutoring experience, teaching style, and areas of expertise (max 300 words)"
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Maximum 300 words</p>
                </div>
              </form>
            )}

            {currentStep === 3 && (
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label>Student Card / Proof of Enrollment</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a clear photo of your student card or proof of enrollment
                    </p>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleInputChange("studentCardUploaded", true)}
                    >
                      {formData.studentCardUploaded ? "Uploaded ✓" : "Upload Document"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Required for verification</p>
                </div>

                <div className="space-y-2">
                  <Label>Academic Transcript (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your academic transcript to boost your credibility
                    </p>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleInputChange("transcriptUploaded", true)}
                    >
                      {formData.transcriptUploaded ? "Uploaded ✓" : "Upload Document"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Optional but recommended</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> Our admin team will review your application and verify your documents. Once
                    approved, you'll receive a "Verified Tutor" badge on your profile.
                  </p>
                </div>
              </form>
            )}

            {currentStep === 4 && (
              <div className="text-center py-6">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for applying to become a tutor. Our team will review your application and verify your
                  documents within 1-2 business days.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg text-left mb-6">
                  <h4 className="font-medium mb-2">What happens next?</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>We'll review your application and verify your documents</li>
                    <li>You'll receive an email notification once your profile is approved</li>
                    <li>Your tutor profile will be published on the marketplace</li>
                    <li>You can start accepting tutoring requests and earning</li>
                  </ul>
                </div>
                <Link href="/dashboard">
                  <Button className="bg-purple-700 hover:bg-purple-800">Go to Dashboard</Button>
                </Link>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep < 4 && (
              <>
                <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
                  Back
                </Button>
                {currentStep < 3 ? (
                  <Button className="bg-purple-700 hover:bg-purple-800" onClick={handleNextStep}>
                    Continue
                  </Button>
                ) : (
                  <Button className="bg-purple-700 hover:bg-purple-800" onClick={handleSubmit}>
                    Submit Application
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>

        {currentStep < 4 && (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Benefits of becoming a tutor</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Earn money while helping fellow students succeed</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Flexible hours that work around your own study schedule</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Enhance your CV with verified teaching experience</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <span>Secure payments through our escrow system</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
