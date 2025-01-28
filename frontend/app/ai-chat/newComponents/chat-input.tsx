"use client"

import { Input } from "@/components/ui/input"
import { SubmitButton } from "./submit-button"

interface ChatInputProps {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSubmit: () => void
}

export function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-row gap-2 relative items-end w-full sticky bottom-0 bg-white p-4 border-t border-zinc-200"
    >
      <Input
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault()
            onSubmit()
          }
        }}
        placeholder="Type your message..."
        disabled={isLoading}
        className="flex-1 bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-500 h-12 py-2"
      />
      <SubmitButton
        disabled={isLoading || !input.trim()}
        loading={isLoading}
        onClick={onSubmit}
      >
        Send
      </SubmitButton>
    </form>
  )
} 