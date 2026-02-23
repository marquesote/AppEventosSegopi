import Link from 'next/link'
import { siteConfig } from '@/config/siteConfig'
import { CalendarIcon, ArrowRightIcon } from './icons'

export function HeroSection() {
  const { hero } = siteConfig

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Gradient primary background */}
      <div className="absolute inset-0 gradient-primary" />

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-7">
            <CalendarIcon className="w-4 h-4 text-accent-300" />
            <span className="text-body-sm text-white/90 font-medium">
              Eventos Grupo Segopi
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            {hero.headline}
          </h1>

          <p className="text-body-lg md:text-body-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
            {hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={hero.ctaHref}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary-600 font-bold text-body-md px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              {hero.ctaText}
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-body-md px-8 py-4 rounded-xl transition-colors border border-white/20"
            >
              Más información
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
