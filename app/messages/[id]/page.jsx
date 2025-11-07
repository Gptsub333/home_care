"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useParams } from "next/navigation"

const SendIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const VideoIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m23 7-7 5 7 5V7z" />
    <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
  </svg>
)

const MoreVerticalIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const mockProviders = {
  1: {
    name: "Dr. Sarah Johnson",
    online: true,
    avatar: "/professional-female-doctor.png",
  },
  2: {
    name: "Dr. Michael Chen",
    online: false,
    avatar: "/male-cardiologist.jpg",
  },
  3: {
    name: "Nurse Emily Davis",
    online: true,
    avatar: "/professional-female-nurse.png",
  },
}

const mockMessages = [
  {
    id: 1,
    sender: "them",
    text: "Hello! I wanted to confirm our appointment for tomorrow.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Yes, I have you scheduled for 10:00 AM. Is that still good for you?",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "Perfect! I will be there at 10 AM tomorrow. Thank you!",
    time: "10:35 AM",
  },
]

export default function ChatPage() {
  const params = useParams()
  const providerId = params.id
  const provider = mockProviders[providerId] || mockProviders[1]

  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState(mockMessages)

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "me",
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessageText("")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/messages">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 cursor-pointer">
              <ArrowLeftIcon />
            </Button>
          </Link>
          <Avatar>
            <AvatarImage src={provider.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {provider.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{provider.name}</h3>
            <p className="text-sm text-white/80">{provider.online ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 cursor-pointer">
            <PhoneIcon />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 cursor-pointer">
            <VideoIcon />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 cursor-pointer">
            <MoreVerticalIcon />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-teal-50/30 to-blue-50/30">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === "me"
                    ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                    : "bg-white shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-white/70" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-gradient-to-r from-teal-500 to-blue-500 cursor-pointer">
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
