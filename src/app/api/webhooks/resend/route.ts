import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Resend webhook events for email tracking
interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained'
  data: {
    email_id: string
    to: string[]
    created_at: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const event: ResendWebhookEvent = await request.json()
    const supabase = createServiceClient()

    const statusMap: Record<string, string> = {
      'email.sent': 'sent',
      'email.delivered': 'delivered',
      'email.opened': 'opened',
      'email.clicked': 'clicked',
      'email.bounced': 'bounced',
      'email.complained': 'failed',
    }

    const status = statusMap[event.type]
    if (!status) {
      return NextResponse.json({ received: true })
    }

    const updateData: Record<string, unknown> = { status }
    const timestamp = new Date(event.data.created_at).toISOString()

    if (event.type === 'email.sent') updateData.sent_at = timestamp
    if (event.type === 'email.opened') updateData.opened_at = timestamp
    if (event.type === 'email.clicked') updateData.clicked_at = timestamp
    if (event.type === 'email.bounced') updateData.error_message = 'Email bounced'

    // Update workflow execution by resend email ID
    await supabase
      .from('workflow_executions')
      .update(updateData)
      .eq('resend_email_id', event.data.email_id)

    // If bounced, add to suppression list
    if (event.type === 'email.bounced' && event.data.to[0]) {
      await supabase
        .from('suppression_list')
        .upsert(
          { email: event.data.to[0], reason: 'bounce' },
          { onConflict: 'email' }
        )
    }

    // If complained, add to suppression list
    if (event.type === 'email.complained' && event.data.to[0]) {
      await supabase
        .from('suppression_list')
        .upsert(
          { email: event.data.to[0], reason: 'complaint' },
          { onConflict: 'email' }
        )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Resend webhook error:', error)
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 })
  }
}
