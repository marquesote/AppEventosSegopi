import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <Image src="/logo-segopi.png" alt="Eventos SEGOPI" width={180} height={65} className="h-16 w-auto brightness-0 invert" />
            </div>
            <h1 className="text-display-md text-white mb-4">
              Gestiona tus eventos con eficiencia
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              La plataforma integral para ferias y eventos profesionales. Inscripciones, automatizaciones y seguimiento comercial en un solo lugar.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Landing pages optimizadas por evento</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Formularios con cumplimiento RGPD</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Workflows automaticos y sorteos en vivo</span>
            </div>
          </div>
        </div>

        {/* Decoracion gradient mesh */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-300/30 rounded-full blur-3xl" />
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
