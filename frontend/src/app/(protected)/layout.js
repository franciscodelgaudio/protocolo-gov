import AppSidebar from '@/components/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function ProtectedLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-8">
        <SidebarTrigger className="mb-4" />
        {children}
      </main>
    </SidebarProvider>
  )
}
