import { createClient } from '@/lib/supabase/server'
import type { Raffle, RaffleEntry, CreateRaffleDTO } from '@/types/database'

export async function getRafflesByEvent(eventId: string): Promise<Raffle[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('raffles')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Raffle[]
}

export async function getRaffleById(raffleId: string): Promise<Raffle | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('raffles')
    .select('*')
    .eq('id', raffleId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as Raffle) ?? null
}

export async function createRaffle(dto: CreateRaffleDTO): Promise<Raffle> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('raffles')
    .insert({
      event_id: dto.event_id,
      name: dto.name,
      description: dto.description ?? null,
      prize_description: dto.prize_description,
      num_winners: dto.num_winners ?? 1,
      require_attendance: dto.require_attendance ?? false,
      require_raffle_consent: dto.require_raffle_consent ?? true,
    })
    .select()
    .single()

  if (error) throw error
  return data as Raffle
}

export async function executeRaffle(
  raffleId: string,
  userId: string
): Promise<RaffleEntry[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('execute_raffle', {
    p_raffle_id: raffleId,
    p_executed_by: userId,
  })

  if (error) throw error
  return (data ?? []) as RaffleEntry[]
}

export async function getRaffleEntries(raffleId: string): Promise<RaffleEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('raffle_entries')
    .select(`
      *,
      registration:registrations(
        first_name,
        last_name,
        email,
        company
      )
    `)
    .eq('raffle_id', raffleId)
    .order('winner_position', { ascending: true, nullsFirst: false })

  if (error) throw error
  return (data ?? []) as RaffleEntry[]
}
