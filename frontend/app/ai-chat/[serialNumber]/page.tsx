// /app/ai-chat/[serialNumber]/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api-config"
import { useParams } from "next/navigation"
import { Chat } from "../newComponents/chat"
import { toast } from "sonner"

interface Message {
  id?: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

interface CaseData {
  mark_identification: string
  serial_number: string
  registration_number: string | null
  header: {
    filing_date: string | null
  }
  // Add other fields as needed
}

interface APIError {
  error: string;
  details?: string;
  code?: string;
}

function getErrorMessage(error: any): string {
  // If it's an API error response
  if (error.code) {
    switch (error.code) {
      case 'RATE_LIMITED':
        return "We've hit our limit. Please wait a moment before sending another message.";
      case 'MODEL_UNAVAILABLE':
        return "The AI service is temporarily unavailable. Please try again in a few minutes.";
      case 'INVALID_RESPONSE':
        return "Received an invalid response from the AI. Please refresh the page and try again.";
      default:
        return error.details || error.error || "An unexpected error occurred.";
    }
  }

  // If it's a network error
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  // Default error message
  return error.message || "An unexpected error occurred. Please try again.";
}

export default function AIChatPage() {
  const params = useParams()
  const serialNumber = params.serialNumber as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const processAIResponse = async (response: Response, errorContext: string) => {
    if (!response.ok) {
      let errorData: APIError;
      try {
        errorData = await response.json();
      } catch {
        throw new Error(`${errorContext} (Status: ${response.status})`);
      }

      // Handle specific HTTP status codes
      switch (response.status) {
        case 429:
          errorData.code = 'RATE_LIMITED';
          break;
        case 503:
          errorData.code = 'MODEL_UNAVAILABLE';
          break;
      }

      throw errorData;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw { code: 'INVALID_RESPONSE', error: 'Failed to parse AI response' };
    }

    if (!data.response) {
      throw { code: 'INVALID_RESPONSE', error: 'Invalid response format from AI' };
    }

    return data;
  };

  // Fetch case data and initialize chat
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.caseDetails(serialNumber));
        
        if (!response.ok) {
          throw new Error("Failed to load case details. Please try refreshing the page.");
        }
        
        const data = await response.json();
        setCaseData(data);
        
        setMessages([{
          id: "initial",
          role: "assistant",
          content: "Hi there! This is your trademark case assistant. I have access to the case details, and I'm here to answer any questions you have about it!"
        }]);

        if (data.registration_number) {
          try {
            const docsResponse = await fetch(`/api/uspto-docs?rn=${data.registration_number}`);
            
            if (!docsResponse.ok) {
              const errorData = await docsResponse.json();
              setMessages(prev => [...prev, {
                id: `system-${Date.now()}`,
                role: "assistant",
                content: "⚠️ Note: I don't have access to the USPTO registration documents for this case. " + 
                  "This could be because the documents are not yet available or there was an issue retrieving them. " +
                  "I'll still help you based on the case details, but you may need to manually upload any relevant documents you'd like me to analyze."
              }]);
              console.warn("USPTO documents not available:", errorData);
              setIsInitializing(false);
              return;
            }

            const pdfBlob = await docsResponse.blob();
            const base64Data = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
              };
              reader.readAsDataURL(pdfBlob);
            });

            const aiResponse = await fetch("/api/ai-chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: "I've retrieved the USPTO registration documents. Please analyze them in the context of this trademark case.",
                caseData: data,
                context: messages,
                pdfContent: {
                  inlineData: {
                    data: base64Data,
                    mimeType: "application/pdf"
                  }
                }
              })
            });

            const aiData = await processAIResponse(aiResponse, "Failed to process USPTO documents");
            
            setMessages(prev => [...prev, {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: aiData.response
            }]);

          } catch (error) {
            console.error("Error processing USPTO documents:", error);
            setMessages(prev => [...prev, {
              id: `system-${Date.now()}`,
              role: "assistant",
              content: "⚠️ I encountered an issue while processing the USPTO registration documents. " +
                "I'll still help you based on the case details, but you may need to manually upload any relevant documents you'd like me to analyze."
            }]);
          } finally {
            setIsInitializing(false);
          }
        } else {
          setMessages(prev => [...prev, {
            id: `system-${Date.now()}`,
            role: "assistant",
            content: "ℹ️ This case doesn't have a registration number yet, so there are no USPTO registration documents available. " +
              "I'll help you based on the case details, and you can manually upload any relevant documents you'd like me to analyze."
          }]);
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("Error fetching case data:", error);
        setError(getErrorMessage(error));
        setIsInitializing(false);
      }
    };

    if (serialNumber) {
      fetchCaseData();
    }
  }, [serialNumber]);

  const handleFileSelect = async (file: File) => {
    if (!caseData) return;
    
    setIsProcessingFile(true);
    setError(null);
    
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setMessages(prev => [...prev, {
        id: `user-${Date.now()}`,
        role: "user",
        content: `📄 Uploaded document: ${file.name}`
      }]);

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "I've uploaded a PDF document. Please analyze it in the context of this trademark case.",
          caseData,
          context: messages,
          pdfContent: {
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf"
            }
          }
        })
      });

      const data = await processAIResponse(response, "Failed to process document");
      
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response
      }]);

    } catch (error) {
      console.error("Error processing file:", error);
      setError(getErrorMessage(error));
      // Remove the file upload message if we failed to process it
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !caseData) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    
    setMessages(prev => [...prev, { 
      id: `user-${Date.now()}`,
      role: "user", 
      content: userMessage 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setMessages(prev => [
      ...prev,
      { 
        id: `assistant-${Date.now()}`,
        role: "assistant", 
        content: "", 
        isStreaming: true 
      }
    ]);
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          caseData,
          context: messages.filter(m => !m.isStreaming)
        })
      });

      const data = await processAIResponse(response, "Failed to get AI response");
      
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
      );
    } catch (error) {
      console.error("Chat Error:", error);
      setError(getErrorMessage(error));
      // Remove the streaming message
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
    } finally {
      setIsLoading(false);
    }
  };

  if (!caseData) {
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
      isProcessingFile={isProcessingFile}
    />
  )
}
