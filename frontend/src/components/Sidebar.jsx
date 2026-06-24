import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, Briefcase, Users, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-white/15 text-white'
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">PG</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Protocolo Gov</p>
            <p className="text-slate-400 text-xs leading-tight">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" className={navLinkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/solicitacoes" className={navLinkClass}>
          <FileText size={18} />
          {isAdmin ? 'Solicitações' : 'Minhas Solicitações'}
        </NavLink>

        {isAdmin && (
          <NavLink to="/processos" className={navLinkClass}>
            <Briefcase size={18} />
            Processos
          </NavLink>
        )}

        {isAdmin && (
          <NavLink to="/usuarios" className={navLinkClass}>
            <Users size={18} />
            Usuários
          </NavLink>
        )}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-slate-200 text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs truncate">{isAdmin ? 'Administrador' : 'Cidadão'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
