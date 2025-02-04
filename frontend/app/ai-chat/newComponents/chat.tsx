"use client";

import { MessagesContainer } from "./messages-container";
import { ChatInput } from "./chat-input";
import { Info } from "lucide-react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface ChatProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  isInitializing?: boolean;
  error: string | null;
  chatId: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onFileSelect: (file: File) => Promise<void>;
  isProcessingFile?: boolean;
}

export function Chat({
  messages,
  input,
  isLoading,
  isInitializing = false,
  error,
  chatId,
  onInputChange,
  onSubmit,
  onFileSelect,
  isProcessingFile = false
}: ChatProps) {
  const isDesignCodeChat = chatId === "design-code";

  return (
    <div className="flex flex-col h-full bg-zinc-50 rounded-lg">
      <MessagesContainer
        messages={messages}
        chatId={chatId}
      />

      {error && (
        <div className="mx-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex-none bg-white border-t border-zinc-200">
        <div className="space-y-4">
          <ChatInput
            input={input}
            isLoading={isLoading}
            isProcessingFile={isProcessingFile}
            isInitializing={isInitializing}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            onFileSelect={onFileSelect}
          />
          {!isDesignCodeChat && (
            <div className="px-6 pb-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <Info className="h-3 w-3" />
              <span>
                The AI has access to registration documents when available through the USPTO TSDR system.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
