"use client"

import { Card } from "@/components/ui/card"

interface ChatHeaderProps {
  markIdentification: string
}

export function ChatHeader({ markIdentification }: ChatHeaderProps) {
  return (
    <Card className="w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
        {markIdentification}
      </h2>
    </Card>
  )
} 