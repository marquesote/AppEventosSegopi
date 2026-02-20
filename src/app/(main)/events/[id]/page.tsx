import { notFound } from 'next/navigation'
import { getEventById } from '@/features/events/services/eventService'
import { EventForm } from '@/features/events/components/EventForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-display-sm">Editar Evento</h1>
        <p className="text-foreground-secondary mt-1">{event.title}</p>
      </div>

      <EventForm event={event} />
    </div>
  )
}
