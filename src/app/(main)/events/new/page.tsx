import { EventForm } from '@/features/events/components/EventForm'

export default function NewEventPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-display-sm">Nuevo Evento</h1>
        <p className="text-foreground-secondary mt-1">Crea un nuevo evento o feria</p>
      </div>

      <EventForm />
    </div>
  )
}
