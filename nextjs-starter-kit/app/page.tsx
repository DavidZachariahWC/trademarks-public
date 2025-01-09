import SearchPage from '@/components/searchpage/SearchPage'
import TopBar from '@/components/searchpage/topbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
      <SearchPage />
    </main>
  )
}

