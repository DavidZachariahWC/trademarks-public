import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TopBar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          TradeMark Pro
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Button variant="ghost">Home</Button></li>
            <li><Button variant="ghost">About</Button></li>
            <li><Button variant="ghost">Contact</Button></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

