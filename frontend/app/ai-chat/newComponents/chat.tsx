"use client";

import { MessagesContainer } from "./messages-container";
import { ChatInput } from "./chat-input";

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
  error: string | null;
  chatId: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export function Chat({
  messages,
  input,
  isLoading,
  error,
  chatId,
  onInputChange,
  onSubmit
}: ChatProps) {
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

      <div className="flex-none p-6 bg-white border-t border-zinc-200">
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
