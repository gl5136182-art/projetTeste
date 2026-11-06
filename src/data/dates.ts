export const YEAR = 2026
export const MONTH = 10 // novembro (0-indexado)

export type AvailableDay = { day: number; iso: string; weekday: string; vibe: string; color: string }

export const AVAILABLE_DAYS: AvailableDay[] = [
  { day: 20, iso: '2026-11-20', weekday: 'sexta', vibe: 'sextou 🥂', color: 'var(--color-butter)' },
  { day: 21, iso: '2026-11-21', weekday: 'sábado', vibe: 'sabadou 🌙', color: 'var(--color-lilac)' },
]

export const TIMES = ['19h', '19h30', '20h', '20h30', '21h']

export const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
export const MONTH_LABEL = 'novembro'

export function formatDay(iso: string) {
  const d = AVAILABLE_DAYS.find((x) => x.iso === iso)
  return d ? `${d.weekday}, ${d.day} de ${MONTH_LABEL}` : iso
}
