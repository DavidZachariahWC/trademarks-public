import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-[#0A0C10] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-8 text-gray-400 hover:text-white">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">Search Comparison Examples</h1>
          <p className="text-xl text-gray-400">
            See how our platform simplifies trademark searches compared to USPTO&apos;s TESS system.
          </p>
        </div>

        {/* Examples Container */}
        <div className="grid gap-16">
          {/* Placeholder for examples */}
          <div className="text-center text-gray-400 py-12 border border-dashed border-gray-800 rounded-lg">
            More examples coming soon...
          </div>
        </div>
      </div>
    </main>
  )
} 