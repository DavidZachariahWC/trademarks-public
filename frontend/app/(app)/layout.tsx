import TopBar from '@/components/searchpage/topbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      {children}
    </div>
  )
}