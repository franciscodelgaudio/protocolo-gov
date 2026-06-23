import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProcess } from '@/lib/api'
import { updateProcessStatus } from '../../actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const statusColors = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  EM_ANALISE: 'bg-blue-100 text-blue-800',
  APROVADO: 'bg-green-100 text-green-800',
  REJEITADO: 'bg-red-100 text-red-800',
  FINALIZADO: 'bg-gray-100 text-gray-800',
}

const statusOptions = ['PENDENTE', 'EM_ANALISE', 'APROVADO', 'REJEITADO', 'FINALIZADO']

export default async function ProcessDetailPage({ params }) {
  const { id } = await params
  const process = await getProcess(id)

  if (!process) notFound()

  const updateAction = updateProcessStatus.bind(null, process.id)

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/processes" className="text-sm text-muted-foreground hover:underline">
          ← Voltar
        </Link>
        <h2 className="text-2xl font-bold mt-2">{process.name}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {process.createdAt
            ? new Date(process.createdAt).toLocaleDateString('pt-BR')
            : '—'}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Status atual:</span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[process.status] || 'bg-gray-100 text-gray-800'}`}
        >
          {process.status || '—'}
        </span>
      </div>

      {process.description && (
        <div className="mb-6 rounded-md border p-4">
          <p className="text-sm">{process.description}</p>
        </div>
      )}

      <div className="rounded-md border p-4">
        <h3 className="text-sm font-semibold mb-3">Atualizar status</h3>
        <form action={updateAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Novo status</Label>
            <Select name="status" defaultValue={process.status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </div>

      {process.requestId && (
        <div className="mt-4">
          <Link
            href={`/requests/${process.requestId}`}
            className="text-sm text-primary hover:underline"
          >
            ← Ver solicitação vinculada
          </Link>
        </div>
      )}
    </div>
  )
}
