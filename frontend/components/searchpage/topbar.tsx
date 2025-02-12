'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton } from "@clerk/nextjs"
import { useState } from 'react'
import { FeedbackModal } from '../feedback/feedback-modal'

export default function TopBar() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <header className="bg-[#111318] border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold">
            <span className="text-[#FF6B2C]">T</span>
            <span className="text-white">radeMark Pro</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                Search Interface
              </Button>
            </Link>
            <Link href="/design-code">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                Design Code Assistant
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                Contact
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10"
              onClick={() => setIsFeedbackOpen(true)}
            >
              Send Feedback
            </Button>
            <div className="ml-4">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-[#111318] border border-gray-800",
                    userButtonPopoverActions: "text-gray-300",
                    userButtonPopoverActionButton: "hover:bg-[#FF6B2C]/10",
                  }
                }}
              />
            </div>
          </nav>
        </div>
      </header>

      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  )
}

