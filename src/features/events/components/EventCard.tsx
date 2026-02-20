import Link from 'next/link'
import type { Event } from '@/types/database'
import { EventStatusBadge } from './EventStatusBadge'

interface EventCardProps {
  event: Event
  registrationCount?: number
}

export function EventCard({ event, registrationCount }: EventCardProps) {
  const eventDate = new Date(event.event_date)
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="card-elevated group hover:shadow-glow transition-all duration-300 overflow-hidden"
    >
      {/* Header gradient */}
      <div className="h-2 gradient-primary" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <EventStatusBadge status={event.status} />
          {registrationCount !== undefined && (
            <span className="text-body-xs text-foreground-muted">
              {registrationCount} inscritos
            </span>
          )}
        </div>

        <h3 className="text-display-xs group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-foreground-secondary text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-foreground-secondary">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-foreground-secondary">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.city}</span>
          </div>

          <div className="flex items-center gap-2 text-foreground-secondary">
            <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{event.event_start_time} - {event.event_end_time}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center text-primary-500 font-medium text-sm group-hover:text-primary-600">
          <span>Ver evento</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
