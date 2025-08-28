"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Edit, MapPin, MessageSquare, Package, ShoppingBag, Star, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@university.ac.za",
    university: "University of Cape Town",
    joinedDate: "March 2023",
    location: "Cape Town",
    avatar: null,
    listings: 5,
    sales: 12,
    rating: 4.8,
  }

  // Mock listings data
  const listings = [
    {
      id: "1",
      title: "Calculus Textbook",
      price: 450,
      image: "/placeholder.svg?height=100&width=100&text=Textbook",
      status: "active",
      views: 24,
      date: "2 days ago",
    },
    {
      id: "2",
      title: "HP Laptop",
      price: 3500,
      image: "/placeholder.svg?height=100&width=100&text=Laptop",
      status: "active",
      views: 56,
      date: "1 week ago",
    },
    {
      id: "3",
      title: "Economics Notes",
      price: 150,
      image: "/placeholder.svg?height=100&width=100&text=Notes",
      status: "sold",
      views: 18,
      date: "2 weeks ago",
    },
  ]

  // Mock purchases data
  const purchases = [
    {
      id: "1",
      title: "Physics Textbook",
      price: 380,
      image: "/placeholder.svg?height=100&width=100&text=Physics",
      seller: "Sarah K.",
      date: "1 month ago",
      status: "completed",
    },
    {
      id: "2",
      title: "Scientific Calculator",
      price: 250,
      image: "/placeholder.svg?height=100&width=100&text=Calculator",
      seller: "Michael S.",
      date: "2 months ago",
      status: "completed",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.avatar ? (
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-600" />
                    )}
                  </div>
                  <Button variant="outline" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <div className="flex items-center justify-center mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center justify-center mt-1 text-sm">
                  <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                  <span>
                    {user.rating} • Joined {user.joinedDate}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full mt-4">
                  <div className="text-center">
                    <div className="font-bold">{user.listings}</div>
                    <div className="text-xs text-muted-foreground">Listings</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{user.sales}</div>
                    <div className="text-xs text-muted-foreground">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{user.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-purple-700 hover:bg-purple-800">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-2">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "profile" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant={activeTab === "listings" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "listings" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              My Listings
            </Button>
            <Button
              variant={activeTab === "purchases" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "purchases" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("purchases")}
            >
              <Package className="h-4 w-4 mr-2" />
              Purchases
            </Button>
            <Button
              variant={activeTab === "messages" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "messages" ? "bg-purple-700 hover:bg-purple-800" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University/College</Label>
                  <Input id="university" defaultValue={user.university} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={user.location} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell other users about yourself..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-purple-700 hover:bg-purple-800">Save Changes</Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "listings" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>Manage your product listings</CardDescription>
                </div>
                <Link href="/sell">
                  <Button className="bg-purple-700 hover:bg-purple-800">Add New Listing</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="sold">Sold</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="active" className="mt-0 space-y-4">
                    {listings
                      .filter((listing) => listing.status === "active")
                      .map((listing) => (
                        <div key={listing.id} className="flex items-center border rounded-lg p-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden">
                            <Image
                              src={listing.image || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{listing.title}</h3>
                                <div className="text-sm text-muted-foreground">
                                  Listed {listing.date} • {listing.views} views
                                </div>
                              </div>
                              <div className="font-bold">R{listing.price}</div>
                            </div>
                          </div>
                          <div className="ml-4 flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="sold" className="mt-0 space-y-4">
                    {listings
                      .filter((listing) => listing.status === "sold")
                      .map((listing) => (
                        <div key={listing.id} className="flex items-center border rounded-lg p-4">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden">
                            <Image
                              src={listing.image || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{listing.title}</h3>
                                <div className="text-sm text-muted-foreground">Sold {listing.date}</div>
                              </div>
                              <div className="font-bold">R{listing.price}</div>
                            </div>
                          </div>
                          <div className="ml-4 flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Relist
                            </Button>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                  <TabsContent value="drafts" className="mt-0">
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
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
                          className="h-6 w-6 text-muted-foreground"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium">No Draft Listings</h3>
                      <p className="text-muted-foreground mt-1">You don't have any draft listings yet</p>
                      <Link href="/sell">
                        <Button className="mt-4 bg-purple-700 hover:bg-purple-800">Create New Listing</Button>
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {activeTab === "purchases" && (
            <Card>
              <CardHeader>
                <CardTitle>My Purchases</CardTitle>
                <CardDescription>View your purchase history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center border rounded-lg p-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={purchase.image || "/placeholder.svg"}
                          alt={purchase.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{purchase.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              Purchased {purchase.date} from {purchase.seller}
                            </div>
                          </div>
                          <div className="font-bold">R{purchase.price}</div>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "messages" && (
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Your conversations with other users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Message Center</h3>
                  <p className="text-muted-foreground mt-1">View and manage your conversations</p>
                  <Link href="/messages">
                    <Button className="mt-4 bg-purple-700 hover:bg-purple-800">Go to Messages</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
