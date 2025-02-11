import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top Banner */}
      <div className="bg-gray-50 py-1 text-center text-sm">
        <span className="text-gray-600">Try a better alternative to USPTO search - </span>
        <span className="text-gray-900">Start free</span>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#FF6B2C]">T</span> Trademarks
            </Link>
            <div className="space-x-6">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-6xl font-serif mb-4">
            Trademark Search <span className="italic">Made Simple</span>
            <div className="text-4xl font-normal mt-2">Better than USPTO's TESS</div>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Search trademarks without complex syntax. Get more accurate results instantly.
            <br />
            Save hours of time with our intuitive search interface and AI assistance.
          </p>
          <Link href="/get-started">
            <Button className="bg-[#FF6B2C] hover:bg-[#FF8651] text-white px-8 py-2 text-lg">
              Try it free
            </Button>
          </Link>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 shadow-xl">
            <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
              <Image
                src="/dashboard-preview.png"
                alt="Simple Trademark Search Interface"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-[#FF6B2C] text-sm font-semibold mb-4">WHY SWITCH?</div>
            <h2 className="text-4xl font-serif mb-4">See the difference</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compare the same search on USPTO vs our platform.
              <br />
              Experience clearer results and save valuable time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold">USPTO TESS Search</h3>
                <p className="text-sm text-gray-600">Complex syntax required</p>
              </div>
              <div className="aspect-[4/3] relative">
                <Image
                  src="/uspto-search.png"
                  alt="USPTO Search Example"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden border border-[#FF6B2C]">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold">Our Simple Search</h3>
                <p className="text-sm text-gray-600">Just type your mark</p>
              </div>
              <div className="aspect-[4/3] relative">
                <Image
                  src="/our-search.png"
                  alt="Our Simple Search Interface"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Time-Saving Features</h2>
              <p className="text-xl text-gray-600">
                Everything you need for efficient trademark searching.
                <br />
                No complex syntax required.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Simple Search</h3>
                <p className="text-gray-600">
                  Just type your mark and get instant results. No need to learn complex USPTO search syntax or operators.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Smart Query Generator</h3>
                <p className="text-gray-600">
                  Let our AI generate optimal search queries for you. Save time crafting complex search strings.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">AI Chat Assistant</h3>
                <p className="text-gray-600">
                  Get instant answers about trademark cases and registration documents. No more manual document review.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Accurate Results</h3>
                <p className="text-gray-600">
                  Our advanced matching algorithm finds relevant results that USPTO might miss. Reduce the risk of overlooking conflicts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to save hours on trademark searches?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop wrestling with USPTO's complex search system.
            <br />
            Start finding trademark conflicts faster and more reliably.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-12 bg-[#FF6B2C] hover:bg-[#FF8651] text-white">
              Try it free
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-lg font-semibold">Why legal professionals choose us</p>
          </div>
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold">3x</div>
              <div className="text-sm text-gray-600">Faster Searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-gray-600">Reliable</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

