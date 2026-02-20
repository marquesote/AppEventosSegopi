import Link from 'next/link'
import { getWorkflows } from '@/features/workflows/services/workflowService'
import type { WorkflowDefinition, TriggerType, TargetAudience } from '@/types/database'

const triggerLabels: Record<TriggerType, string> = {
  registration: 'Al registrarse',
  pre_event: 'Pre-evento',
  post_event: 'Post-evento',
  manual: 'Manual',
}

const audienceLabels: Record<TargetAudience, string> = {
  all: 'Todos',
  attendees: 'Asistentes',
  no_shows: 'No asistentes',
  commercial_opted_in: 'Con consentimiento comercial',
}

function TriggerBadge({ trigger }: { trigger: TriggerType }) {
  const colorMap: Record<TriggerType, string> = {
    registration: 'bg-blue-50 text-blue-700',
    pre_event: 'bg-indigo-50 text-indigo-700',
    post_event: 'bg-purple-50 text-purple-700',
    manual: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[trigger]}`}>
      {triggerLabels[trigger]}
    </span>
  )
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

export default async function WorkflowsPage() {
  const workflows = await getWorkflows()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading text-2xl text-foreground">Workflows de Email</h1>
          <p className="text-foreground-secondary mt-1">
            Automatizaciones de comunicacion con inscritos
          </p>
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="heading text-lg mb-2">No hay workflows definidos</h3>
          <p className="text-foreground-secondary text-sm">
            Los workflows se configuran desde la base de datos
          </p>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Nombre</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Disparador</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Audiencia</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-foreground-secondary">Estado</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-foreground-secondary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((wf: WorkflowDefinition) => (
                <tr
                  key={wf.id}
                  className="border-b border-border-light hover:bg-primary-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium">{wf.name}</p>
                    {wf.description && (
                      <p className="text-sm text-foreground-secondary mt-0.5 line-clamp-1">
                        {wf.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <TriggerBadge trigger={wf.trigger_type} />
                    {wf.trigger_offset_hours !== null && (
                      <p className="text-xs text-foreground-muted mt-1">
                        {wf.trigger_offset_hours > 0
                          ? `+${wf.trigger_offset_hours}h`
                          : `${wf.trigger_offset_hours}h`}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-secondary">
                    {audienceLabels[wf.target_audience]}
                  </td>
                  <td className="px-6 py-4">
                    <ActiveBadge active={wf.is_active} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/workflows/${wf.id}`}
                      className="text-sm text-[#4F46E5] hover:text-indigo-700 font-medium"
                    >
                      Ver historial
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 card-elevated p-5">
        <p className="text-sm text-foreground-secondary">
          <span className="font-medium text-foreground">{workflows.filter(w => w.is_active).length}</span> de{' '}
          <span className="font-medium text-foreground">{workflows.length}</span> workflows activos.
          Los workflows manuales pueden ejecutarse desde el detalle del evento.
        </p>
      </div>
    </div>
  )
}
