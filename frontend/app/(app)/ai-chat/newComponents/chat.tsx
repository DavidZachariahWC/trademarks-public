"use client";

import { MessagesContainer } from "./messages-container";
import { ChatInput } from "./chat-input";
import { Info, Loader2 } from "lucide-react";

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
  isInitializing: boolean;
  error: any;
  chatId: string;
  onInputChange: (value: string) => void;
  onSubmit: (message?: string, isInitialMessage?: boolean) => void;
  onFileSelect: (file: File) => Promise<void> | void;
  showThinking: boolean;
  isFirstLoad: boolean;
  placeholder?: string;
}

export function Chat({
  messages,
  input,
  isLoading,
  isInitializing,
  error,
  chatId,
  onInputChange,
  onSubmit,
  onFileSelect,
  showThinking,
  isFirstLoad,
  placeholder
}: ChatProps) {
  const isDesignCodeChat = chatId === "design-code";

  return (
    <div className="flex flex-col w-full h-[845px] min-h-[845px] max-h-[845px]">
      <MessagesContainer
        messages={messages}
        chatId={chatId}
        showThinking={showThinking}
      />

      {error && (
        <div className="mx-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="p-4">
        {isFirstLoad && isLoading ? (
          <div className="flex items-center justify-center p-4 text-md text-zinc-600">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            The AI is synthesizing your summary. Please wait.
          </div>
        ) : (
          <ChatInput
            input={input}
            isLoading={isLoading}
            isProcessingFile={false}
            onSubmit={onSubmit}
            onChange={onInputChange}
            onFileSelect={onFileSelect}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
