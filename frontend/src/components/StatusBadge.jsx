import { Badge } from '@/components/ui/badge'

const VARIANT_MAP = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

const LABEL_MAP = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceita',
  REJECTED: 'Rejeitada',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
}

export default function StatusBadge({ status }) {
  return (
    <Badge variant={VARIANT_MAP[status] ?? 'outline'}>
      {LABEL_MAP[status] ?? status}
    </Badge>
  )
}
