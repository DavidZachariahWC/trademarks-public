import TopBar from '@/components/searchpage/topbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0A0C10]">
      <TopBar />
      <div className="bg-gray-50">
        {children}
      </div>
    </div>
  )
}