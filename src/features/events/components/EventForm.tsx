'use client'

import { useActionState } from 'react'
import { createEventAction, updateEventAction } from '@/actions/events'
import type { Event } from '@/types/database'

interface EventFormProps {
  event?: Event
}

export function EventForm({ event }: EventFormProps) {
  const isEditing = !!event

  const action = isEditing
    ? async (_prevState: unknown, formData: FormData) => updateEventAction(event.id, formData)
    : async (_prevState: unknown, formData: FormData) => createEventAction(formData)

  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-8">
      {state && typeof state === 'object' && 'error' in state && (
        <div className="p-4 rounded-xl bg-error-50 border border-error-500/20 text-error-700 text-sm">
          {(state as { error: string }).error}
        </div>
      )}

      {/* Informacion basica */}
      <div className="card-elevated p-6 space-y-6">
        <h2 className="text-display-xs">Informacion Basica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium mb-2">Titulo del Evento *</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={event?.title}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Feria de Pintura Valladolid 2026"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="subtitle" className="block text-sm font-medium mb-2">Subtitulo</label>
            <input
              id="subtitle"
              name="subtitle"
              type="text"
              defaultValue={event?.subtitle ?? ''}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Las ultimas tendencias en pintura decorativa"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">Slug (URL)</label>
            <input
              id="slug"
              name="slug"
              type="text"
              defaultValue={event?.slug}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="feria-pintura-valladolid-2026"
            />
            <p className="text-xs text-foreground-muted mt-1">Se genera automaticamente si se deja vacio</p>
          </div>

          <div>
            <label htmlFor="max_capacity" className="block text-sm font-medium mb-2">Capacidad maxima</label>
            <input
              id="max_capacity"
              name="max_capacity"
              type="number"
              defaultValue={event?.max_capacity ?? ''}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-2">Descripcion *</label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              defaultValue={event?.description}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-y"
              placeholder="Describe el evento: que es, para quien, que se obtiene asistiendo..."
            />
          </div>
        </div>
      </div>

      {/* Fecha y ubicacion */}
      <div className="card-elevated p-6 space-y-6">
        <h2 className="text-display-xs">Fecha y Ubicacion</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="event_date" className="block text-sm font-medium mb-2">Fecha *</label>
            <input
              id="event_date"
              name="event_date"
              type="date"
              required
              defaultValue={event?.event_date}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="event_start_time" className="block text-sm font-medium mb-2">Hora inicio *</label>
            <input
              id="event_start_time"
              name="event_start_time"
              type="time"
              required
              defaultValue={event?.event_start_time}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="event_end_time" className="block text-sm font-medium mb-2">Hora fin *</label>
            <input
              id="event_end_time"
              name="event_end_time"
              type="time"
              required
              defaultValue={event?.event_end_time}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="venue_name" className="block text-sm font-medium mb-2">Nombre del lugar *</label>
            <input
              id="venue_name"
              name="venue_name"
              type="text"
              required
              defaultValue={event?.venue_name}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Centro de Exposiciones"
            />
          </div>

          <div>
            <label htmlFor="venue_address" className="block text-sm font-medium mb-2">Direccion *</label>
            <input
              id="venue_address"
              name="venue_address"
              type="text"
              required
              defaultValue={event?.venue_address}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Calle Principal 1"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">Ciudad *</label>
            <input
              id="city"
              name="city"
              type="text"
              required
              defaultValue={event?.city}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Valladolid"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="google_maps_embed_url" className="block text-sm font-medium mb-2">URL de Google Maps Embed</label>
            <input
              id="google_maps_embed_url"
              name="google_maps_embed_url"
              type="url"
              defaultValue={event?.google_maps_embed_url ?? ''}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="card-elevated p-6 space-y-6">
        <h2 className="text-display-xs">SEO y Redes Sociales</h2>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="seo_title" className="block text-sm font-medium mb-2">Titulo SEO</label>
            <input
              id="seo_title"
              name="seo_title"
              type="text"
              defaultValue={event?.seo_title ?? ''}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              placeholder="Se usa el titulo del evento si se deja vacio"
            />
          </div>

          <div>
            <label htmlFor="seo_description" className="block text-sm font-medium mb-2">Meta Descripcion</label>
            <textarea
              id="seo_description"
              name="seo_description"
              rows={2}
              defaultValue={event?.seo_description ?? ''}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-y"
              placeholder="Descripcion para buscadores (max 160 caracteres)"
            />
          </div>
        </div>
      </div>

      {/* Status (solo en edicion) */}
      {isEditing && (
        <div className="card-elevated p-6 space-y-6">
          <h2 className="text-display-xs">Estado</h2>
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">Estado del evento</label>
            <select
              id="status"
              name="status"
              defaultValue={event.status}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="closed">Inscripciones cerradas</option>
              <option value="completed">Finalizado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white rounded-xl font-medium transition-colors"
        >
          {isPending ? 'Guardando...' : isEditing ? 'Actualizar Evento' : 'Crear Evento'}
        </button>
      </div>
    </form>
  )
}
