import TrademarkSearch from '../components/TrademarkSearch'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Trademark Search</h1>
        <TrademarkSearch />
      </div>
    </main>
  )
}

