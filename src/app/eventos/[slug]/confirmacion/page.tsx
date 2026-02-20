import Link from 'next/link'
import { siteConfig } from '@/config/siteConfig'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-display-sm mb-3">Inscripcion exitosa</h1>
        <p className="text-foreground-secondary mb-2">
          Gracias por inscribirte. Hemos enviado un email de confirmacion a tu correo electronico.
        </p>
        <p className="text-foreground-muted text-sm mb-8">
          Por favor, revisa tu bandeja de entrada (y la carpeta de spam) y confirma tu email para completar el proceso.
        </p>

        <div className="card-elevated p-6 mb-6 text-left">
          <h3 className="font-heading font-semibold mb-3">Proximos pasos:</h3>
          <ul className="space-y-3 text-sm text-foreground-secondary">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <span>Confirma tu email haciendo clic en el enlace que te hemos enviado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <span>Recibiras un email con los detalles del evento y archivo de calendario</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <span>48 horas antes del evento recibiras un recordatorio con informacion practica</span>
            </li>
          </ul>
        </div>

        <Link
          href={`/eventos/${slug}`}
          className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
        >
          Volver al evento
        </Link>

        <p className="text-xs text-foreground-muted mt-6">
          &copy; {new Date().getFullYear()} {siteConfig.companyName}
        </p>
      </div>
    </div>
  )
}
