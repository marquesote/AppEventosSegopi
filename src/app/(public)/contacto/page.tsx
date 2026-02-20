import type { Metadata } from 'next'
import { siteConfig } from '@/config/siteConfig'
import { SectionHeading } from '@/components/public/SectionHeading'
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from '@/components/public/icons'

export const metadata: Metadata = {
  title: siteConfig.seo.titleTemplate.replace('%s', 'Contacto'),
  description: `Contactenos. ${siteConfig.companyName} - ${siteConfig.contact.address}, ${siteConfig.contact.city}. Email: ${siteConfig.contact.email}`,
}

export default function ContactoPage() {
  const { contact } = siteConfig

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Contactenos"
            title="Somos tu equipo"
            subtitle="Tiene alguna pregunta sobre nuestros eventos? Envienos un mensaje o escribanos por correo."
            light
          />
        </div>
      </section>

      {/* Contact info */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-3 p-5 bg-primary-50 rounded-2xl">
              <MapPinIcon className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-body-sm mb-1">Direccion</p>
                <p className="text-body-sm text-foreground-secondary">
                  {contact.address}, {contact.city}, {contact.country}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-5 bg-primary-50 rounded-2xl">
              <PhoneIcon className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-body-sm mb-1">Telefono</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-body-sm text-primary-600 hover:underline"
                >
                  {contact.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-5 bg-primary-50 rounded-2xl">
              <MailIcon className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-body-sm mb-1">Email</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-body-sm text-primary-600 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 p-5 bg-primary-50 rounded-2xl">
              <ClockIcon className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-body-sm mb-1">Horario</p>
                <p className="text-body-sm text-foreground-secondary">{contact.officeHours}</p>
              </div>
            </div>
          </div>

          <div className="text-center py-10 bg-primary-50 rounded-2xl border border-primary-100">
            <p className="text-body-md text-foreground-secondary">
              Para inscribirse en nuestros eventos, visita la pagina del evento correspondiente.
            </p>
            <a
              href="/#eventos"
              className="inline-flex items-center mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Ver proximos eventos
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
