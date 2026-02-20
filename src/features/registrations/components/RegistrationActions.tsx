'use client'

import { useState, useTransition } from 'react'
import {
  updateAttendanceStatusAction,
  updateNotesAction,
  updateTagsAction,
  updateLeadStatusAction,
} from '@/actions/registrations'
import type { AttendanceStatus, LeadStatus } from '@/types/database'

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'registered', label: 'Registrado' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'attended', label: 'Asistio' },
  { value: 'no_show', label: 'No asistio' },
  { value: 'cancelled', label: 'Cancelado' },
]

const LEAD_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Calificado' },
  { value: 'converted', label: 'Convertido' },
  { value: 'lost', label: 'Perdido' },
]

interface AttendanceStatusFormProps {
  registrationId: string
  currentStatus: string
}

export function AttendanceStatusForm({ registrationId, currentStatus }: AttendanceStatusFormProps) {
  const [selected, setSelected] = useState<AttendanceStatus>(currentStatus as AttendanceStatus)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleChange(value: AttendanceStatus) {
    setSelected(value)
    setMessage(null)
    startTransition(async () => {
      const result = await updateAttendanceStatusAction(registrationId, value)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
        setSelected(currentStatus as AttendanceStatus)
      } else {
        setMessage({ type: 'success', text: 'Estado actualizado' })
      }
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground-secondary mb-2">Estado de asistencia</label>
      <div className="flex flex-wrap gap-2">
        {ATTENDANCE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleChange(opt.value)}
            disabled={isPending}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
              selected === opt.value
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-background border border-border hover:border-primary-200 text-foreground-secondary'
            } disabled:opacity-60`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {message && (
        <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-success-600' : 'text-error-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}

interface LeadStatusFormProps {
  registrationId: string
  currentStatus: string
}

export function LeadStatusForm({ registrationId, currentStatus }: LeadStatusFormProps) {
  const [selected, setSelected] = useState<LeadStatus>(currentStatus as LeadStatus)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleChange(value: LeadStatus) {
    setSelected(value)
    setMessage(null)
    startTransition(async () => {
      const result = await updateLeadStatusAction(registrationId, value)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
        setSelected(currentStatus as LeadStatus)
      } else {
        setMessage({ type: 'success', text: 'Lead status actualizado' })
      }
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground-secondary mb-2">Estado lead (CRM)</label>
      <div className="flex flex-wrap gap-2">
        {LEAD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleChange(opt.value)}
            disabled={isPending}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
              selected === opt.value
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-background border border-border hover:border-accent-200 text-foreground-secondary'
            } disabled:opacity-60`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {message && (
        <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-success-600' : 'text-error-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}

interface NotesFormProps {
  registrationId: string
  initialNotes: string | null
}

export function NotesForm({ registrationId, initialNotes }: NotesFormProps) {
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleSave() {
    setMessage(null)
    startTransition(async () => {
      const result = await updateNotesAction(registrationId, notes)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Notas guardadas' })
      }
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground-secondary mb-2">Notas internas</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Notas internas del equipo (no visibles para el asistente)..."
        className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        {message ? (
          <p className={`text-xs ${message.type === 'success' ? 'text-success-600' : 'text-error-600'}`}>
            {message.text}
          </p>
        ) : <span />}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {isPending ? 'Guardando...' : 'Guardar notas'}
        </button>
      </div>
    </div>
  )
}

interface TagsFormProps {
  registrationId: string
  initialTags: string[]
}

export function TagsForm({ registrationId, initialTags }: TagsFormProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function addTag() {
    const trimmed = input.trim()
    if (!trimmed || tags.includes(trimmed)) return
    const newTags = [...tags, trimmed]
    setTags(newTags)
    setInput('')
    saveTags(newTags)
  }

  function removeTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag)
    setTags(newTags)
    saveTags(newTags)
  }

  function saveTags(newTags: string[]) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateTagsAction(registrationId, newTags)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Etiquetas actualizadas' })
      }
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground-secondary mb-2">Etiquetas</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              disabled={isPending}
              className="hover:text-primary-900 transition-colors"
            >
              x
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-xs text-foreground-muted">Sin etiquetas</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder="Nueva etiqueta..."
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all"
        />
        <button
          onClick={addTag}
          disabled={isPending || !input.trim()}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Anadir
        </button>
      </div>
      {message && (
        <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-success-600' : 'text-error-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  )
}
