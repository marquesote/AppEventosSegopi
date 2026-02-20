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

    // Buscar registro por token de verificacion
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('id, email, event_id, email_verified')
      .eq('email_verification_token', token)
      .single()

    if (error || !registration) {
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url))
    }

    if (registration.email_verified) {
      return NextResponse.redirect(new URL('/?message=already_verified', request.url))
    }

    // Marcar email como verificado
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        email_verified: true,
        email_verification_token: null,
        attendance_status: 'confirmed',
      })
      .eq('id', registration.id)

    if (updateError) {
      console.error('Email verification update error:', updateError)
      return NextResponse.redirect(new URL('/?error=verification_failed', request.url))
    }

    // TODO: Trigger workflow de confirmacion (enviar email con .ics)

    // Redirect a pagina de exito
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
    return NextResponse.redirect(new URL(`${siteUrl}/?message=email_verified`))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
