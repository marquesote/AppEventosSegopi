import type { EventStatus } from '@/types/database'

interface EventStatusBadgeProps {
  status: EventStatus
}

const statusConfig: Record<EventStatus, { label: string; className: string }> = {
  draft: { label: 'Borrador', className: 'bg-gray-100 text-gray-700' },
  published: { label: 'Publicado', className: 'bg-success-50 text-success-700' },
  closed: { label: 'Inscripciones cerradas', className: 'bg-warning-50 text-warning-700' },
  completed: { label: 'Finalizado', className: 'bg-primary-50 text-primary-700' },
  cancelled: { label: 'Cancelado', className: 'bg-error-50 text-error-700' },
}

export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
