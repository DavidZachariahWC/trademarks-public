// /app/ai-chat/[serialNumber]/page.tsx

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api-config"
import { useParams } from "next/navigation"
import Link from "next/link"

interface Message {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

interface CaseData {
  mark_identification: string
  serial_number: string
  // Add other fields as needed
}

export default function AIChatPage() {
  const params = useParams()
  const serialNumber = params.serialNumber as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch case data and initialize chat
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        console.log("Fetching case data for:", serialNumber)
        const response = await fetch(API_ENDPOINTS.caseDetails(serialNumber))
        
        if (!response.ok) {
          throw new Error("Failed to fetch case data")
        }
        
        const data = await response.json()
        console.log("Case data received:", {
          serialNumber: data.serial_number,
          mark: data.mark_identification
        })
        
        setCaseData(data)
        
        // Only set initial message if we have valid case data
        if (data.mark_identification) {
          setMessages([
            {
              role: "assistant",
              content: `Hello! I'm here to help you with information about trademark case ${serialNumber} - "${data.mark_identification}". What would you like to know?`
            }
          ])
        }
      } catch (error) {
        console.error("Error fetching case data:", error)
        setError("Failed to load case data. Please try refreshing the page.")
      }
    }

    if (serialNumber) {
      fetchCaseData()
    }
  }, [serialNumber])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || !caseData) return

    const userMessage = input.trim()
    setInput("")
    setError(null)
    
    console.log("📤 Sending message:", {
      messageLength: userMessage.length,
      contextLength: messages.length,
      caseData: {
        serialNumber: caseData.serial_number,
        mark: caseData.mark_identification
      }
    })
    
    // Add user's message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    
    // Add a placeholder for the assistant's response
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "", isStreaming: true }
    ])
    
    setIsLoading(true)
    try {
      console.log("🔄 Making API request...")
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          caseData,
          context: messages.filter(m => !m.isStreaming)
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error("❌ API Error:", {
          status: response.status,
          statusText: response.statusText,
          data
        })
        throw new Error(data.details || data.error || "Failed to get AI response")
      }
      
      console.log("✅ Received API response:", {
        responseLength: data.response?.length
      })
      
      if (data.response) {
        // Replace the streaming placeholder with the full response
        setMessages(prev => 
          prev.map((msg, i) => 
            i === prev.length - 1 
              ? { role: "assistant", content: data.response }
              : msg
          )
        )
      } else {
        console.error("❌ Invalid response format:", data)
        throw new Error("Invalid response format")
      }
    } catch (error: any) {
      console.error("❌ Chat Error:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      setError(`Failed to get AI response: ${error.message}`)
      // Remove the streaming message
      setMessages(prev => prev.filter(msg => !msg.isStreaming))
    } finally {
      setIsLoading(false)
    }
  }

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
      <Card className="mb-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">{caseData.mark_identification}</h1>
            <p className="text-gray-600">Serial Number: {caseData.serial_number}</p>
          </div>
          <Link 
            href={`/case/${caseData.serial_number}`}
            className="text-blue-600 hover:underline"
          >
            View Case Details →
          </Link>
        </div>
      </Card>

      <Card className="flex-1 p-4 mb-4 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "assistant"
                      ? "bg-gray-100"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {message.content}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </Card>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isLoading) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
