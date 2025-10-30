"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      console.log("[v0] Chat message:", message)
      setMessage("")
    }
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat with us</h3>
            <p className="text-sm text-muted-foreground">We typically reply in a few minutes</p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-accent rounded-lg p-3 mb-4">
              <p className="text-sm">Hello! How can we help you today?</p>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSend()
                  }
                }}
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
