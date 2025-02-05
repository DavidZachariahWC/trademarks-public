// /app/design-code/page.tsx

"use client"

import { useState } from "react"
import { Chat } from "@/app/ai-chat/newComponents/chat"

interface Message {
  id?: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export default function DesignCodePage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: "initial",
    role: "assistant",
    content: "Hi! I'll help you classify your design. Please describe your design and I'll help determine the appropriate design codes."
  }])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setError(null)
    
    // Add user's message to chat
    setMessages(prev => [...prev, { 
      id: `user-${Date.now()}`,
      role: "user", 
      content: userMessage 
    }])
    
    // Add a small delay before showing the thinking message
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
      const response = await fetch("/api/ai-chat/design-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: userMessage,
          context: messages.filter(m => !m.isStreaming)
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to get AI response")
      }

      let aiResponse = ""
      if (data.status === "need_more_info") {
        const questions = data.questions.join("\n")
        aiResponse = `${questions}`
      } else if (data.status === "complete") {
        const { classification } = data
        aiResponse = `I believe I've determined the design codes: \n\n` +
          ` ${classification.categoryReasoning}\n\n` +
          ` ${classification.divisionReasoning}\n\n` +
          ` ${classification.sectionReasoning}`
      }
      
      // Replace the streaming placeholder with the full response
      setMessages(prev => 
        prev.map((msg, i) => 
          i === prev.length - 1 
            ? { 
                id: `assistant-${Date.now()}`,
                role: "assistant", 
                content: aiResponse 
              }
            : msg
        )
      )
    } catch (error: any) {
      console.error("Design Code Error:", error)
      setError(`Failed to get AI response: ${error.message}`)
      // Remove the streaming message
      setMessages(prev => prev.filter(msg => !msg.isStreaming))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Chat
      messages={messages}
      input={input}
      isLoading={isLoading}
      error={error}
      chatId="design-code"
      onInputChange={setInput}
      onSubmit={handleSendMessage}
      onFileSelect={async () => {}}
    />
  )
}
