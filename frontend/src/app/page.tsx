import SearchPage from '../components/SearchPage'
import TopBar from '../components/topbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Trademark Search</h1>
        <SearchPage />
      </div>
    </main>
  )
}

