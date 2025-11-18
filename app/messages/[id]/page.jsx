

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useParams } from "next/navigation"
import { initializeSocket, getSocket, joinRoom, leaveRoom, sendMessage, startTyping, stopTyping, markAsRead } from "@/lib/socket"

const SendIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

export default function ChatPage() {
  const params = useParams()
  const roomId = params.id
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState([])
  const [roomData, setRoomData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }

    // Decode token to get user ID
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setCurrentUserId(payload.userId)
    } catch (error) {
      console.error('Error decoding token:', error)
    }

    // Initialize socket
    const socket = initializeSocket(token)

    // Join room
    joinRoom(roomId)

    // Fetch initial data
    fetchRoomMessages()

    // Socket event listeners
    socket.on('room:joined', (data) => {
      console.log('Joined room:', data.roomId)
    })

    socket.on('message:receive', (message) => {
      console.log('New message received:', message)
      setMessages(prev => [...prev, message])
      scrollToBottom()
    })

    socket.on('typing:user-typing', ({ userId }) => {
      if (userId !== currentUserId) {
        setIsTyping(true)
      }
    })

    socket.on('typing:user-stopped', ({ userId }) => {
      if (userId !== currentUserId) {
        setIsTyping(false)
      }
    })

    socket.on('message:read', () => {
      // Update message read status
      setMessages(prev => 
        prev.map(msg => ({ ...msg, isRead: true }))
      )
    })

    // Mark messages as read
    markAsRead(roomId)

    return () => {
      leaveRoom(roomId)
      socket.off('room:joined')
      socket.off('message:receive')
      socket.off('typing:user-typing')
      socket.off('typing:user-stopped')
      socket.off('message:read')
    }
  }, [roomId])

  const fetchRoomMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch messages
      const messagesRes = await fetch(`${BACKEND_URL}/messages/${roomId}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!messagesRes.ok) throw new Error('Failed to fetch messages')

      const messagesData = await messagesRes.json()
      setMessages(messagesData.messages || [])

      // Get room details from first message or fetch separately
      if (messagesData.messages && messagesData.messages.length > 0) {
        // You can extract provider/user info from messages
        // Or make a separate API call to get room details
      }

      scrollToBottom()
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(roomId, messageText.trim())
      setMessageText("")
      stopTypingHandler()
    }
  }

  const handleTyping = (e) => {
    setMessageText(e.target.value)

    // Start typing indicator
    startTyping(roomId)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTypingHandler()
    }, 1000)
  }

  const stopTypingHandler = () => {
    stopTyping(roomId)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getOtherUser = () => {
    if (messages.length > 0) {
      const firstMessage = messages[0]
      // If sender is not current user, return sender info
      if (firstMessage.senderId !== currentUserId) {
        return firstMessage.sender
      }
      // Otherwise find a message from the other user
      const otherMessage = messages.find(m => m.senderId !== currentUserId)
      return otherMessage?.sender || { name: 'User', profileImage: null }
    }
    return { name: 'User', profileImage: null }
  }

  const otherUser = getOtherUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    )
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
            <AvatarImage src={otherUser.profileImage || "/placeholder.svg"} />
            <AvatarFallback>
              {(otherUser.name || 'U').split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherUser.name}</h3>
            <p className="text-sm text-white/80">
              {isTyping ? 'typing...' : 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-teal-50/30 to-blue-50/30">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUserId
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isMe
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                        : "bg-white shadow-sm"
                    }`}
                  >
                    {!isMe && (
                      <p className="text-xs font-semibold mb-1">{msg.sender?.name}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className={`text-xs ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                      {isMe && msg.isRead && (
                        <span className="text-xs">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-6 pb-2">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm text-gray-500 italic">Someone is typing...</p>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-white shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={handleTyping}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!messageText.trim()}
            className="bg-gradient-to-r from-teal-500 to-blue-500 cursor-pointer disabled:opacity-50"
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
