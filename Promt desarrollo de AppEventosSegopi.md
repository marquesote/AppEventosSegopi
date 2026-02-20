Actúa como un arquitecto de soluciones digitales senior con experiencia 
demostrada en desarrollo de plataformas de gestión de eventos B2B, 
integración de CRMs y automatización de marketing. Has liderado proyectos 
similares para empresas del sector PYME y corporativo en España y 
Latinoamérica, con pleno conocimiento de la normativa RGPD europea.

---

## CONTEXTO DEL PROYECTO

**Cliente:** TELLING CONSULTING, S.L. (empresa de consultoría)
**Objetivo de negocio:** Crear una plataforma escalable para gestionar múltiples 
ferias de pintura (Valladolid, Madrid y futuras ciudades) que centralice la 
captación de leads, automatice la comunicación y permita acciones comerciales 
post-evento medibles.

**Perfil técnico del equipo ejecutor:** 
[COMPLETAR: ¿equipo interno con desarrolladores? ¿agencia externa? 
¿gestión autónoma por personal no técnico?]

**Restricciones conocidas:**
- Cumplimiento obligatorio RGPD (Reglamento General de Protección de Datos, 
  UE 2016/679) y Ley Orgánica de Protección de Datos (LOPDGDD) española.
- Los formularios NO pueden almacenar datos sin consentimiento explícito 
  y verificable.
- La solución debe ser mantenible a largo plazo sin dependencia crítica 
  de un único proveedor.

**Presupuesto aproximado disponible:** [COMPLETAR: ej. < 3.000€ / 3.000–8.000€ 
/ > 8.000€ — esto determinará la propuesta tecnológica]

**Plazo objetivo para MVP (versión mínima funcional):** 
[COMPLETAR: ej. 30 / 60 / 90 días]

**Volumen estimado:**
- Número de eventos simultáneos: 2–5 ferias/año inicialmente.
- Asistentes esperados por evento: [COMPLETAR: ej. 100–500 / 500–2.000]
- Crecimiento proyectado a 2 años: [COMPLETAR]

---

## REQUISITOS FUNCIONALES (obligatorios)

### 1. Arquitectura y Plataforma Web

Necesito que evalúes y justifiques, con criterios técnicos y económicos, 
cuál de las siguientes arquitecturas es más adecuada para este proyecto:

**Opción A — CMS con Plugins especializados**
WordPress + plugin de eventos (Modern Events Calendar PRO o The Events 
Calendar + Event Tickets) + constructores de formularios avanzados 
(Gravity Forms o WS Form).

**Opción B — Plataforma SaaS integral**
Solución tipo Eventbrite, Hopin o similar que incluya gestión de 
inscripciones, CRM básico y herramientas de email nativo.

**Opción C — Desarrollo a medida**
Stack moderno (Next.js / React + Node.js o Laravel + base de datos 
relacional PostgreSQL/MySQL) con integraciones via API a CRM y 
herramientas de marketing externas.

Para cada opción analizada proporciona:
- Ventajas e inconvenientes específicos para este caso de uso.
- Coste estimado de licencias/desarrollo.
- Complejidad de mantenimiento a largo plazo.
- Escalabilidad para añadir nuevos eventos y ciudades.
- Tu recomendación final justificada con criterios objetivos.

**Requisitos obligatorios de la landing page de cada evento:**
- Título del evento optimizado para SEO (con keyword principal).
- Descripción del evento estructurada: qué es, para quién, qué se obtiene 
  asistiendo (propuesta de valor clara).
- Fecha, horario y ubicación con mapa interactivo embebido (Google Maps 
  o Mapbox).
- Sección de beneficios con iconografía visual.
- Contador regresivo hasta el inicio del evento (urgencia).
- Sección de ponentes o expositores (si aplica).
- Galería de ediciones anteriores (prueba social).
- Call-to-Action (CTA) de inscripción visible en múltiples puntos.
- Meta tags Open Graph para compartición optimizada en redes sociales.

---

### 2. Formulario de Inscripción y Gestión de Datos

**Campos obligatorios del formulario:**
- Nombre y Apellidos (campo de texto, validación no vacío).
- Correo electrónico (validación de formato + email de doble opt-in 
  recomendado).
- Teléfono móvil (con selector de prefijo internacional, validación 
  numérica).
- Nombre de la Empresa / Organización.
- Cargo o puesto (opcional pero recomendado para segmentación B2B).
- Evento al que se inscribe (si el formulario es multi-evento, 
  campo select obligatorio).

**Requisitos de privacidad y cumplimiento RGPD (CRÍTICO):**
- Checkbox independiente y no pre-marcado para aceptación de 
  Política de Privacidad (con enlace a documento completo).
- Checkbox independiente y no pre-marcado para aceptación de 
  comunicaciones comerciales (base legal: consentimiento explícito Art. 6 
  RGPD — esta casilla NO puede ser obligatoria para completar 
  el registro).
- Registro del timestamp de cada consentimiento y la IP del usuario 
  (obligatorio para demostrar cumplimiento ante la AEPD).
- Enlace visible a política de cookies en el footer de la landing.
- Derecho de supresión: proceso documentado para atender solicitudes 
  de eliminación de datos.

**Seguridad y calidad del dato:**
- Protección anti-spam (Google reCAPTCHA v3 o Cloudflare Turnstile, 
  este último sin fricción para el usuario).
- Validación en tiempo real de campos antes del envío.
- Almacenamiento cifrado de datos personales.
- Sin exportación a hojas de cálculo locales como proceso principal 
  (riesgo de brechas de seguridad y datos desincronizados).

---

