// /app/ai-chat/[serialNumber]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { Chat } from "../newComponents/chat"
import { toast } from "sonner"
import { Case } from "@/utils/types/case"

interface Message {
  id?: string; // Optional, as IDs are managed by the frontend for display
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean // Optional, for future streaming implementation
}

interface APIError {
  code: string
  message: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! This is your trademark case assistant. I have access to the case details, and I'm here to answer any questions you have about it!"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<any>(null)
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [showThinking, setShowThinking] = useState(false)

  const params = useParams()
  const serialNumber = Array.isArray(params.serialNumber) 
    ? params.serialNumber[0] 
    : (params.serialNumber || '') // Provide empty string as fallback

  // Fetch case data
  useEffect(() => {
    const fetchData = async () => {
      if (!serialNumber) return

      try {
        console.log("Fetching case data for serial number:", serialNumber)
        const response = await fetch(`/api/case/${serialNumber}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch case data: ${response.status}`)
        }

        const data = await response.json()
        console.log("Successfully retrieved case data:", data)
        setCaseData(data)
      } catch (error: any) {
        console.error("Error fetching case data:", error)
        setError(error)
      } finally {
        setIsInitializing(false)
      }
    }

    fetchData()
  }, [serialNumber])

  // Handle initial summary request separately
  useEffect(() => {
    const requestInitialSummary = async () => {
      if (caseData && isFirstLoad && !isInitializing && !isLoading) {
        console.log("Requesting initial case summary...")
        await handleSendMessage("Please provide a summary of this trademark case.", true)
        setIsFirstLoad(false)
      }
    }

    requestInitialSummary()
  }, [caseData, isFirstLoad, isInitializing, isLoading])

  // Empty file handler since we don't need it anymore
  const handleFileSelect = async (file: File) => {
    // No-op as file handling is not needed
  }

  const handleSendMessage = async (customInput?: string, isInitialMessage = false) => {
    const messageToSend = customInput !== undefined ? customInput : input;
    if ((!messageToSend.trim() && !isInitialMessage) || !caseData || isLoading) return;

    // Only add user message to chat history if it's not the initial message
    if (!isInitialMessage) {
      const newUserMessage: Message = { 
        id: `user-${Date.now()}`,
        role: "user", 
        content: messageToSend 
      };
      setMessages(prev => [...prev, newUserMessage]);
      setInput("");
    }

    setIsLoading(true);
    setError(null);

    // Add delay before showing thinking message
    await new Promise(resolve => setTimeout(resolve, 100));
    setShowThinking(true);

    try {
      const response = await fetch(`/api/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          caseData: caseData,
          context: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to send message: ${response.status} - ${errorData.error || "Unknown error"}`
        );
      }

      const data = await response.json();
      const newAIMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages(prev => [...prev, newAIMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      setShowThinking(false);
    }
  };

  function getErrorMessage(error: any): string {
    if (error.code) {
      console.error("API Error:", error);
      switch (error.code) {
        case 'RATE_LIMITED':
          return "You've exceeded the rate limit. Please try again later.";
        case 'INVALID_INPUT':
          return "The input is invalid. Please check your input and try again.";
        case 'SERVER_ERROR':
          return "An internal server error occurred. Please try again later.";
        default:
          return "An unexpected API error occurred.";
      }
    }

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error("Network Error:", error);
      return "Unable to connect to the server. Please check your internet connection.";
    }

    console.error("Generic Error:", error);
    return error.message || "An unexpected error occurred.";
  }

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Chat
      messages={messages}
      input={input}
      isLoading={isLoading}
      isInitializing={isInitializing}
      error={error}
      chatId={serialNumber}
      onInputChange={setInput}
      onSubmit={handleSendMessage}
      onFileSelect={handleFileSelect}
      showThinking={showThinking}
      isFirstLoad={isFirstLoad}
    />
  )
}
