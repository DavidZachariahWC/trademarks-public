"use client"

import { Input } from "@/components/ui/input"
import { SubmitButton } from "./submit-button"
import { Loader2 } from "lucide-react"

interface ChatInputProps {
  input: string
  isLoading: boolean
  isProcessingFile: boolean
  isInitializing?: boolean
  onInputChange: (value: string) => void
  onSubmit: () => void
  onFileSelect: (file: File) => Promise<void>
}

export function ChatInput({ 
  input, 
  isLoading, 
  isProcessingFile,
  isInitializing = false,
  onInputChange, 
  onSubmit,
  onFileSelect
}: ChatInputProps) {
  const isDisabled = isLoading || isProcessingFile || isInitializing;

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-row gap-2 relative items-end w-full sticky bottom-0 bg-white p-4 border-t border-zinc-200"
    >
      <div className="flex-1 relative">
        {isInitializing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center gap-2 rounded-md z-10">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-zinc-600">
              Case summary is being synthesized, please wait...
            </span>
          </div>
        )}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
            e.target.value = '';
          }}
          className="hidden"
          id="file-upload"
          disabled={isDisabled}
        />
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
              e.preventDefault()
              onSubmit()
            }
          }}
          placeholder="Type your message..."
          disabled={isDisabled}
          className="flex-1 bg-zinc-100 border-zinc-300 text-zinc-900 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-500 h-12 py-2"
        />
      </div>
      <SubmitButton
        disabled={isDisabled || !input.trim()}
        loading={isLoading}
        onClick={onSubmit}
      >
        Send
      </SubmitButton>
    </form>
  )
} 