import { createClient } from '@/lib/supabase/server'
import type { EventPrize, CreateEventPrizeDTO, UpdateEventPrizeDTO } from '@/types/database'

export async function getPrizesByEvent(eventId: string): Promise<EventPrize[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('event_prizes')
    .select('*')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as EventPrize[]
}

export async function getActivePrizesByEvent(eventId: string): Promise<EventPrize[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('event_prizes')
    .select('*')
    .eq('event_id', eventId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as EventPrize[]
}

export async function getPrizeById(id: string): Promise<EventPrize | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('event_prizes')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as EventPrize) ?? null
}

export async function createPrize(dto: CreateEventPrizeDTO): Promise<EventPrize> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('event_prizes')
    .insert(dto)
    .select()
    .single()

  if (error) throw error
  return data as EventPrize
}

export async function updatePrize(id: string, dto: UpdateEventPrizeDTO): Promise<EventPrize> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('event_prizes')
    .update(dto)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as EventPrize
}

export async function deletePrize(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('event_prizes')
    .delete()
    .eq('id', id)

  if (error) throw error
}
