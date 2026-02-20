'use server'

import { createClient } from '@/lib/supabase/server'
import type { RaffleWinner } from '@/features/raffles/store/raffleStore'

export async function executeRaffleServerAction(
  raffleId: string
): Promise<{ winners?: RaffleWinner[]; error?: string }> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'No autorizado' }
  }

  const { data: raffle, error: raffleError } = await supabase
    .from('raffles')
    .select('id, status, name')
    .eq('id', raffleId)
    .single()

  if (raffleError || !raffle) {
    return { error: 'Sorteo no encontrado' }
  }

  if (raffle.status !== 'pending') {
    return { error: `El sorteo ya fue ejecutado o esta cancelado` }
  }

  const { data, error: rpcError } = await supabase.rpc('execute_raffle', {
    p_raffle_id: raffleId,
    p_executed_by: user.id,
  })

  if (rpcError) {
    console.error('Error executing raffle RPC:', rpcError)
    return { error: rpcError.message ?? 'Error al ejecutar el sorteo' }
  }

  const winners = ((data ?? []) as Array<{ registration_id?: string; winner_position?: number }>)
    .map((entry) => ({
      id: entry.registration_id ?? '',
      name: entry.registration_id ?? '',
      position: entry.winner_position ?? 1,
    }))

  return { winners }
}
