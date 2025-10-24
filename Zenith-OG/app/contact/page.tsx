import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Have questions about Zenith Student Marketplace? We're here to help you succeed.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-lg text-gray-600 mb-8">
                Reach out to our support team for assistance with your account, transactions, or any questions about using the platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Support</h3>
                  <p className="text-gray-600">support@zenithmarketplace.co.za</p>
                  <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone Support</h3>
                  <p className="text-gray-600">+27 11 123 4567</p>
                  <p className="text-sm text-gray-500">Monday - Friday, 8:00 AM - 6:00 PM SAST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <p className="text-gray-600">Available on our platform</p>
                  <p className="text-sm text-gray-500">Monday - Friday, 8:00 AM - 8:00 PM SAST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office Address</h3>
                  <p className="text-gray-600">
                    123 University Avenue<br />
                    Johannesburg, 2000<br />
                    South Africa
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Help</h3>
              <div className="space-y-3">
                <a href="/faq" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </a>
                <a href="/about" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  How Zenith Works
                </a>
                <a href="/browse" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
                  <Clock className="h-5 w-5 mr-2" />
                  Browse Products
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Send us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        className="w-full"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        className="w-full"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="w-full"
                      placeholder="your.email@university.ac.za"
                    />
                  </div>

                  <div>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                      University/Institution
                    </label>
                    <Input
                      id="university"
                      type="text"
                      className="w-full"
                      placeholder="Your university or college"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="account">Account & Login Issues</option>
                      <option value="selling">Selling Products</option>
                      <option value="buying">Buying Products</option>
                      <option value="payment">Payment Issues</option>
                      <option value="safety">Safety & Security</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Please describe your question or issue in detail..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-md">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Hours</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <p className="text-gray-600">24/7 - We respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Phone Support</p>
                  <p className="text-gray-600">Mon-Fri: 8:00 AM - 6:00 PM SAST</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Live Chat</p>
                  <p className="text-gray-600">Mon-Fri: 8:00 AM - 8:00 PM SAST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}