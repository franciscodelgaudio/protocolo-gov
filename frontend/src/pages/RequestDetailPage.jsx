import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import {
  getRequestById, acceptRequest, rejectRequest, createProcessFromRequest, formatDate,
} from '@/services/api.js'
import Layout from '@/components/Layout.jsx'
import StatusBadge from '@/components/StatusBadge.jsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowLeft, CheckCircle, XCircle, Briefcase, Calendar, Loader2, FileText,
} from 'lucide-react'

export default function RequestDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'ADMIN'

  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [processForm, setProcessForm] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  function load() {
    setLoading(true)
    setError('')
    getRequestById(id, user.id)
      .then(setRequest)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id, user.id])

  async function handleAccept() {
    setActionLoading('accept')
    try {
      const updated = await acceptRequest(id, user.id)
      setRequest((r) => ({ ...r, status: updated.status }))
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject() {
    if (!confirm('Confirmar rejeição desta solicitação?')) return
    setActionLoading('reject')
    try {
      const updated = await rejectRequest(id, user.id)
      setRequest((r) => ({ ...r, status: updated.status }))
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCreateProcess(e) {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      const newProcess = await createProcessFromRequest(id, {
        name: processForm.name,
        description: processForm.description,
        userId: user.id,
      })
      setRequest((r) => ({ ...r, process: newProcess }))
      setShowProcessModal(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  function openProcessModal() {
    setProcessForm({ name: `Processo: ${request?.name}`, description: '' })
    setFormError('')
    setShowProcessModal(true)
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

  if (error || !request) {
    return (
      <Layout>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ArrowLeft size={16} /> Voltar
        </Button>
        <p className="text-center py-12 text-destructive">{error || 'Solicitação não encontrada.'}</p>
      </Layout>
    )
  }

  const canAccept = isAdmin && request.status === 'PENDING'
  const canReject = isAdmin && (request.status === 'PENDING' || request.status === 'ACCEPTED')
  const canCreateProcess = isAdmin && request.status === 'ACCEPTED' && !request.process

  return (
    <Layout>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
        <ArrowLeft size={16} /> Voltar
      </Button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{request.name}</h1>
            <StatusBadge status={request.status} />
          </div>
          <p className="text-muted-foreground text-sm">Solicitação #{request.id}</p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {canAccept && (
              <Button
                onClick={handleAccept}
                disabled={actionLoading !== null}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {actionLoading === 'accept' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                Aceitar
              </Button>
            )}
            {canReject && (
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={actionLoading !== null}
              >
                {actionLoading === 'reject' ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                Rejeitar
              </Button>
            )}
            {canCreateProcess && (
              <Button onClick={openProcessModal}>
                <Briefcase size={15} /> Criar Processo
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{request.description}</p>
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
                  <p className="text-sm font-medium">{formatDate(request.createdAt)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText size={15} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1"><StatusBadge status={request.status} /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {request.process ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Briefcase size={14} className="text-primary" /> Processo Vinculado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium">{request.process.name}</p>
                <StatusBadge status={request.process.status} />
                {isAdmin && (
                  <div className="pt-1">
                    <Button variant="link" size="sm" asChild className="px-0 text-primary">
                      <Link to={`/processos/${request.process.id}`}>Ver processo →</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : request.status === 'ACCEPTED' && isAdmin ? (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-5">
                <p className="text-sm font-medium text-primary mb-1">Nenhum processo criado</p>
                <p className="text-xs text-muted-foreground">Aguarda criação de processo.</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <Dialog open={showProcessModal} onOpenChange={(open) => { if (!open) setShowProcessModal(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Processo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProcess} className="px-6 pb-2 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="proc-name">Nome do Processo</Label>
              <Input
                id="proc-name"
                required
                minLength={3}
                maxLength={100}
                value={processForm.name}
                onChange={(e) => setProcessForm({ ...processForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="proc-desc">Descrição</Label>
              <Textarea
                id="proc-desc"
                required
                maxLength={500}
                rows={4}
                value={processForm.description}
                onChange={(e) => setProcessForm({ ...processForm, description: e.target.value })}
                placeholder="Descreva o processo..."
              />
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessModal(false)}>Cancelar</Button>
            <Button onClick={handleCreateProcess} disabled={submitting}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Criar Processo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
