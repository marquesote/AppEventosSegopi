import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar autorizacion del cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServiceClient()
    const now = new Date()
    const results: { workflow: string; processed: number }[] = []

    // 1. Pre-event reminders (48h before)
    const reminderWorkflow = await getWorkflow(supabase, 'pre_event_reminder')
    if (reminderWorkflow?.is_active) {
      const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)
      const today = now.toISOString().split('T')[0]
      const target = in48h.toISOString().split('T')[0]

      // Find events happening in the next 48h
      const { data: events } = await supabase
        .from('events')
        .select('id, title')
        .eq('status', 'published')
        .gte('event_date', today)
        .lte('event_date', target)

      let processed = 0
      for (const event of events ?? []) {
        // Get registrations that haven't received this workflow yet
        const { data: registrations } = await supabase
          .from('registrations')
          .select('id')
          .eq('event_id', event.id)
          .in('attendance_status', ['registered', 'confirmed'])

        for (const reg of registrations ?? []) {
          // Check if already sent
          const { data: existing } = await supabase
            .from('workflow_executions')
            .select('id')
            .eq('workflow_id', reminderWorkflow.id)
            .eq('registration_id', reg.id)
            .single()

          if (!existing) {
            await supabase.from('workflow_executions').insert({
              workflow_id: reminderWorkflow.id,
              event_id: event.id,
              registration_id: reg.id,
              status: 'pending',
            })
            processed++
          }
        }
      }
      results.push({ workflow: 'pre_event_reminder', processed })
    }

    // 2. Post-event thank you (24h after)
    const thankYouWorkflow = await getWorkflow(supabase, 'post_event_thankyou')
    if (thankYouWorkflow?.is_active) {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      const { data: events } = await supabase
        .from('events')
        .select('id')
        .in('status', ['completed', 'closed'])
        .eq('event_date', yesterday)

      let processed = 0
      for (const event of events ?? []) {
        const { data: registrations } = await supabase
          .from('registrations')
          .select('id')
          .eq('event_id', event.id)
          .eq('attendance_status', 'attended')

        for (const reg of registrations ?? []) {
          const { data: existing } = await supabase
            .from('workflow_executions')
            .select('id')
            .eq('workflow_id', thankYouWorkflow.id)
            .eq('registration_id', reg.id)
            .single()

          if (!existing) {
            await supabase.from('workflow_executions').insert({
              workflow_id: thankYouWorkflow.id,
              event_id: event.id,
              registration_id: reg.id,
              status: 'pending',
            })
            processed++
          }
        }
      }
      results.push({ workflow: 'post_event_thankyou', processed })
    }

    // TODO: Process pending workflow_executions - send actual emails via Resend

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    })
  } catch (error) {
    console.error('Cron workflow error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

async function getWorkflow(supabase: ReturnType<typeof createServiceClient>, name: string) {
  const { data } = await supabase
    .from('workflow_definitions')
    .select('*')
    .eq('name', name)
    .single()
  return data
}
