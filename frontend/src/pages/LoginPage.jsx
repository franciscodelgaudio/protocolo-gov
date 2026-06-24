import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { getUserById } from '@/services/api.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const user = await getUserById(userId)
      login(user)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.status === 404
          ? 'Usuário não encontrado. Verifique o ID informado.'
          : err.message ?? 'Erro ao conectar com o servidor.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">PG</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Protocolo Gov</h1>
          <p className="text-slate-400 mt-2 text-sm">Sistema de Gerenciamento de Solicitações</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 border border-white/10 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="userId" className="text-slate-200">
                ID do Usuário
              </Label>
              <Input
                id="userId"
                type="number"
                min="1"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Ex: 1"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-primary"
              />
              <p className="text-xs text-slate-500">
                Informe o ID do seu cadastro no sistema.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Sem conta? Peça ao administrador para cadastrá-lo.
        </p>
      </div>
    </div>
  )
}
