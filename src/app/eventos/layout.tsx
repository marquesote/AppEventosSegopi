import { Navbar } from '@/components/public/Navbar'

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
