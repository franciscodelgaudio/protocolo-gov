import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRequest, getProcesses } from '@/lib/api'
import { createProcess } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const statusColors = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  EM_ANALISE: 'bg-blue-100 text-blue-800',
  APROVADO: 'bg-green-100 text-green-800',
  REJEITADO: 'bg-red-100 text-red-800',
  FINALIZADO: 'bg-gray-100 text-gray-800',
}

export default async function RequestDetailPage({ params }) {
  const { id } = await params
  const [request, processes] = await Promise.all([getRequest(id), getProcesses()])

  if (!request) notFound()

  const linkedProcess = processes.find((p) => p.requestId === request.id)

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/requests" className="text-sm text-muted-foreground hover:underline">← Voltar</Link>
        <h2 className="text-2xl font-bold mt-2">{request.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {request.createdAt ? new Date(request.createdAt).toLocaleDateString('pt-BR') : '—'}
        </p>
      </div>

      {request.description && (
        <div className="mb-6 rounded-md border p-4">
          <p className="text-sm">{request.description}</p>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-base font-semibold mb-4">Processo administrativo</h3>
        {linkedProcess ? (
          <div className="rounded-md border p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{linkedProcess.name}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[linkedProcess.status] || 'bg-gray-100 text-gray-800'}`}>
                {linkedProcess.status}
              </span>
            </div>
            <Link href={`/processes/${linkedProcess.id}`}>
              <Button variant="outline" size="sm">Ver processo</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-md border p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Nenhum processo vinculado. Crie um processo para esta solicitação.
            </p>
            <form action={createProcess} className="flex flex-col gap-3">
              <input type="hidden" name="requestId" value={request.id} />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="proc-name">Nome do processo</Label>
                <Input id="proc-name" name="name" placeholder="Nome do processo" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="proc-desc">Descrição</Label>
                <Textarea id="proc-desc" name="description" placeholder="Descrição do processo" rows={3} />
              </div>
              <Button type="submit">Criar processo</Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
