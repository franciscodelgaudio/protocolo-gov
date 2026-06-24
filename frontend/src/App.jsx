import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext.jsx'

import LoginPage from '@/pages/LoginPage.jsx'
import RegisterPage from '@/pages/RegisterPage.jsx'
import DashboardPage from '@/pages/DashboardPage.jsx'
import RequestsPage from '@/pages/RequestsPage.jsx'
import RequestDetailPage from '@/pages/RequestDetailPage.jsx'
import ProcessesPage from '@/pages/ProcessesPage.jsx'
import ProcessDetailPage from '@/pages/ProcessDetailPage.jsx'
import UsersPage from '@/pages/UsersPage.jsx'

function RequireAuth({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/cadastro" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />

      <Route path="/solicitacoes" element={<RequireAuth><RequestsPage /></RequireAuth>} />
      <Route path="/solicitacoes/:id" element={<RequireAuth><RequestDetailPage /></RequireAuth>} />

      <Route path="/processos" element={<RequireAdmin><ProcessesPage /></RequireAdmin>} />
      <Route path="/processos/:id" element={<RequireAdmin><ProcessDetailPage /></RequireAdmin>} />

      <Route path="/usuarios" element={<RequireAdmin><UsersPage /></RequireAdmin>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
