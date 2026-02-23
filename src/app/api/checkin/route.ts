import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: registration, error } = await supabase
    .from('registrations')
    .select('id, first_name, last_name, email, company, attendance_status, checked_in_at, event:events(id, title, event_date, slug)')
    .eq('qr_token', token)
    .single()

  if (error || !registration) {
    return NextResponse.json({ error: 'Invitación no válida' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    registration: {
      id: registration.id,
      firstName: registration.first_name,
      lastName: registration.last_name,
      email: registration.email,
      company: registration.company,
      attendanceStatus: registration.attendance_status,
      checkedInAt: registration.checked_in_at,
      event: registration.event,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Find registration
    const { data: registration, error } = await supabase
      .from('registrations')
      .select('id, first_name, last_name, email, company, attendance_status, checked_in_at, event:events(id, title, event_date, slug)')
      .eq('qr_token', token)
      .single()

    if (error || !registration) {
      return NextResponse.json({ error: 'Invitación no válida' }, { status: 404 })
    }

    // Already checked in
    if (registration.attendance_status === 'attended') {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        registration: {
          id: registration.id,
          firstName: registration.first_name,
          lastName: registration.last_name,
          email: registration.email,
          company: registration.company,
          attendanceStatus: registration.attendance_status,
          checkedInAt: registration.checked_in_at,
          event: registration.event,
        },
      })
    }

    // Mark attendance
    const now = new Date().toISOString()
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        attendance_status: 'attended',
        checked_in_at: now,
        updated_at: now,
      })
      .eq('id', registration.id)

    if (updateError) {
      console.error('Check-in update error:', updateError)
      return NextResponse.json({ error: 'Error al registrar asistencia' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      alreadyCheckedIn: false,
      registration: {
        id: registration.id,
        firstName: registration.first_name,
        lastName: registration.last_name,
        email: registration.email,
        company: registration.company,
        attendanceStatus: 'attended',
        checkedInAt: now,
        event: registration.event,
      },
    })
  } catch (err) {
    console.error('Check-in API error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
