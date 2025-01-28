// /app/ai-chat/[serialNumber]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api-config"
import { useParams } from "next/navigation"
import { ChatHeader } from "../newComponents/chat-header"
import { MessagesContainer } from "../newComponents/messages-container"
import { ChatInput } from "../newComponents/chat-input"

interface Message {
  id?: string
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
        console.log("Case data received:", data)
        
        setCaseData(data)
        
        // Always show some initial message:
        setMessages([{
          id: "initial",
          role: "assistant",
          content: "Hi there! This is your trademark case assistant. I have access to the case details, and I'm here to answer any questions you have about it!"
        }])
      } catch (error) {
        console.error("Error fetching case data:", error)
        setError("Failed to load case data. Please try refreshing the page.")
      }
    }

    if (serialNumber) {
      fetchCaseData()
    }
  }, [serialNumber])

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
    setMessages(prev => [...prev, { 
      id: `user-${Date.now()}`,
      role: "user", 
      content: userMessage 
    }])
    
    // Add a small delay of value 100 before showing the thinking message
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Add a placeholder for the assistant's response
    setMessages(prev => [
      ...prev,
      { 
        id: `assistant-${Date.now()}`,
        role: "assistant", 
        content: "", 
        isStreaming: true 
      }
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
              ? { 
                  id: `assistant-${Date.now()}`,
                  role: "assistant", 
                  content: data.response 
                }
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
    <>
      <div className="flex-1 w-full flex flex-col gap-4">
        <MessagesContainer 
          messages={messages}
          chatId={serialNumber}
        />

        {error && (
          <div className="w-full max-w-2xl mx-auto px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSendMessage}
      />
    </>
  )
}
