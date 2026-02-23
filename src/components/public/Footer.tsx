import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'
import { MailIcon, MapPinIcon, LinkedInIcon, TwitterIcon } from './icons'

export function Footer() {
  const { contact, social } = siteConfig
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-gray-300" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4 group">
              <Image src="/logo-segopi.png" alt="SEGOPI" width={120} height={44} className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-body-sm text-gray-400 leading-relaxed mb-4">
              {siteConfig.companyDescription}
            </p>
            <p className="text-body-xs text-gray-500">
              Organizado por{' '}
              <span className="text-gray-400 font-medium">{siteConfig.companyName}</span>
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="font-heading text-white font-semibold mb-4 text-body-md">
              Navegacion
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.navigation.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-gray-400 hover:text-primary-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal (RGPD) */}
          <div>
            <h3 className="font-heading text-white font-semibold mb-4 text-body-md">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacidad" className="text-body-sm text-gray-400 hover:text-primary-300 transition-colors">
                  Politica de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-body-sm text-gray-400 hover:text-primary-300 transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-body-sm text-gray-400 hover:text-primary-300 transition-colors">
                  Politica de Cookies
                </Link>
              </li>
              <li>
                <Link href="/rgpd" className="text-body-sm text-gray-400 hover:text-primary-300 transition-colors">
                  Derechos RGPD
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading text-white font-semibold mb-4 text-body-md">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-2 text-body-sm text-gray-400 hover:text-primary-300 transition-colors"
                >
                  <MailIcon className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                  {contact.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-body-sm text-gray-400">
                  <MapPinIcon className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                  <span>{contact.address}, {contact.city}, {contact.country}</span>
                </div>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de SEGOPI"
                  className="w-9 h-9 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors"
                >
                  <LinkedInIcon className="w-4 h-4 text-primary-300" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X de SEGOPI"
                  className="w-9 h-9 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors"
                >
                  <TwitterIcon className="w-4 h-4 text-primary-300" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-body-xs text-gray-500">
            <p>
              &copy; {currentYear} {siteConfig.companyName}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacidad" className="hover:text-primary-300 transition-colors">
                Privacidad
              </Link>
              <span aria-hidden="true">|</span>
              <Link href="/terminos" className="hover:text-primary-300 transition-colors">
                Términos
              </Link>
              <span aria-hidden="true">|</span>
              <Link href="/cookies" className="hover:text-primary-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
