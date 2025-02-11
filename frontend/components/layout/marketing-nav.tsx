import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function MarketingNav() {
  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#111318] py-1 text-center text-sm">
        <span className="text-gray-400">Try a better alternative to USPTO search - </span>
        <span className="text-white">Start free</span>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#FF6B2C]">T</span> Trademarks
            </Link>
            <div className="space-x-6">
              <Link href="/features" className="text-gray-300 hover:text-white">Features</Link>
              <Link href="/examples" className="text-gray-300 hover:text-white">Why We're Better</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/get-started">
              <Button className="bg-[#FF6B2C] hover:bg-[#FF8651] text-white">
                Try it free
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}