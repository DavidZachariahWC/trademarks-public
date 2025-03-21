// /app/design-code/layout.tsx
"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const params = useParams()
  const serialNumber = params.serialNumber as string

  /** former header
   * 
   * <header className="w-full bg-white border-b border-zinc-200 flex-none">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-zinc-900">
            Design Code Assistant
          </h1>
          <Link href="/">
            <Button className="text-sm bg-zinc-900 hover:bg-zinc-800 text-white">
              Return to Search Page →
            </Button>
          </Link>
        </div>
      </header>
   */


  return (
    <div className="flex flex-col h-dvh bg-white">
      

      <main className="flex-1 flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-3xl h-full px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  )
} 