import { Sidebar } from '@/components/layout/sidebar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  )
}
