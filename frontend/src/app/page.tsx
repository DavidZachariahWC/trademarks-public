import SearchPage from '../components/SearchPage'
import TopBar from '../components/topbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
        <SearchPage />
    </main>
  )
}

