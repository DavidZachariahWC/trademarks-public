import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export function MarketingNav() {
  return (
    <header className="bg-[#111318] border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <span className="text-[#FF6B2C]">T</span>
          <span className="text-white">radeMark Pro</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/features">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
              Features
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
              Pricing
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
              About
            </Button>
          </Link>
          
          <SignedIn>
            <div className="flex items-center space-x-4 ml-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                  Dashboard
                </Button>
              </Link>
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
          </SignedIn>

          <SignedOut>
            <div className="flex items-center space-x-2 ml-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </SignedOut>
        </nav>
      </div>
    </header>
  )
}