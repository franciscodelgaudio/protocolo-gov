import { Geist } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import Sidebar from '@/components/Sidebar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata = {
  title: 'ProtocoloGov',
  description: 'Sistema de Gestão de Processos Administrativos',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex">
        <AuthProvider session={session}>
          <Sidebar />
          <main className="flex-1 p-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
