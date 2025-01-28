// /app/ai-chat/newComponents/messages-container.tsx

"use client"

import { Message as MessageComponent } from "./message"
import { useScrollToBottom } from "./use-scroll-to-bottom"

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
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>()

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col gap-6 w-[calc(100%-2rem)] max-w-2xl mx-auto overflow-y-auto px-4 md:px-0 pb-4 pt-6 scrollbar-thin scrollbar-thumb-zinc-300 bg-zinc-50 rounded-lg scroll-smooth"
    >
      <div className="flex-1 flex flex-col gap-6 min-h-0">
        {messages.map((message, index) => (
          <MessageComponent
            key={message.id}
            chatId={chatId}
            role={message.role}
            content={message.isStreaming ? 
              <div className="flex gap-1 items-center text-zinc-600">
                <span>Thinking</span>
                <span className="inline-block w-1.5 h-4 bg-zinc-400 animate-pulse" />
                <span className="inline-block w-1.5 h-4 bg-zinc-400 animate-pulse delay-150" />
                <span className="inline-block w-1.5 h-4 bg-zinc-400 animate-pulse delay-300" />
              </div> 
              : message.content
            }
          />
        ))}
        <div
          ref={endRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>
    </div>
  )
} 