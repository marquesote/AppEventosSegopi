import { z } from 'zod'

export const registrationSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Introduce un email valido'),
  phone: z.string().regex(/^\d{6,14}$/, 'Introduce un telefono valido'),
  phoneCountryCode: z.string().regex(/^\+\d{1,3}$/, 'Prefijo invalido'),
  company: z.string().optional(),
  position: z.string().optional(),
  eventId: z.string().uuid('Evento invalido'),
  privacyAccepted: z.literal(true, {
    message: 'Debe aceptar la Politica de Privacidad para registrarse',
  }),
  commercialAccepted: z.boolean(),
  raffleAccepted: z.boolean().optional().default(false),
  turnstileToken: z.string().min(1, 'Verificacion de seguridad requerida'),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>

export const phoneCountryCodes = [
  { code: '+34', label: 'Espana (+34)', flag: '🇪🇸' },
  { code: '+351', label: 'Portugal (+351)', flag: '🇵🇹' },
  { code: '+33', label: 'Francia (+33)', flag: '🇫🇷' },
  { code: '+39', label: 'Italia (+39)', flag: '🇮🇹' },
  { code: '+49', label: 'Alemania (+49)', flag: '🇩🇪' },
  { code: '+44', label: 'Reino Unido (+44)', flag: '🇬🇧' },
  { code: '+1', label: 'USA/Canada (+1)', flag: '🇺🇸' },
  { code: '+52', label: 'Mexico (+52)', flag: '🇲🇽' },
  { code: '+54', label: 'Argentina (+54)', flag: '🇦🇷' },
  { code: '+57', label: 'Colombia (+57)', flag: '🇨🇴' },
  { code: '+56', label: 'Chile (+56)', flag: '🇨🇱' },
]
