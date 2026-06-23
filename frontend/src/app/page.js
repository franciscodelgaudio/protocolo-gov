import Link from 'next/link'
import { getRequests, getProcesses } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusColors = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  EM_ANALISE: 'bg-blue-100 text-blue-800',
  APROVADO: 'bg-green-100 text-green-800',
  REJEITADO: 'bg-red-100 text-red-800',
  FINALIZADO: 'bg-gray-100 text-gray-800',
}

export default async function DashboardPage() {
  const [requests, processes] = await Promise.all([getRequests(), getProcesses()])

  const byStatus = processes.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{requests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{processes.length}</p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(byStatus).length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Processos por status</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byStatus).map(([status, count]) => (
              <span
                key={status}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
              >
                {status} <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Solicitações recentes</h3>
          <Link href="/requests" className="text-xs text-primary hover:underline">
            Ver todas
          </Link>
        </div>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma solicitação cadastrada.</p>
        ) : (
          <div className="rounded-md border">
            {requests.slice(0, 5).map((req) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
                className="flex items-center justify-between px-4 py-3 border-b last:border-0 hover:bg-muted/40 transition-colors"
              >
                <span className="text-sm font-medium">{req.name}</span>
                <span className="text-xs text-muted-foreground">
                  {req.createdAt ? new Date(req.createdAt).toLocaleDateString('pt-BR') : '—'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
