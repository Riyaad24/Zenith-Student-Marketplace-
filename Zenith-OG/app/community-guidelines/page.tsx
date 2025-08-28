import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function CommunityGuidelinesPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Community Guidelines</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="mb-6">
                At Zenith Student Marketplace, we are building a trusted and respectful community of students who
                support one another through safe and meaningful exchanges of academic resources. These Community
                Guidelines help ensure that everyone enjoys a positive experience on the platform.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Respect Others</h3>
                    <p className="text-muted-foreground">
                      Treat all users with kindness and professionalism. Harassment, hate speech, discrimination, or any
                      form of abusive behavior will not be tolerated.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Only Sell What's Allowed</h3>
                    <p className="text-muted-foreground">
                      Listings must be academic-related—such as textbooks, study guides, stationery, or tutoring
                      services. Illegal, counterfeit, or inappropriate items are strictly prohibited.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Be Honest and Transparent</h3>
                    <p className="text-muted-foreground">
                      Ensure that your listings are accurate and reflect the true condition of the item or service.
                      Misleading descriptions or dishonest practices may result in suspension.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Stay Safe</h3>
                    <p className="text-muted-foreground">
                      Only use the secure messaging and payment systems provided by Zenith. Avoid sharing personal
                      information (like phone numbers or bank details) outside the platform.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">No Spam or Self-Promotion</h3>
                    <p className="text-muted-foreground">
                      Do not spam other users with unsolicited messages, ads, or links. Promote your listings through
                      proper channels provided by the platform.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    6
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Keep It Clean</h3>
                    <p className="text-muted-foreground">
                      Avoid using offensive language, inappropriate images, or any content that violates the values of
                      our student community.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    7
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Report Suspicious Activity</h3>
                    <p className="text-muted-foreground">
                      If you encounter scams, suspicious listings, or any rule violations, report them immediately using
                      the "Report" feature or contact our support team.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    8
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Respect Platform Policies</h3>
                    <p className="text-muted-foreground">
                      All users must follow Zenith's{" "}
                      <Link href="/terms" className="text-purple-700 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-700 hover:underline">
                        Privacy Policy
                      </Link>
                      . Repeated violations can lead to warnings, temporary suspension, or permanent removal.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6">
                By using Zenith, you're contributing to a supportive, secure, and student-driven environment. Let's keep
                it safe and empowering for everyone.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Reporting Violations</h2>
          <p className="text-center mb-4">
            If you see content that violates these guidelines, please report it immediately.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/contact">
              <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
