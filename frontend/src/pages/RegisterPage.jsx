import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">PG</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="text-slate-400 mt-2 text-sm">Cadastro gerenciado pelo Keycloak</p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-xl p-6 space-y-4">
          <Button type="button" onClick={register} className="w-full">
            <UserPlus size={16} />
            Criar conta no Keycloak
          </Button>

          <p className="text-center text-slate-500 text-sm">
            Já tem conta?{' '}
            <Link to="/login" className="text-slate-300 hover:text-white underline underline-offset-2">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
