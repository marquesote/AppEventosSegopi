import { siteConfig } from '@/config/siteConfig'
import { PublicPageWrapper } from '@/components/public/PublicPageWrapper'

export default function CookiesPage() {
  return (
    <PublicPageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-display-md mb-2">Politica de Cookies</h1>
        <p className="text-foreground-muted text-sm mb-8">
          Ultima actualizacion: {siteConfig.legal.cookiesLastUpdated}
        </p>

        <div className="prose prose-lg text-foreground-secondary space-y-6">
          <section>
            <h2 className="text-display-xs text-foreground">Que son las cookies</h2>
            <p>
              Las cookies son pequenos archivos de texto que los sitios web almacenan en su dispositivo
              (ordenador, tablet o móvil) cuando los visita. Se utilizan para hacer que los sitios web
              funcionen de manera mas eficiente y proporcionar información a los propietarios del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-foreground">Cookies que utilizamos</h2>

            <h3 className="text-lg font-semibold text-foreground mt-4">Cookies estrictamente necesarias</h3>
            <p>
              Estas cookies son esenciales para que el sitio web funcione correctamente.
              Incluyen cookies de sesion de autenticacion y preferencias de seguridad.
              No requieren consentimiento.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>sb-*</strong> - Cookies de sesion de Supabase (autenticacion)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-4">Cookies funcionales</h3>
            <p>
              Permiten recordar sus preferencias y personalizar su experiencia en el sitio.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-4">Cookies analiticas</h3>
            <p>
              Nos ayudan a entender como interactuan los visitantes con el sitio web,
              recopilando información de forma anónima. Actualmente no utilizamos cookies
              analiticas de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-foreground">Como gestionar las cookies</h2>
            <p>
              Puede configurar su navegador para rechazar todas las cookies o para indicarle
              cuando se envia una cookie. Sin embargo, si no acepta cookies, es posible que
              no pueda usar algunas partes de nuestro sitio.
            </p>
            <p>
              Para gestionar las cookies en los navegadores mas comunes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chrome: Configuracion &gt; Privacidad y seguridad &gt; Cookies</li>
              <li>Firefox: Opciones &gt; Privacidad &gt; Cookies</li>
              <li>Safari: Preferencias &gt; Privacidad</li>
              <li>Edge: Configuracion &gt; Privacidad &gt; Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-xs text-foreground">Responsable del tratamiento</h2>
            <p>
              <strong>{siteConfig.legal.rgpdResponsible}</strong><br />
              Direccion: {siteConfig.legal.rgpdAddress}<br />
              Email: <a href={`mailto:${siteConfig.legal.rgpdEmail}`} className="text-primary-500">{siteConfig.legal.rgpdEmail}</a>
            </p>
          </section>

          <section>
            <h2 className="text-display-xs text-foreground">Actualizaciones de esta política</h2>
            <p>
              Podemos actualizar esta Politica de Cookies periodicamente. Le recomendamos
              revisar esta pagina regularmente para mantenerse informado sobre cualquier cambio.
            </p>
          </section>
        </div>
      </div>
    </PublicPageWrapper>
  )
}
