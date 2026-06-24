import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { getRequests, getProcesses, formatDate } from '@/services/api.js'
import Layout from '@/components/Layout.jsx'
import StatusBadge from '@/components/StatusBadge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { FileText, Clock, CheckCircle, XCircle, Briefcase, ArrowRight, Loader2 } from 'lucide-react'

function StatCard({ icon: Icon, label, value, iconClass }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
            <Icon size={22} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value ?? '—'}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [requestsData, setRequestsData] = useState(null)
  const [processesData, setProcessesData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const promises = [
      getRequests({ size: 100 }).then(setRequestsData),
    ]
    if (isAdmin) promises.push(getProcesses({ size: 100 }).then(setProcessesData))
    Promise.all(promises).finally(() => setLoading(false))
  }, [isAdmin])

  const content = requestsData?.content ?? []
  const total = requestsData?.totalElements ?? 0
  const pending = content.filter((r) => r.status === 'PENDING').length
  const accepted = content.filter((r) => r.status === 'ACCEPTED').length
  const rejected = content.filter((r) => r.status === 'REJECTED').length
  const totalProcesses = processesData?.totalElements ?? 0
  const inProgress = processesData?.content.filter((p) => p.status === 'IN_PROGRESS').length ?? 0

  const recent = content.slice(0, 5)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {(user.name ?? 'Usuario').split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isAdmin ? 'Visão geral do sistema de protocolos.' : 'Acompanhe suas solicitações abaixo.'}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 size={24} className="animate-spin mr-2" /> Carregando...
        </div>
      ) : (
        <>
          <div className={`grid gap-4 mb-8 ${isAdmin ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2'}`}>
            <StatCard icon={FileText} label="Total de Solicitações" value={total} iconClass="bg-slate-600" />
            <StatCard icon={Clock} label="Pendentes" value={pending} iconClass="bg-yellow-500" />
            <StatCard icon={CheckCircle} label="Aceitas" value={accepted} iconClass="bg-green-500" />
            <StatCard icon={XCircle} label="Rejeitadas" value={rejected} iconClass="bg-red-500" />
            {isAdmin && <StatCard icon={Briefcase} label="Total de Processos" value={totalProcesses} iconClass="bg-primary" />}
            {isAdmin && <StatCard icon={Briefcase} label="Em Andamento" value={inProgress} iconClass="bg-indigo-500" />}
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Solicitações Recentes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/solicitacoes" className="flex items-center gap-1 text-primary">
                  Ver todas <ArrowRight size={14} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {recent.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma solicitação encontrada</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">{r.description}</p>
                        </TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/solicitacoes/${r.id}`} className="text-primary">Ver</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  )
}
