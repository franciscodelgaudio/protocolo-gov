import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { getProcesses, deleteProcess } from '@/services/api.js'
import Layout from '@/components/Layout.jsx'
import StatusBadge from '@/components/StatusBadge.jsx'
import Pagination from '@/components/Pagination.jsx'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Eye, Trash2, Briefcase, Loader2 } from 'lucide-react'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'COMPLETED', label: 'Concluídos' },
  { value: 'CANCELLED', label: 'Cancelados' },
]

const PAGE_SIZE = 8

export default function ProcessesPage() {
  const { user } = useAuth()

  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    getProcesses({ userId: user.id, page, size: PAGE_SIZE, status: statusFilter })
      .then(setData)
      .finally(() => setLoading(false))
  }, [user.id, page, statusFilter])

  useEffect(() => { load() }, [load])

  async function handleDelete(id) {
    if (!confirm('Excluir este processo?')) return
    await deleteProcess(id, user.id)
    load()
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Processos</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie os processos abertos no sistema.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 bg-muted p-1 rounded-lg w-fit flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setStatusFilter(f.value); setPage(0) }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 size={24} className="animate-spin mr-2" /> Carregando...
            </div>
          ) : data.content.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Briefcase size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhum processo encontrado</p>
              <p className="text-xs mt-1">Processos são criados a partir de solicitações aceitas.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">Solicitação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-muted-foreground">{p.id}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs hidden md:block">{p.description}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {p.request ? (
                          <Link
                            to={`/solicitacoes/${p.request.id}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {p.request.name}
                          </Link>
                        ) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{p.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/processos/${p.id}`} title="Ver detalhes"><Eye size={16} /></Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(p.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination
                page={page}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                size={PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}
