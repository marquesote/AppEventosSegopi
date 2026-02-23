import Image from 'next/image'

interface MapEmbedProps {
  embedUrl: string | null
  venueImageUrl: string | null
  venueName: string
  venueAddress: string
  city: string
}

function buildMapSrc(embedUrl: string | null, venueName: string, venueAddress: string, city: string): string {
  if (embedUrl && embedUrl.includes('google.com/maps/embed')) {
    return embedUrl
  }

  const query = encodeURIComponent(`${venueName}, ${venueAddress}, ${city}`)
  return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`
}

export function MapEmbed({ embedUrl, venueImageUrl, venueName, venueAddress, city }: MapEmbedProps) {
  const mapSrc = buildMapSrc(embedUrl, venueName, venueAddress, city)
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName}, ${venueAddress}, ${city}`)}`

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-display-sm text-center mb-4">Ubicacion</h2>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="lg:w-1/3 space-y-4">
            <div className="card-elevated p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg">{venueName}</h3>
                  <p className="text-foreground-secondary text-sm mt-1">{venueAddress}</p>
                  <p className="text-foreground-secondary text-sm">{city}</p>
                </div>
              </div>
            </div>

            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir en Google Maps
            </a>
          </div>

          <div className="lg:w-2/3 w-full">
            <div className="rounded-2xl overflow-hidden shadow-elevated">
              {venueImageUrl ? (
                <Image
                  src={venueImageUrl}
                  alt={`Ubicacion: ${venueName}`}
                  width={800}
                  height={400}
                  className="w-full object-cover"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ${venueName}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
