import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { getRequests, createRequest, deleteRequest, formatDate } from '@/services/api.js'
import Layout from '@/components/Layout.jsx'
import StatusBadge from '@/components/StatusBadge.jsx'
import Pagination from '@/components/Pagination.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Eye, FileText, Loader2 } from 'lucide-react'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'ACCEPTED', label: 'Aceitas' },
  { value: 'REJECTED', label: 'Rejeitadas' },
]

const PAGE_SIZE = 8

export default function RequestsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    getRequests({ userId: user.id, page, size: PAGE_SIZE, status: statusFilter })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.id, page, statusFilter])

  useEffect(() => { load() }, [load])

  function handleFilterChange(val) {
    setStatusFilter(val)
    setPage(0)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await createRequest({ name: form.name, description: form.description, userId: user.id })
      setShowModal(false)
      setForm({ name: '', description: '' })
      setPage(0)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir esta solicitação?')) return
    try {
      await deleteRequest(id, user.id)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? 'Solicitações' : 'Minhas Solicitações'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? 'Gerencie todas as solicitações do sistema.' : 'Acompanhe e crie suas solicitações.'}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Nova Solicitação
        </Button>
      </div>

      <div className="flex gap-1 mb-4 bg-muted p-1 rounded-lg w-fit">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
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
              <FileText size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma solicitação encontrada</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="hidden md:table-cell">Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-muted-foreground">{r.id}</TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-muted-foreground truncate max-w-xs text-sm">{r.description}</p>
                      </TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {formatDate(r.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/solicitacoes/${r.id}`} title="Ver detalhes"><Eye size={16} /></Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(r.id)}
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

      <Dialog open={showModal} onOpenChange={(open) => { if (!open) { setShowModal(false); setError('') } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Solicitação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="px-6 pb-2 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="req-name">Nome</Label>
              <Input
                id="req-name"
                required
                minLength={3}
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Certidão de nascimento"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="req-desc">Descrição</Label>
              <Textarea
                id="req-desc"
                required
                maxLength={500}
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descreva detalhes da solicitação..."
              />
              <p className="text-xs text-muted-foreground text-right">{form.description.length}/500</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowModal(false); setError('') }}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Criar Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
