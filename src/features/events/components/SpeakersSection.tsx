import type { Speaker } from '@/types/database'

interface SpeakersSectionProps {
  speakers: Speaker[]
}

export function SpeakersSection({ speakers }: SpeakersSectionProps) {
  if (speakers.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-display-sm text-center mb-4">Ponentes y Expositores</h2>
        <p className="text-center text-foreground-secondary mb-12 max-w-2xl mx-auto">
          Conoce a los profesionales que participaran en el evento
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <div key={index} className="card-elevated overflow-hidden group">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                {speaker.image_url ? (
                  <img
                    src={speaker.image_url}
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {speaker.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg">{speaker.name}</h3>
                <p className="text-primary-500 text-sm font-medium mb-2">{speaker.title}</p>
                <p className="text-foreground-secondary text-sm line-clamp-3">{speaker.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
