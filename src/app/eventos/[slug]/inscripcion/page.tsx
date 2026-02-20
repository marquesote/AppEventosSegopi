import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventBySlug } from '@/features/events/services/eventService'
import { RegistrationForm } from '@/features/registrations/components/RegistrationForm'
import { siteConfig } from '@/config/siteConfig'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Evento no encontrado' }

  return {
    title: `Inscripcion - ${event.title} | ${siteConfig.platformName}`,
    description: `Formulario de inscripcion para ${event.title} en ${event.city}`,
  }
}

export default async function RegistrationPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event || event.status !== 'published') {
    notFound()
  }

  if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="card-elevated p-8 max-w-md text-center">
          <h1 className="text-display-xs mb-4">Inscripciones cerradas</h1>
          <p className="text-foreground-secondary mb-6">El plazo de inscripcion para este evento ha finalizado.</p>
          <Link href={`/eventos/${slug}`} className="text-primary-500 font-medium hover:text-primary-600">
            Volver al evento
          </Link>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.event_date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Link href={`/eventos/${slug}`} className="text-white/70 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al evento
          </Link>
          <h1 className="text-display-sm text-white mt-2">{event.title}</h1>
          <p className="text-white/70 mt-2">{eventDate} &middot; {event.city}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto px-4 -mt-6">
        <div className="card-elevated p-6 sm:p-8">
          <h2 className="text-display-xs mb-1">Formulario de Inscripcion</h2>
          <p className="text-foreground-secondary text-sm mb-6">Completa tus datos para reservar tu plaza</p>
          <RegistrationForm event={event} />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <p className="text-xs text-foreground-muted">
          &copy; {new Date().getFullYear()} {siteConfig.companyName} &middot;{' '}
          <Link href="/privacidad" className="text-primary-500 hover:underline">Privacidad</Link> &middot;{' '}
          <Link href="/cookies" className="text-primary-500 hover:underline">Cookies</Link>
        </p>
      </div>
    </div>
  )
}
