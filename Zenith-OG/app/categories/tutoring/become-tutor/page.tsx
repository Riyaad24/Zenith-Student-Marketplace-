"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Upload, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { INSTITUTION_OPTIONS } from "@/lib/institutions"

export default function BecomeTutorPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [proofOfRegistration, setProofOfRegistration] = useState<File | null>(null)
  const [transcript, setTranscript] = useState<File | null>(null)
  const profilePictureInputRef = useRef<HTMLInputElement>(null)
  const proofInputRef = useRef<HTMLInputElement>(null)
  const transcriptInputRef = useRef<HTMLInputElement>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  
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
    proofOfRegistrationUploaded: false,
    transcriptUploaded: false,
  })

  // Check if user is already logged in and skip account creation
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const token = localStorage.getItem('auth-token')
      
      if (token) {
        try {
          // Fetch user profile to pre-fill data
          const response = await fetch('/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            // Skip to step 2 and pre-fill name
            setCurrentStep(2)
            setFormData(prev => ({
              ...prev,
              fullName: userData.fullName || "",
              email: userData.email || ""
            }))
          }
        } catch (error) {
          console.error('Error loading profile:', error)
        }
      }
      
      setIsLoadingProfile(false)
    }
    
    checkAuthAndLoadProfile()
  }, [])

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type (PDF, images)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or image file')
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB')
        return
      }

      setProofOfRegistration(file)
      handleInputChange("proofOfRegistrationUploaded", true)
    }
  }

  const handleTranscriptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type (PDF, images)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or image file')
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB')
        return
      }

      setTranscript(file)
      handleInputChange("transcriptUploaded", true)
    }
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all required fields before submission
    const requiredFields = {
      fullName: formData.fullName,
      institution: formData.institution,
      qualification: formData.qualification,
      hourlyRate: formData.hourlyRate,
      bio: formData.bio,
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.toString().trim() === '')
      .map(([key, _]) => key)

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    // Validate modules
    const validModules = Array.isArray(formData.modules) 
      ? formData.modules.filter(m => m && m.trim() !== '') 
      : []

    if (validModules.length === 0) {
      alert('Please enter at least one module code')
      return
    }

    // Validate proof of registration
    if (!proofOfRegistration) {
      alert('Please upload your proof of registration document')
      return
    }
    
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Please log in to submit your tutor application')
        return
      }

      // Convert file uploads to base64
      const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      let proofBase64: string | null = null
      let transcriptBase64: string | null = null

      if (proofOfRegistration) {
        proofBase64 = await convertFileToBase64(proofOfRegistration)
      }

      if (transcript) {
        transcriptBase64 = await convertFileToBase64(transcript)
      }

      // Prepare the application data
      const applicationData = {
        fullName: formData.fullName.trim(),
        institution: formData.institution,
        modules: validModules,
        qualification: formData.qualification.trim(),
        hourlyRate: formData.hourlyRate,
        bio: formData.bio.trim(),
        profilePicture: profilePicture,
        proofOfRegistration: proofBase64,
        transcript: transcriptBase64,
      }

      console.log('Submitting application data:', {
        ...applicationData,
        modulesCount: validModules.length,
        profilePictureLength: profilePicture?.length,
        proofLength: proofBase64?.length,
        transcriptLength: transcriptBase64?.length,
      })

      const response = await fetch('/api/tutors/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      })

      const result = await response.json()

      console.log('API Response:', { status: response.status, result })

      if (!response.ok) {
        console.error('Application submission failed:', result)
        throw new Error(result.error || 'Failed to submit application')
      }

      // Move to success step
      setCurrentStep(4)
    } catch (error) {
      console.error('Error submitting tutor application:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.'
      console.error('Full error details:', error)
      alert(errorMessage)
    }
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

        {isLoadingProfile ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
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
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <Image 
                          src={profilePicture} 
                          alt="Profile preview" 
                          width={80} 
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-10 w-10 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <input
                        ref={profilePictureInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                        id="profile-picture-input"
                      />
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => profilePictureInputRef.current?.click()}
                      >
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max 5MB, JPG/PNG
                      </p>
                    </div>
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
                      {INSTITUTION_OPTIONS.map((inst) => (
                        <SelectItem key={inst.value} value={inst.value}>
                          {inst.label}
                        </SelectItem>
                      ))}
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
                  <Label>Proof of registration</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload an official proof of registration/enrolment letter showing your name, institution, and current year/semester
                    </p>
                    <input
                      ref={proofInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleProofUpload}
                      className="hidden"
                      id="proof-upload-input"
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => proofInputRef.current?.click()}
                    >
                      {formData.proofOfRegistrationUploaded ? (
                        <>Uploaded ✓ - {proofOfRegistration?.name}</>
                      ) : (
                        "Upload Document"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Required for verification (PDF or image, max 10MB)</p>
                </div>

                <div className="space-y-2">
                  <Label>Academic Transcript (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your academic transcript to boost your credibility
                    </p>
                    <input
                      ref={transcriptInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleTranscriptUpload}
                      className="hidden"
                      id="transcript-upload-input"
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => transcriptInputRef.current?.click()}
                    >
                      {formData.transcriptUploaded ? (
                        <>Uploaded ✓ - {transcript?.name}</>
                      ) : (
                        "Upload Document"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Optional but recommended (PDF or image, max 10MB)</p>
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
        </>
        )}
      </div>
    </div>
  )
}
