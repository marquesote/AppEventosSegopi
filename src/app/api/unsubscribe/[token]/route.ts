import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ token: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? '0.0.0.0'

    // El token es el registration ID encodeado
    // En produccion, usar un JWT o token firmado
    const registrationId = token

    const { data: registration, error } = await supabase
      .from('registrations')
      .select('id, email')
      .eq('id', registrationId)
      .single()

    if (error || !registration) {
      return new NextResponse(renderUnsubscribePage('Error: registro no encontrado', false), {
        headers: { 'Content-Type': 'text/html' },
      })
    }

    // Retirar consentimiento de comunicaciones comerciales
    await supabase
      .from('consents')
      .update({
        withdrawn_at: new Date().toISOString(),
        withdrawn_ip: ip,
      })
      .eq('registration_id', registration.id)
      .eq('consent_type', 'commercial_communications')

    // Agregar a la lista de supresion
    await supabase
      .from('suppression_list')
      .upsert(
        {
          email: registration.email,
          reason: 'unsubscribe',
          requested_ip: ip,
        },
        { onConflict: 'email' }
      )

    return new NextResponse(
      renderUnsubscribePage('Te has dado de baja exitosamente. No recibiras mas comunicaciones comerciales.', true),
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return new NextResponse(
      renderUnsubscribePage('Ha ocurrido un error. Contacta con rgpd@tellingconsulting.es', false),
      { headers: { 'Content-Type': 'text/html' }, status: 500 }
    )
  }
}

function renderUnsubscribePage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Baja de comunicaciones - Eventos SEGOPI</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #FAFBFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: white; border-radius: 16px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.07); }
    .icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .icon.success { background: #D1FAE5; color: #047857; }
    .icon.error { background: #FEE2E2; color: #B91C1C; }
    h1 { font-size: 24px; margin: 0 0 12px; color: #0F172A; }
    p { color: #64748B; line-height: 1.6; }
    a { color: #4F46E5; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon ${success ? 'success' : 'error'}">
      ${success ? '&#10003;' : '&#10007;'}
    </div>
    <h1>${success ? 'Baja confirmada' : 'Error'}</h1>
    <p>${message}</p>
    <p style="margin-top:24px"><a href="/">Volver a Eventos SEGOPI</a></p>
  </div>
</body>
</html>`
}
