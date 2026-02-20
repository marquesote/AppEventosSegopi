import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'

const querySchema = z.object({
  eventId: z.string().uuid().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function rowToCsv(fields: unknown[]): string {
  return fields.map(escapeCsvField).join(',')
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const params = Object.fromEntries(searchParams.entries())
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Parametros invalidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { eventId, status, dateFrom, dateTo } = parsed.data
    const supabase = createServiceClient()

    // Only export registrations with privacy consent granted
    const { data: consentedIds, error: consentError } = await supabase
      .from('consents')
      .select('registration_id')
      .eq('consent_type', 'privacy_policy')
      .eq('granted', true)
      .is('withdrawn_at', null)

    if (consentError) {
      console.error('[export/registrations] consent query error:', consentError)
      return NextResponse.json({ error: 'Error al obtener consentimientos' }, { status: 500 })
    }

    const validIds = (consentedIds ?? []).map((c) => c.registration_id)

    if (validIds.length === 0) {
      const csv = 'No hay inscripciones con consentimiento de privacidad activo\n'
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="inscripciones.csv"',
        },
      })
    }

    let query = supabase
      .from('registrations')
      .select(`
        id,
        first_name,
        last_name,
        email,
        email_verified,
        phone_country_code,
        phone,
        company,
        position,
        attendance_status,
        checked_in_at,
        tags,
        lead_score,
        lead_status,
        nps_score,
        raffle_eligible,
        created_at,
        event:events(title, event_date, city)
      `)
      .in('id', validIds)
      .order('created_at', { ascending: false })

    if (eventId) {
      query = query.eq('event_id', eventId)
    }

    if (status && status !== 'all') {
      query = query.eq('attendance_status', status)
    }

    if (dateFrom) {
      query = query.gte('created_at', `${dateFrom}T00:00:00Z`)
    }

    if (dateTo) {
      query = query.lte('created_at', `${dateTo}T23:59:59Z`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[export/registrations] query error:', error)
      return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 })
    }

    const headers = [
      'ID',
      'Nombre',
      'Apellidos',
      'Email',
      'Email Verificado',
      'Prefijo Tel.',
      'Telefono',
      'Empresa',
      'Cargo',
      'Estado Asistencia',
      'Check-in',
      'Etiquetas',
      'Lead Score',
      'Lead Status',
      'NPS Score',
      'Elegible Sorteo',
      'Evento',
      'Fecha Evento',
      'Ciudad',
      'Fecha Inscripcion',
    ]

    const rows = (data ?? []).map((reg) => {
      const event = reg.event as { title?: string; event_date?: string; city?: string } | null
      return rowToCsv([
        reg.id,
        reg.first_name,
        reg.last_name,
        reg.email,
        reg.email_verified ? 'Si' : 'No',
        reg.phone_country_code,
        reg.phone,
        reg.company ?? '',
        reg.position ?? '',
        reg.attendance_status,
        reg.checked_in_at
          ? new Date(reg.checked_in_at).toLocaleString('es-ES')
          : '',
        Array.isArray(reg.tags) ? reg.tags.join('; ') : '',
        reg.lead_score,
        reg.lead_status,
        reg.nps_score ?? '',
        reg.raffle_eligible ? 'Si' : 'No',
        event?.title ?? '',
        event?.event_date ?? '',
        event?.city ?? '',
        new Date(reg.created_at).toLocaleString('es-ES'),
      ])
    })

    const csvContent = [
      rowToCsv(headers),
      ...rows,
    ].join('\n')

    const filename = eventId
      ? `inscripciones-evento-${eventId.slice(0, 8)}.csv`
      : 'inscripciones-todos.csv'

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[export/registrations] unexpected error:', error)
    return NextResponse.json({ error: 'Error Interno del Servidor' }, { status: 500 })
  }
}
