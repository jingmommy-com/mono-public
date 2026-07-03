/*
  Tasting-party events — manually maintained.

  These dates mirror the tasting-party schedule in the order system and are edited
  by hand. This is the single source of truth: both the schedule table
  (`components/js/tasting-party-preserve.astro`) and the "Reserve a tasting" CTAs
  read from here.

  Dates are in America/Los_Angeles (kitchen local time), format `yyyy-mm-dd`.
  Set `isFull: true` once an event's regular seats are gone.
*/

export interface TastingEvent {
  date: string
  isFull: boolean
}

export const tastingEvents: TastingEvent[] = [
  { date: '2025-09-13', isFull: true },
  { date: '2025-11-08', isFull: true },
  { date: '2026-01-10', isFull: true },
  { date: '2026-02-28', isFull: true },
  { date: '2026-04-11', isFull: false },
  { date: '2026-05-30', isFull: false },
  { date: '2026-07-11', isFull: false },
  { date: '2026-08-29', isFull: false },
  { date: '2026-10-10', isFull: false },
  { date: '2026-12-05', isFull: false },
]

/** Parse a `yyyy-mm-dd` string into a local Date (no time component). */
function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map((n) => parseInt(n, 10))
  return new Date(y, m - 1, d)
}

/**
 * The next active tasting date: the earliest upcoming event that is not full.
 * Falls back to the earliest upcoming event (even if full), then `undefined`.
 * `today` defaults to now (the build time for statically-rendered links).
 */
export function nextActiveTastingDate(today: Date = new Date()): string | undefined {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const upcoming = tastingEvents
    .filter((e) => parseYmd(e.date) >= start)
    .sort((a, b) => a.date.localeCompare(b.date))
  return (upcoming.find((e) => !e.isFull) ?? upcoming[0])?.date
}

/**
 * Full order-system URL to reserve a tasting party, pre-filled with the next
 * active date. `lng` is the order system's language code (en site uses 'en-gb').
 */
export function tastingReserveUrl(lng = 'en-gb', today?: Date): string {
  const params = new URLSearchParams({ lng, route: 'form/form/tasting_party' })
  const date = nextActiveTastingDate(today)
  if (date) params.set('date', date)
  return `https://order.jingmommy.com/?${params.toString()}`
}
