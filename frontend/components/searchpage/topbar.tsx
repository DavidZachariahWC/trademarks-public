import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TopBar() {
  return (
    <header className="bg-[#111318] border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          <span className="text-[#FF6B2C]">T</span>
          <span className="text-white">radeMark Pro</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                  Search Interface
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/design-code">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                  Design Code Assistant
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#FF6B2C]/10">
                  Contact
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

