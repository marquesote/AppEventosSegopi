import Link from 'next/link'
import {
  getGlobalStats,
  getAllEventsSummary,
} from '@/features/analytics/services/analyticsService'

export default async function AnalyticsPage() {
  const [stats, eventsSummary] = await Promise.all([
    getGlobalStats(),
    getAllEventsSummary(),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="heading text-2xl text-foreground">Analytics</h1>
        <p className="text-foreground-secondary mt-1">
          Vision global del rendimiento de la plataforma
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#4F46E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-foreground-secondary">Total Inscripciones</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.totalRegistrations.toLocaleString('es-ES')}</p>
          <p className="text-xs text-foreground-muted mt-1">en {stats.totalEvents} eventos</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-foreground-secondary">Tasa de Asistencia</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.attendanceRate}%</p>
          <p className="text-xs text-foreground-muted mt-1">asistentes confirmados</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-foreground-secondary">Tasa Apertura Email</p>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.emailOpenRate}%</p>
          <p className="text-xs text-foreground-muted mt-1">emails abiertos</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-sm text-foreground-secondary">NPS Promedio</p>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {stats.avgNps !== null ? stats.avgNps.toFixed(1) : '—'}
          </p>
          <p className="text-xs text-foreground-muted mt-1">satisfaccion general</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="card-elevated overflow-hidden">
        <div className="px-6 py-5 border-b border-border-light">
          <h2 className="heading text-base">Metricas por Evento</h2>
        </div>
        {eventsSummary.length === 0 ? (
          <div className="p-8 text-center text-foreground-secondary text-sm">
            No hay eventos con datos de analytics
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Evento</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Fecha</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Inscritos</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Asistentes</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide">Tasa</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-foreground-secondary uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody>
              {eventsSummary.map(({ event, totalRegistrations, attended, attendanceRate }) => (
                <tr
                  key={event.id}
                  className="border-b border-border-light hover:bg-primary-50/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-foreground-muted">{event.city}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-secondary">
                    {new Date(event.event_date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {totalRegistrations}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                    {attended}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-medium ${
                      attendanceRate >= 70 ? 'text-green-600' :
                      attendanceRate >= 40 ? 'text-yellow-600' : 'text-red-500'
                    }`}>
                      {attendanceRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/events/${event.id}/analytics`}
                      className="text-sm text-[#4F46E5] hover:text-indigo-700 font-medium"
                    >
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
