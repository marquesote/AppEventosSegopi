'use client'

import { useCountdown } from '../hooks/useCountdown'

interface CountdownTimerProps {
  eventDate: string
  eventStartTime: string
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-white">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-xs sm:text-sm text-white/70 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export function CountdownTimer({ eventDate, eventStartTime }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(eventDate, eventStartTime)

  if (isExpired) {
    return (
      <div className="text-center">
        <p className="text-xl font-semibold text-accent-400">El evento ya ha comenzado</p>
      </div>
    )
  }

  return (
    <div className="flex gap-3 sm:gap-4 justify-center">
      <TimeBlock value={days} label="Dias" />
      <div className="flex items-center text-2xl text-white/50 font-bold pb-6">:</div>
      <TimeBlock value={hours} label="Horas" />
      <div className="flex items-center text-2xl text-white/50 font-bold pb-6">:</div>
      <TimeBlock value={minutes} label="Min" />
      <div className="flex items-center text-2xl text-white/50 font-bold pb-6">:</div>
      <TimeBlock value={seconds} label="Seg" />
    </div>
  )
}
