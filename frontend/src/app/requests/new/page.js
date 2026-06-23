import Link from 'next/link'
import { createRequest } from '../../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewRequestPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <Link href="/requests" className="text-sm text-muted-foreground hover:underline">
          ← Voltar
        </Link>
        <h2 className="text-2xl font-bold mt-2">Nova solicitação</h2>
      </div>

      <form action={createRequest} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" placeholder="Nome da solicitação" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Descreva a solicitação"
            rows={4}
          />
        </div>
        <Button type="submit" className="w-full">
          Criar solicitação
        </Button>
      </form>
    </div>
  )
}
