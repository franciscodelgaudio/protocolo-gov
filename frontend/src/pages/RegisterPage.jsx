import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { createUser } from '@/services/api.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await createUser(form)
      login(user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message ?? 'Erro ao criar usuário.')
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
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="text-slate-400 mt-2 text-sm">Protocolo Gov — Sistema de Gestão</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 border border-white/10 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-slate-200">Nome</Label>
              <Input
                id="name"
                required
                minLength={3}
                maxLength={20}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Seu nome completo"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-200">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="seu@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-slate-200">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                maxLength={100}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-200">Tipo de Conta</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'USER', label: 'Cidadão' },
                  { value: 'ADMIN', label: 'Administrador' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set('role', opt.value)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.role === opt.value
                        ? 'bg-primary border-primary text-white'
                        : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Criar Conta
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-5">
          Já tem conta?{' '}
          <Link to="/login" className="text-slate-300 hover:text-white underline underline-offset-2">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
