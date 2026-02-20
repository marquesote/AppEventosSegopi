import { createClient } from '@/lib/supabase/server'
import type { WorkflowDefinition, WorkflowExecution } from '@/types/database'

export async function getWorkflows(): Promise<WorkflowDefinition[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_definitions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as WorkflowDefinition[]
}

export async function getWorkflowById(id: string): Promise<WorkflowDefinition | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workflow_definitions')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as WorkflowDefinition) ?? null
}

export async function getWorkflowExecutions(
  workflowId: string,
  eventId?: string
): Promise<WorkflowExecution[]> {
  const supabase = await createClient()
  let query = supabase
    .from('workflow_executions')
    .select(`
      *,
      registration:registrations(
        first_name,
        last_name,
        email
      )
    `)
    .eq('workflow_id', workflowId)
    .order('created_at', { ascending: false })

  if (eventId) {
    query = query.eq('event_id', eventId)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as WorkflowExecution[]
}

export async function triggerWorkflow(
  workflowId: string,
  eventId: string
): Promise<{ queued: number }> {
  const supabase = await createClient()

  // Obtener el workflow para conocer el target_audience
  const { data: workflow, error: wError } = await supabase
    .from('workflow_definitions')
    .select('*')
    .eq('id', workflowId)
    .single()

  if (wError || !workflow) throw new Error('Workflow no encontrado')

  // Obtener inscripciones segun el audiencia objetivo
  let regQuery = supabase
    .from('registrations')
    .select('id')
    .eq('event_id', eventId)
    .neq('attendance_status', 'cancelled')

  if (workflow.target_audience === 'attendees') {
    regQuery = regQuery.eq('attendance_status', 'attended')
  } else if (workflow.target_audience === 'no_shows') {
    regQuery = regQuery.eq('attendance_status', 'no_show')
  }

  const { data: registrations, error: rError } = await regQuery
  if (rError) throw rError

  let queued = 0
  for (const reg of registrations ?? []) {
    // Verificar si ya existe ejecucion para evitar duplicados
    const { data: existing } = await supabase
      .from('workflow_executions')
      .select('id')
      .eq('workflow_id', workflowId)
      .eq('event_id', eventId)
      .eq('registration_id', reg.id)
      .single()

    if (!existing) {
      await supabase.from('workflow_executions').insert({
        workflow_id: workflowId,
        event_id: eventId,
        registration_id: reg.id,
        status: 'pending',
      })
      queued++
    }
  }

  return { queued }
}
