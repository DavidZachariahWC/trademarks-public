// /app/ai-chat/layout.tsx
"use client"

import { CaseInfoFloat } from "./newComponents/case-info-float"

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <main className="flex-1 flex items-center justify-center overflow-hidden relative">
        <div className="w-full max-w-3xl h-full px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  )
} 