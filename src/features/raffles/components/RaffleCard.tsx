'use client'

import { useCallback } from 'react'
import { RaffleVisualizer } from './RaffleVisualizer'
import { executeRaffleServerAction } from '@/features/raffles/actions/raffleActions'
import type { Raffle, RaffleStatus, RaffleEntry } from '@/types/database'
import type { RaffleWinner, RaffleParticipant } from '@/features/raffles/store/raffleStore'

const raffleStatusConfig: Record<RaffleStatus, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-yellow-50 text-yellow-700' },
  in_progress: { label: 'En curso', className: 'bg-blue-50 text-blue-700' },
  completed: { label: 'Completado', className: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Cancelado', className: 'bg-red-50 text-red-700' },
}

function RaffleStatusBadge({ status }: { status: RaffleStatus }) {
  const cfg = raffleStatusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

interface RaffleCardProps {
  raffle: Raffle
  entries: RaffleEntry[]
  eventId: string
}

export function RaffleCard({ raffle, entries, eventId }: RaffleCardProps) {
  const winners = entries.filter(e => e.is_winner)
  const participants: RaffleParticipant[] = entries.map((e) => {
    const reg = e.registration as
      | { first_name?: string; last_name?: string; email?: string; company?: string }
      | undefined
    return {
      id: e.registration_id,
      name: reg ? `${reg.first_name ?? ''} ${reg.last_name ?? ''}`.trim() : e.registration_id,
      email: reg?.email,
      company: reg?.company ?? undefined,
    }
  })

  const handleExecute = useCallback(async (): Promise<RaffleWinner[]> => {
    const result = await executeRaffleServerAction(raffle.id)
    if (result.error) throw new Error(result.error)
    return result.winners ?? []
  }, [raffle.id])

  return (
    <div className="card-elevated p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="heading text-lg">{raffle.name}</h3>
            <RaffleStatusBadge status={raffle.status} />
          </div>
          {raffle.description && (
            <p className="text-foreground-secondary text-sm">{raffle.description}</p>
          )}
        </div>
        <span className="text-xs text-foreground-muted">#{raffle.id.slice(0, 8)}</span>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6 p-4 bg-gray-50 rounded-xl">
        <div>
          <dt className="text-foreground-secondary">Premio</dt>
          <dd className="font-medium mt-0.5">{raffle.prize_description}</dd>
        </div>
        <div>
          <dt className="text-foreground-secondary">Ganadores</dt>
          <dd className="font-medium mt-0.5">{raffle.num_winners}</dd>
        </div>
        <div>
          <dt className="text-foreground-secondary">Participantes</dt>
          <dd className="font-medium mt-0.5">{entries.length}</dd>
        </div>
        <div>
          <dt className="text-foreground-secondary">Requiere asistencia</dt>
          <dd className="font-medium mt-0.5">{raffle.require_attendance ? 'Si' : 'No'}</dd>
        </div>
      </dl>

      {/* Winners already selected */}
      {winners.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-medium text-green-800 mb-2">Ganadores del sorteo</p>
          <div className="space-y-2">
            {winners.map((entry) => {
              const reg = entry.registration as
                | { first_name?: string; last_name?: string; email?: string }
                | undefined
              return (
                <div key={entry.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-200 text-green-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {entry.winner_position}
                  </span>
                  <div>
                    <p className="font-medium text-green-900 text-sm">
                      {reg ? `${reg.first_name} ${reg.last_name}` : entry.registration_id}
                    </p>
                    {reg?.email && (
                      <p className="text-xs text-green-700">{reg.email}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visualizer only for pending raffles */}
      {raffle.status === 'pending' && (
        <RaffleVisualizer
          raffleId={raffle.id}
          participants={participants}
          onExecute={handleExecute}
        />
      )}

      {/* Link to event page */}
      <div className="mt-4 text-right">
        <a
          href={`/events/${eventId}/raffles`}
          className="text-xs text-foreground-muted hover:text-foreground"
        >
          Evento: {eventId.slice(0, 8)}
        </a>
      </div>
    </div>
  )
}
