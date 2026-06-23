import Sidebar from '@/components/Sidebar'

export default function ProtectedLayout({ children }) {
  return (
    <div className="flex min-h-full">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
