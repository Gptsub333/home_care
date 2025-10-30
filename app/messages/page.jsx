"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const mockConversations = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    lastMessage: "I will be there at 10 AM tomorrow",
    time: "2m ago",
    unread: 2,
    online: true,
    avatar: "/professional-female-doctor.png",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    lastMessage: "Thank you for the consultation",
    time: "1h ago",
    unread: 0,
    online: false,
    avatar: "/male-cardiologist.jpg",
  },
  {
    id: 3,
    name: "Nurse Emily Davis",
    lastMessage: "See you next week",
    time: "3h ago",
    unread: 0,
    online: true,
    avatar: "/professional-female-nurse.png",
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-serif font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
            >
              MediLux
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-sm hover:text-primary transition-colors">
                Find Care
              </Link>
              <Link href="/messages" className="text-sm font-semibold text-teal-600 transition-colors">
                Messages
              </Link>
              <Link href="/dashboard/patient" className="text-sm hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header with Search */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-serif font-bold mb-3">Your Conversations</h1>
          <p className="text-white/90 mb-6 text-lg">Chat with your healthcare providers</p>
          <div className="relative max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
              <SearchIcon />
            </div>
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">Start chatting with healthcare providers</p>
              <Link href="/search">
                <Button className="bg-gradient-to-r from-teal-500 to-blue-500">Find a Provider</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conv) => (
                <Link
                  href={`/messages/${conv.id}`}
                  key={conv.id}
                  className="block p-6 hover:bg-teal-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conv.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg truncate">{conv.name}</h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread !== 0 && (
                      <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
