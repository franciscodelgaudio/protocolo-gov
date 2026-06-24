import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProcessById, updateProcessStatus, formatDate } from '@/services/api.js'
import Layout from '@/components/Layout.jsx'
import StatusBadge from '@/components/StatusBadge.jsx'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Calendar, FileText, Loader2, RefreshCw } from 'lucide-react'

const PROCESS_STATUSES = [
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export default function ProcessDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [process, setProcess] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLoading(true)
    getProcessById(id)
      .then((p) => { setProcess(p); setNewStatus(p.status) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleStatusUpdate() {
    if (newStatus === process.status) return
    setUpdating(true)
    try {
      const updated = await updateProcessStatus(id, { status: newStatus })
      setProcess(updated)
      setNewStatus(updated.status)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 size={24} className="animate-spin mr-2" /> Carregando...
        </div>
      </Layout>
    )
  }

  if (error || !process) {
    return (
      <Layout>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ArrowLeft size={16} /> Voltar
        </Button>
        <p className="text-center py-12 text-destructive">{error || 'Processo não encontrado.'}</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
        <ArrowLeft size={16} /> Voltar
      </Button>

      <div className="flex items-start gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{process.name}</h1>
            <StatusBadge status={process.status} />
          </div>
          <p className="text-muted-foreground text-sm">Processo #{process.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{process.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Atualizar Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label>Novo Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROCESS_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === process.status}
                >
                  {updating ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
                  {saved ? 'Salvo!' : 'Atualizar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar size={15} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="text-sm font-medium">{formatDate(process.createdAt)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText size={15} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Status atual</p>
                  <div className="mt-1"><StatusBadge status={process.status} /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {process.request && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Solicitação Vinculada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-2">{process.request.name}</p>
                <Button variant="link" size="sm" asChild className="px-0 text-primary">
                  <Link to={`/solicitacoes/${process.request.id}`}>Ver solicitação →</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