### 3. Integración CRM y Automatización de Marketing

**Selección del CRM:** Evalúa y recomienda justificadamente entre:
- HubSpot CRM (versión gratuita + Marketing Hub Starter).
- E-goi (especialmente relevante por su presencia en mercado ibérico 
  y funcionalidades SMS + email combinadas).
- ActiveCampaign (automatizaciones avanzadas, buena relación 
  calidad-precio).
- Brevo (antes Sendinblue) — opción económica con email + SMS.
- CRM nativo de la plataforma elegida (si aplica).

**Flujos de automatización obligatorios (Workflows):**

*Workflow 1 — Confirmación de inscripción:*
Trigger: envío del formulario → 
Acción 1: enviar email de confirmación personalizado (nombre del 
asistente, evento, fecha, ubicación, añadir a calendario .ics) → 
Acción 2: crear contacto en CRM con etiqueta del evento → 
Acción 3: notificar al responsable del evento via email/Slack.

*Workflow 2 — Recordatorio pre-evento:*
Trigger: 48h antes del evento → 
Email de recordatorio con información práctica (cómo llegar, 
parking, agenda del día, qué traer).

*Workflow 3 — Seguimiento post-evento (comercial):*
Trigger: día +1 post-evento → 
Email de agradecimiento + encuesta de satisfacción (NPS o similar) → 
Día +3: notificación interna al equipo de ventas con lista de 
asistentes para follow-up telefónico → 
Día +7: email comercial con oferta o próximo evento.

**Segmentación de la base de datos:**
- Etiquetado automático por evento asistido (ej. "Feria_Pintura_Valladolid_2025").
- Campo personalizado: "Interés en próximos eventos" (capturado en 
  el formulario o encuesta post-evento).
- Segmento de "no asistentes" (inscritos que no acudieron) para 
  comunicación diferenciada.
- Lista de supresión para quienes soliciten baja (cumplimiento RGPD).

---

### 4. Sistema de Sorteos y Dinamización del Evento

**Exportación de datos:**
- Función de exportación a CSV/Excel con filtros por evento, 
  fecha de inscripción y estado de asistencia.
- Los datos exportados deben excluir a quienes no marcaron 
  consentimiento para participar en sorteos (si es un campo 
  independiente en el formulario).

**Opciones para realización de sorteos:**

*Opción A — Integración con Easypromos o plataforma certificada:*
- Carga del CSV en la plataforma.
- Sorteo con certificado notarial digital de validez jurídica.
- Acta de sorteo descargable para transparencia ante participantes.
- Coste aproximado: desde 29€/sorteo en planes básicos.

*Opción B — Script interno de selección aleatoria:*
- Desarrollo en PHP/Python o función directa en base de datos 
  (SQL: ORDER BY RAND() LIMIT N).
- Registro en log de cada sorteo realizado (quién ejecutó, cuándo, 
  resultado) para auditoría interna.
- Interfaz de administración sencilla para ejecutar el sorteo en 
  pantalla durante el evento (efecto visual).
- Consideración: sin validez jurídica certificada externamente, 
  adecuado para sorteos internos de bajo riesgo legal.

**Recomendación:** justifica cuándo usar cada opción según el valor 
del premio y el riesgo reputacional.

---

### 5. Estrategia Post-Evento y Acciones Comerciales

Define el flujo completo de nurturing post-evento con:
- Secuencia de emails (contenido, asunto, timing recomendado y 
  objetivo de cada comunicación).
- Integración con campañas SMS para comunicaciones de alta 
  urgencia o recordatorios (evalúa coste por SMS y proveedores 
  recomendados para España).
- Métricas de seguimiento: tasa de apertura, clics, respuesta a 
  encuesta, conversión a cliente.
- Proceso de handoff a ventas: qué información recibe el comercial, 
  en qué formato y con qué priorización de leads (lead scoring básico).

---

## ENTREGABLES ESPERADOS DE TU RESPUESTA

Por favor, estructura tu respuesta en las siguientes secciones:

**A. Propuesta Tecnológica Recomendada**
Stack completo justificado con diagrama de arquitectura conceptual 
(puedes describir el flujo en texto si no puedes generar imagen).

**B. Herramientas y Stack Tecnológico**
Tabla comparativa con: herramienta | función | coste mensual/anual | 
alternativa económica | justificación de elección.

**C. Arquitectura de Datos y Flujo de Información**
Describe cómo fluye un registro desde que el usuario rellena el 
formulario hasta que el comercial recibe la notificación de follow-up. 
Incluye todos los sistemas involucrados.

**D. Presupuesto Estimado Detallado**
Desglosado en tres escenarios:
- Solución económica (< 2.000€ inversión inicial + costes recurrentes).
- Solución equilibrada (2.000–6.000€).
- Solución premium/escalable (> 6.000€).
Para cada escenario: inversión inicial, costes mensuales recurrentes y 
qué funcionalidades incluye/excluye.

**E. Cronograma de Implementación (MVP en 30/60/90 días)**
Por fases: Fase 1 — Infraestructura base, Fase 2 — Formulario + CRM, 
Fase 3 — Automatizaciones, Fase 4 — Pruebas y lanzamiento.

**F. Riesgos Identificados y Plan de Mitigación**
Mínimo 3 riesgos técnicos o legales con su plan de contingencia.

**G. Recomendaciones Adicionales de Mejora**
Cualquier aspecto que el cliente no haya considerado y que aporte 
valor real al proyecto (ej. SEO para captación orgánica, pixel de 
conversión para retargeting publicitario, integración con Google 
Analytics 4, accesibilidad WCAG).