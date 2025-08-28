"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MoreHorizontal, Send, User } from "lucide-react"
import Image from "next/image"

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>("1")

  // Mock data for conversations
  const conversations = [
    {
      id: "1",
      user: "Michael S.",
      product: "Calculus Textbook",
      lastMessage: "Is this still available?",
      time: "10:30 AM",
      unread: true,
      avatar: null,
    },
    {
      id: "2",
      user: "Sarah K.",
      product: "HP Laptop",
      lastMessage: "Can you meet tomorrow?",
      time: "Yesterday",
      unread: false,
      avatar: null,
    },
    {
      id: "3",
      user: "David M.",
      product: "Economics Notes",
      lastMessage: "Thanks for the quick response!",
      time: "2 days ago",
      unread: false,
      avatar: null,
    },
  ]

  // Mock data for messages in the active chat
  const messages = [
    {
      id: "1",
      sender: "other",
      text: "Hi there! I'm interested in your Calculus Textbook. Is it still available?",
      time: "10:30 AM",
    },
    {
      id: "2",
      sender: "me",
      text: "Yes, it's still available! Are you interested in buying it?",
      time: "10:32 AM",
    },
    {
      id: "3",
      sender: "other",
      text: "Great! I'm a first-year engineering student and I need it for my course. What's the condition like? Any highlighting or notes?",
      time: "10:35 AM",
    },
    {
      id: "4",
      sender: "me",
      text: "The condition is like new. I barely used it and there's no highlighting or notes. I can send you more pictures if you'd like.",
      time: "10:38 AM",
    },
    {
      id: "5",
      sender: "other",
      text: "That would be great! Could we meet on campus to take a look at it?",
      time: "10:40 AM",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${activeChat === conversation.id ? "bg-muted/50" : ""} ${conversation.unread ? "font-medium" : ""}`}
                onClick={() => setActiveChat(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {conversation.avatar ? (
                      <Image
                        src={conversation.avatar || "/placeholder.svg"}
                        alt={conversation.user}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-600" />
                    )}
                    {conversation.unread && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-purple-600 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="font-medium truncate">{conversation.user}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{conversation.product}</span>
                    </div>
                    <div className="text-sm truncate mt-1">{conversation.lastMessage}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b flex justify-between items-center bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium">{conversations.find((c) => c.id === activeChat)?.user}</div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>{conversations.find((c) => c.id === activeChat)?.product}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "me" ? "bg-purple-600 text-white" : "bg-muted"
                      }`}
                    >
                      <div>{message.text}</div>
                      <div
                        className={`text-xs mt-1 ${message.sender === "me" ? "text-purple-200" : "text-muted-foreground"}`}
                      >
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <form className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button type="submit" size="icon" className="bg-purple-700 hover:bg-purple-800">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
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
                    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-muted-foreground mt-1">Select a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
