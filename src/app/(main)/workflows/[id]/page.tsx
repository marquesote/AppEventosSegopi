import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getWorkflowById,
  getWorkflowExecutions,
} from '@/features/workflows/services/workflowService'
import type { WorkflowExecutionStatus } from '@/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

const statusConfig: Record<WorkflowExecutionStatus, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-gray-100 text-gray-600' },
  sent: { label: 'Enviado', className: 'bg-blue-50 text-blue-700' },
  delivered: { label: 'Entregado', className: 'bg-indigo-50 text-indigo-700' },
  opened: { label: 'Abierto', className: 'bg-green-50 text-green-700' },
  clicked: { label: 'Clic', className: 'bg-emerald-50 text-emerald-700' },
  bounced: { label: 'Rebotado', className: 'bg-orange-50 text-orange-700' },
  failed: { label: 'Fallido', className: 'bg-red-50 text-red-700' },
}

function StatusBadge({ status }: { status: WorkflowExecutionStatus }) {
  const cfg = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { id } = await params
  const [workflow, executions] = await Promise.all([
    getWorkflowById(id),
    getWorkflowExecutions(id),
  ])

  if (!workflow) notFound()

  const sentCount = executions.filter(e => e.status !== 'pending' && e.status !== 'failed').length
  const openedCount = executions.filter(e => e.opened_at !== null).length
  const failedCount = executions.filter(e => e.status === 'failed').length

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/workflows" className="text-sm text-foreground-secondary hover:text-foreground flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Workflows
        </Link>
        <h1 className="heading text-2xl text-foreground">{workflow.name}</h1>
        {workflow.description && (
          <p className="text-foreground-secondary mt-1">{workflow.description}</p>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <p className="text-foreground-secondary text-sm mb-1">Total ejecutadas</p>
          <p className="text-2xl font-bold text-foreground">{executions.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-foreground-secondary text-sm mb-1">Abiertos</p>
          <p className="text-2xl font-bold text-green-600">{openedCount}</p>
          <p className="text-xs text-foreground-muted mt-1">
            {sentCount > 0 ? `${Math.round((openedCount / sentCount) * 100)}% tasa` : '—'}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-foreground-secondary text-sm mb-1">Fallidos</p>
          <p className="text-2xl font-bold text-red-600">{failedCount}</p>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="card-elevated p-6 mb-6">
        <h2 className="heading text-base mb-4">Configuracion del Workflow</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-foreground-secondary">Disparador</dt>
            <dd className="font-medium mt-0.5 capitalize">{workflow.trigger_type.replace('_', ' ')}</dd>
          </div>
          <div>
            <dt className="text-foreground-secondary">Offset</dt>
            <dd className="font-medium mt-0.5">
              {workflow.trigger_offset_hours !== null ? `${workflow.trigger_offset_hours}h` : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-foreground-secondary">Audiencia</dt>
            <dd className="font-medium mt-0.5 capitalize">{workflow.target_audience.replace('_', ' ')}</dd>
          </div>
          <div>
            <dt className="text-foreground-secondary">Estado</dt>
            <dd className="mt-0.5">
              <span className={`font-medium ${workflow.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                {workflow.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Execution History */}
      <div className="card-elevated overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light">
          <h2 className="heading text-base">Historial de Ejecuciones</h2>
        </div>
        {executions.length === 0 ? (
          <div className="p-8 text-center text-foreground-secondary text-sm">
            No hay ejecuciones registradas para este workflow
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Inscrito</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Enviado</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Abierto</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((exec) => {
                const reg = exec.registration as { first_name?: string; last_name?: string; email?: string } | undefined
                return (
                  <tr key={exec.id} className="border-b border-border-light hover:bg-primary-50/20 transition-colors">
                    <td className="px-6 py-3">
                      {reg ? (
                        <div>
                          <p className="font-medium text-sm">{reg.first_name} {reg.last_name}</p>
                          <p className="text-xs text-foreground-muted">{reg.email}</p>
                        </div>
                      ) : (
                        <span className="text-foreground-muted text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={exec.status} />
                      {exec.error_message && (
                        <p className="text-xs text-red-500 mt-1 max-w-xs truncate">{exec.error_message}</p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-foreground-secondary">
                      {formatDate(exec.sent_at)}
                    </td>
                    <td className="px-6 py-3 text-sm text-foreground-secondary">
                      {formatDate(exec.opened_at)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
