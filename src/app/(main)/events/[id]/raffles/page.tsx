import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventById } from '@/features/events/services/eventService'
import { getRafflesByEvent, getRaffleEntries } from '@/features/raffles/services/raffleService'
import { RaffleCard } from '@/features/raffles/components/RaffleCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RafflesPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  const raffles = await getRafflesByEvent(id)
  const rafflesWithEntries = await Promise.all(
    raffles.map(async (raffle) => ({
      raffle,
      entries: await getRaffleEntries(raffle.id),
    }))
  )

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href={`/events/${id}`}
          className="text-sm text-foreground-secondary hover:text-foreground flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al evento
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading text-2xl text-foreground">Sorteos</h1>
            <p className="text-foreground-secondary mt-1">{event.title}</p>
          </div>
        </div>
      </div>

      {rafflesWithEntries.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
              />
            </svg>
          </div>
          <h3 className="heading text-lg mb-2">No hay sorteos para este evento</h3>
          <p className="text-foreground-secondary text-sm">
            Los sorteos se crean desde la base de datos o mediante la API
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {rafflesWithEntries.map(({ raffle, entries }) => (
            <RaffleCard key={raffle.id} raffle={raffle} entries={entries} eventId={id} />
          ))}
        </div>
      )}
    </div>
  )
}
