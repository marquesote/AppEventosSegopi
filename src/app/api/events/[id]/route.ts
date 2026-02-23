import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('id, title, event_date, slug, status, city')
    .eq('id', id)
    .single()

  if (error || !event) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
  }

  return NextResponse.json(event)
}
