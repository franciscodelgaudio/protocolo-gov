import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const { login, register } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">PG</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Protocolo Gov</h1>
          <p className="text-slate-400 mt-2 text-sm">Sistema de Gerenciamento de Solicitações</p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-xl p-6 space-y-4">
          <Button type="button" onClick={login} className="w-full">
            <LogIn size={16} />
            Entrar com Keycloak
          </Button>

          <p className="text-center text-slate-500 text-sm">
            Sem conta?{' '}
            <button
              type="button"
              onClick={register}
              className="text-slate-300 hover:text-white underline underline-offset-2"
            >
              Criar conta no Keycloak
            </button>
          </p>
        </div>

        <p className="text-center text-slate-500 text-xs mt-5">
          O usuário também precisa existir no banco local com o mesmo e-mail.
        </p>

        <p className="text-center text-slate-600 text-xs mt-2">
          <Link to="/dashboard" className="hover:text-slate-400">Voltar ao sistema</Link>
        </p>
      </div>
    </div>
  )
}
