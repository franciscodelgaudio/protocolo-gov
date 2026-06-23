import Link from 'next/link'
import { getProcesses } from '@/lib/api'

const statusColors = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  EM_ANALISE: 'bg-blue-100 text-blue-800',
  APROVADO: 'bg-green-100 text-green-800',
  REJEITADO: 'bg-red-100 text-red-800',
  FINALIZADO: 'bg-gray-100 text-gray-800',
}

export default async function ProcessesPage() {
  const processes = await getProcesses()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Processos</h2>

      {processes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum processo cadastrado. Crie um a partir de uma{' '}
          <Link href="/requests" className="underline">solicitação</Link>.
        </p>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {processes.map((proc) => (
                <tr key={proc.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/processes/${proc.id}`} className="hover:underline">{proc.name}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[proc.status] || 'bg-gray-100 text-gray-800'}`}>
                      {proc.status || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {proc.createdAt ? new Date(proc.createdAt).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/processes/${proc.id}`} className="text-xs text-primary hover:underline">Ver</Link>
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
