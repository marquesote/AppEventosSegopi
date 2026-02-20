import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: raffleId } = await context.params

    // Verificar autenticacion
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que el sorteo existe y esta en estado pendiente
    const { data: raffle, error: raffleError } = await supabase
      .from('raffles')
      .select('id, status, name')
      .eq('id', raffleId)
      .single()

    if (raffleError || !raffle) {
      return NextResponse.json(
        { error: 'Sorteo no encontrado' },
        { status: 404 }
      )
    }

    if (raffle.status !== 'pending') {
      return NextResponse.json(
        { error: `El sorteo "${raffle.name}" ya fue ejecutado o esta cancelado` },
        { status: 409 }
      )
    }

    // Ejecutar el sorteo via RPC
    const { data: winners, error: rpcError } = await supabase.rpc('execute_raffle', {
      p_raffle_id: raffleId,
      p_executed_by: user.id,
    })

    if (rpcError) {
      console.error('Error executing raffle RPC:', rpcError)
      return NextResponse.json(
        { error: rpcError.message ?? 'Error al ejecutar el sorteo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      raffleId,
      winners: winners ?? [],
    })
  } catch (error) {
    console.error('Raffle execute error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
