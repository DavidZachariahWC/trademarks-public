// /app/ai-chat/newComponents/messages-container.tsx

"use client"

import { useEffect, useRef } from "react"
import { Message as MessageComponent } from "./message"

interface Message {
  id?: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

interface MessagesContainerProps {
  messages: Message[]
  chatId: string
}

export function MessagesContainer({ messages, chatId }: MessagesContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      })
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-none"
    >
      <div className="flex flex-col gap-6 min-h-full p-6">
        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            chatId={chatId}
            role={message.role}
            content={message.isStreaming ? (
              <div className="flex gap-1 items-center text-zinc-600">
                <span>Thinking</span>
                <span className="inline-block w-1.5 h-4 bg-zinc-400 animate-pulse" />
                <span className="inline-block w-1.5 h-4 bg-zinc-400 animate-pulse delay-150" />
                <span className="inline-block w-1.5 h-4 bg-zinc-400 animate-pulse delay-300" />
              </div>
            ) : message.content}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}