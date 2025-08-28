import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, Globe, MapPin, MessageSquare, Star, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample tutor data
const tutors = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    photo: "/placeholder.svg?height=200&width=200&text=SJ",
    courses: ["MATH151", "MATH152", "STAT101"],
    institution: "University of Cape Town",
    hourlyRate: 200,
    mode: ["Online", "In-person"],
    location: "Cape Town Central",
    rating: 4.8,
    reviewCount: 24,
    verified: true,
    qualification: "MSc Mathematics (3rd Year)",
    bio: "I'm a passionate mathematics tutor with over 3 years of experience helping students excel in their studies. I specialize in calculus, linear algebra, and statistics. My teaching approach focuses on building a strong foundation of concepts through practical examples and problem-solving techniques.",
    availability: [
      { day: "Monday", slots: ["14:00 - 16:00", "18:00 - 20:00"] },
      { day: "Wednesday", slots: ["14:00 - 16:00", "18:00 - 20:00"] },
      { day: "Friday", slots: ["10:00 - 12:00"] },
      { day: "Saturday", slots: ["09:00 - 13:00"] },
    ],
    reviews: [
      {
        id: "r1",
        user: "Michael P.",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Sarah is an excellent tutor! She explained complex calculus concepts in a way that was easy to understand. Highly recommend!",
      },
      {
        id: "r2",
        user: "Thabo M.",
        rating: 5,
        date: "1 month ago",
        comment:
          "Very patient and knowledgeable. Sarah helped me prepare for my MATH151 exam and I ended up getting a distinction!",
      },
      {
        id: "r3",
        user: "Emma K.",
        rating: 4,
        date: "2 months ago",
        comment:
          "Great tutor who really knows her stuff. The only reason I'm not giving 5 stars is because sometimes the sessions ran a bit over time.",
      },
    ],
  },
}

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const tutorId = params.id
  const tutor = tutors[tutorId as keyof typeof tutors]

  if (!tutor) {
    return (
      <div className="container px-4 md:px-6 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tutor Not Found</h1>
        <p className="mb-6">Sorry, the tutor you're looking for doesn't exist.</p>
        <Link href="/categories/tutoring">
          <Button className="bg-purple-700 hover:bg-purple-800">Back to Tutors</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tutor Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-32 w-32 rounded-full overflow-hidden">
                    <Image
                      src={tutor.photo || "/placeholder.svg"}
                      alt={tutor.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  {tutor.verified && (
                    <div className="absolute bottom-0 right-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold">{tutor.name}</h2>
                <p className="text-sm text-muted-foreground">{tutor.qualification}</p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="ml-1">
                    {tutor.rating} ({tutor.reviewCount} reviews)
                  </span>
                </div>

                <div className="w-full border-t my-4 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-bold text-lg">R{tutor.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Institution</span>
                    <span>{tutor.institution}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Location</span>
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tutoring Mode</span>
                    <div className="flex gap-2">
                      {tutor.mode.includes("Online") && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <Globe className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      )}
                      {tutor.mode.includes("In-person") && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <MapPin className="h-3 w-3 mr-1" />
                          In-person
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Link href={`/categories/tutoring/request/${tutor.id}`} className="w-full">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800 mt-4">Request Session</Button>
                </Link>
                <Button variant="outline" className="w-full mt-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tutor.availability.map((day) => (
                  <div key={day.day} className="flex justify-between items-start">
                    <div className="font-medium">{day.day}</div>
                    <div className="text-right">
                      {day.slots.map((slot, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline mr-1" />
                Times are shown in your local timezone
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>About {tutor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{tutor.bio}</p>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Education</h3>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
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
                          className="h-5 w-5 text-purple-700"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">{tutor.institution}</h4>
                        <p className="text-sm text-muted-foreground">{tutor.qualification}</p>
                        <p className="text-sm text-muted-foreground">2020 - Present</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Tutoring Experience</h3>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
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
                          className="h-5 w-5 text-purple-700"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                          <path d="m9 16 2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Peer Tutor</h4>
                        <p className="text-sm text-muted-foreground">{tutor.institution}</p>
                        <p className="text-sm text-muted-foreground">2021 - Present</p>
                        <p className="text-sm mt-1">
                          Provided one-on-one and group tutoring sessions for undergraduate mathematics courses.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Subjects & Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Mathematics</h3>
                      <div className="flex flex-wrap gap-2">
                        {tutor.courses
                          .filter((course) => course.includes("MATH"))
                          .map((course) => (
                            <Badge key={course} variant="outline" className="bg-purple-50">
                              {course}
                            </Badge>
                          ))}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Calculus, Linear Algebra, Differential Equations</p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Statistics</h3>
                      <div className="flex flex-wrap gap-2">
                        {tutor.courses
                          .filter((course) => course.includes("STAT"))
                          .map((course) => (
                            <Badge key={course} variant="outline" className="bg-purple-50">
                              {course}
                            </Badge>
                          ))}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Probability, Statistical Methods, Data Analysis</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Teaching Approach</h3>
                    <p className="text-sm">
                      My teaching approach focuses on building a strong foundation of concepts through practical
                      examples and problem-solving techniques. I believe in making complex mathematical concepts
                      accessible and relatable to real-world applications.
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Concept Mastery</h4>
                          <p className="text-sm text-muted-foreground">
                            Focus on understanding core principles before moving to complex problems
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Practice Problems</h4>
                          <p className="text-sm text-muted-foreground">
                            Extensive practice with past papers and example questions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Visual Learning</h4>
                          <p className="text-sm text-muted-foreground">
                            Use of diagrams and visual aids to explain abstract concepts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Real-world Applications</h4>
                          <p className="text-sm text-muted-foreground">
                            Connecting mathematical concepts to practical scenarios
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Student Reviews</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-current text-yellow-400" />
                    <span className="ml-1 font-bold">
                      {tutor.rating} ({tutor.reviewCount} reviews)
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tutor.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{review.user}</div>
                              <div className="text-xs text-muted-foreground">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-current text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Book a Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Select a Date</h3>
                    <div className="border rounded-lg p-4 text-center">
                      <Calendar className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Use the calendar to select your preferred tutoring date
                      </p>
                      <Button className="mt-2 bg-purple-700 hover:bg-purple-800">View Calendar</Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Session Details</h3>
                    <div className="border rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Session Fee (1 hour)</span>
                          <span>R{tutor.hourlyRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform Fee</span>
                          <span>R{Math.round(tutor.hourlyRate * 0.05)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                          <span>Total</span>
                          <span>R{tutor.hourlyRate + Math.round(tutor.hourlyRate * 0.05)}</span>
                        </div>
                      </div>
                      <Link href={`/categories/tutoring/request/${tutor.id}`} className="w-full">
                        <Button className="w-full mt-4 bg-purple-700 hover:bg-purple-800">Request Session</Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
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
                      className="h-5 w-5 text-blue-600 flex-shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    <div>
                      <h4 className="font-medium">Secure Payments</h4>
                      <p className="text-sm text-muted-foreground">
                        Payment is held in escrow and only released to the tutor after your session is completed
                        successfully.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
