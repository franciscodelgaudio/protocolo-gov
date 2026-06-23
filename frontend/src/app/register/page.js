'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registerUser } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerUser, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-xl font-bold">ProtocoloGov</h1>
          <p className="text-sm text-muted-foreground mt-1">Criar nova conta</p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input id="firstName" name="firstName" placeholder="João" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input id="lastName" name="lastName" placeholder="Silva" required />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Usuário</Label>
            <Input id="username" name="username" placeholder="joaosilva" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="joao@email.com" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required />
          </div>

          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full mt-2" disabled={pending}>
            {pending ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
