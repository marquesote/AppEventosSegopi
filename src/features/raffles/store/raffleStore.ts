'use client'

import { create } from 'zustand'

export type RaffleAnimationState = 'idle' | 'spinning' | 'revealing' | 'done'

export interface RaffleParticipant {
  id: string
  name: string
  email?: string
  company?: string
}

export interface RaffleWinner {
  id: string
  name: string
  position: number
}

interface RaffleStore {
  // State
  animationState: RaffleAnimationState
  participants: RaffleParticipant[]
  winners: RaffleWinner[]
  currentDisplay: string
  isFullscreen: boolean

  // Actions
  setParticipants: (participants: RaffleParticipant[]) => void
  startSpin: () => void
  revealWinners: (winners: RaffleWinner[]) => void
  reset: () => void
  toggleFullscreen: () => void
  setCurrentDisplay: (name: string) => void
}

export const useRaffleStore = create<RaffleStore>((set) => ({
  animationState: 'idle',
  participants: [],
  winners: [],
  currentDisplay: '',
  isFullscreen: false,

  setParticipants: (participants) => set({ participants }),

  startSpin: () => set({ animationState: 'spinning', winners: [] }),

  revealWinners: (winners) =>
    set({ animationState: 'revealing', winners, currentDisplay: '' }),

  reset: () =>
    set({
      animationState: 'idle',
      winners: [],
      currentDisplay: '',
    }),

  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  setCurrentDisplay: (name) => set({ currentDisplay: name }),
}))
