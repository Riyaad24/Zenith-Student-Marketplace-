import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="mb-4">
                Zenith Student Marketplace is a South African e-commerce platform built by students, for students. Our
                mission is to make education more accessible by providing a secure and affordable space for university
                and college students to buy, sell, rent, or trade study materials and tutoring services.
              </p>

              <p className="mb-4">
                Born from the real challenges faced by students—like the high cost of textbooks and the lack of safe,
                student-oriented online marketplaces—Zenith was designed to empower learners across the country. Whether
                you're looking for second-hand textbooks, affordable tech, or academic support, Zenith connects you with
                peers in your area through a secure, community-driven platform.
              </p>

              <p className="mb-4">
                What sets us apart is our focus on student needs: we offer South African-friendly payment methods, a
                built-in escrow system for safe transactions, and verified user profiles to ensure trust. With a
                mobile-friendly design, intuitive product listings, and strong safety measures like end-to-end
                encryption and two-factor authentication, Zenith is the go-to marketplace for academic empowerment.
              </p>

              <p className="mb-4">
                At Zenith, we're more than just a platform—we're a student movement built on trust, collaboration, and
                innovation. Join us in transforming the way students share and succeed.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6">
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-muted-foreground">
              To make education more accessible and affordable for all South African students.
            </p>
          </Card>

          <Card className="text-center p-6">
            <h3 className="text-xl font-bold mb-2">Our Vision</h3>
            <p className="text-muted-foreground">
              A collaborative student community where resources are shared efficiently and sustainably.
            </p>
          </Card>

          <Card className="text-center p-6">
            <h3 className="text-xl font-bold mb-2">Our Values</h3>
            <p className="text-muted-foreground">Trust, accessibility, innovation, and community empowerment.</p>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Join the Zenith Community</h2>
            <p className="text-center mb-6">
              Be part of the movement to transform student resource sharing across South Africa.
            </p>
            <div className="flex justify-center">
              <a href="/register" className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md">
                Sign Up Today
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
