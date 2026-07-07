/*
  Tasting-party events — manually maintained.

  These dates mirror the tasting-party schedule in the order system and are edited
  by hand. This is the single source of truth: the schedule table
  (`components/themes/base/js/tasting-party-preserve.astro`) reads it directly,
  and the "Reserve a tasting" CTAs read it via the helpers in src/utils
  (`nextActiveTastingDate` / `tastingReserveUrl`).

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
