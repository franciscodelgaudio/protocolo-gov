import Link from 'next/link'
import { getRequests } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { deleteRequest } from '@/app/actions'

export default async function RequestsPage() {
  const requests = await getRequests()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Solicitações</h2>
        <Link href="/requests/new">
          <Button>Nova solicitação</Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma solicitação cadastrada.</p>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Descrição</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/requests/${req.id}`} className="hover:underline">{req.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {req.description || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {req.createdAt ? new Date(req.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <form action={deleteRequest.bind(null, req.id)}>
                      <button type="submit" className="text-xs text-destructive hover:underline">
                        Excluir
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
