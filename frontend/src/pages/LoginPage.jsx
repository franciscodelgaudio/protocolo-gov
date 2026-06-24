import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { mockUsers } from '@/mocks/data.js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, User } from 'lucide-react'

function UserCard({ user, onSelect }) {
  const isAdmin = user.role === 'ADMIN'
  return (
    <button
      onClick={() => onSelect(user)}
      className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-slate-600 group-hover:bg-primary rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
          <span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span>
        </div>
        <div className="overflow-hidden">
          <p className="text-white font-medium text-sm">{user.name}</p>
          <p className="text-slate-400 text-xs truncate">{user.email}</p>
        </div>
      </div>
      {isAdmin && (
        <Badge variant="outline" className="text-blue-300 border-blue-400/40 bg-blue-500/10 text-xs">
          Administrador
        </Badge>
      )}
    </button>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleLogin(user) {
    login(user)
    navigate('/dashboard')
  }

  const citizens = mockUsers.filter((u) => u.role === 'USER')
  const admins = mockUsers.filter((u) => u.role === 'ADMIN')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">PG</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Protocolo Gov</h1>
          <p className="text-slate-400 mt-2 text-base">Sistema de Gerenciamento de Solicitações</p>
          <p className="text-slate-500 text-sm mt-1">Selecione um perfil para entrar no sistema</p>
        </div>

        {/* Cidadãos */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User size={13} /> Cidadãos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {citizens.map((u) => (
              <UserCard key={u.id} user={u} onSelect={handleLogin} />
            ))}
          </div>
        </section>

        {/* Administradores */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck size={13} /> Administradores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {admins.map((u) => (
              <UserCard key={u.id} user={u} onSelect={handleLogin} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
