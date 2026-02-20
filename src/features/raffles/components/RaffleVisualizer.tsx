'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRaffleStore, type RaffleParticipant, type RaffleWinner } from '../store/raffleStore'

interface RaffleVisualizerProps {
  raffleId: string
  participants: RaffleParticipant[]
  onExecute: () => Promise<RaffleWinner[]>
}

export function RaffleVisualizer({ raffleId: _raffleId, participants, onExecute }: RaffleVisualizerProps) {
  const {
    animationState,
    winners,
    currentDisplay,
    isFullscreen,
    setParticipants,
    startSpin,
    revealWinners,
    reset,
    toggleFullscreen,
    setCurrentDisplay,
  } = useRaffleStore()

  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setParticipants(participants)
    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
    }
  }, [participants, setParticipants])

  const runSpinAnimation = useCallback(() => {
    if (participants.length === 0) return
    let idx = 0
    spinIntervalRef.current = setInterval(() => {
      idx = (idx + 1) % participants.length
      setCurrentDisplay(participants[idx].name)
    }, 80)
  }, [participants, setCurrentDisplay])

  const handleExecute = useCallback(async () => {
    if (animationState !== 'idle') return
    startSpin()
    runSpinAnimation()

    try {
      const result = await onExecute()

      // Spin for 3 seconds then reveal
      await new Promise((r) => setTimeout(r, 3000))
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current)
        spinIntervalRef.current = null
      }

      revealWinners(result)
    } catch (err) {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current)
        spinIntervalRef.current = null
      }
      reset()
      console.error('Error ejecutando sorteo:', err)
    }
  }, [animationState, startSpin, runSpinAnimation, onExecute, revealWinners, reset])

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-[#1E1B4B] flex flex-col items-center justify-center p-8'
    : 'card-elevated p-8 flex flex-col items-center'

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex w-full justify-between items-center mb-8">
        <h2 className={`heading text-xl ${isFullscreen ? 'text-white' : 'text-foreground'}`}>
          Visualizador de Sorteo
        </h2>
        <button
          onClick={toggleFullscreen}
          className={`p-2 rounded-lg transition-colors ${
            isFullscreen
              ? 'text-white/70 hover:text-white hover:bg-white/10'
              : 'text-foreground-secondary hover:text-foreground hover:bg-gray-100'
          }`}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
      </div>

      {/* Display Area */}
      <div className={`w-full max-w-lg rounded-2xl flex items-center justify-center min-h-40 mb-8 ${
        isFullscreen
          ? 'bg-white/10 border border-white/20'
          : 'bg-primary-50 border border-primary-100'
      }`}>
        {animationState === 'idle' && (
          <p className={`text-lg ${isFullscreen ? 'text-white/60' : 'text-foreground-muted'}`}>
            {participants.length > 0
              ? `${participants.length} participantes listos`
              : 'Sin participantes elegibles'}
          </p>
        )}

        {animationState === 'spinning' && (
          <p className={`text-3xl font-bold text-center px-4 animate-pulse ${
            isFullscreen ? 'text-white' : 'text-[#4F46E5]'
          }`}>
            {currentDisplay || '...'}
          </p>
        )}

        {(animationState === 'revealing' || animationState === 'done') && winners.length > 0 && (
          <div className="text-center p-6 space-y-3 w-full">
            {winners.map((w, i) => (
              <div
                key={w.id}
                className={`animate-scale-in rounded-xl p-4 ${
                  isFullscreen ? 'bg-white/15 border border-white/20' : 'bg-white border border-primary-200'
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${
                  isFullscreen ? 'text-[#F97316]' : 'text-[#F97316]'
                }`}>
                  {winners.length > 1 ? `Ganador #${w.position}` : 'Ganador'}
                </p>
                <p className={`text-2xl font-bold ${isFullscreen ? 'text-white' : 'text-[#4F46E5]'}`}>
                  {w.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {animationState === 'idle' && (
          <button
            onClick={handleExecute}
            disabled={participants.length === 0}
            className="px-8 py-3 bg-[#4F46E5] hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
          >
            Ejecutar Sorteo
          </button>
        )}

        {animationState === 'spinning' && (
          <div className="flex items-center gap-3 text-foreground-secondary">
            <div className="w-5 h-5 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Sorteando...</span>
          </div>
        )}

        {(animationState === 'revealing' || animationState === 'done') && (
          <button
            onClick={reset}
            className="px-6 py-3 border border-border rounded-xl font-medium text-foreground-secondary hover:text-foreground hover:border-foreground-secondary transition-colors"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  )
}
