import { orderSiteUrl, orderSiteLangs, orderPaths, site, locales, defaultLocale } from '@/config/index.ts'
import { tastingEvents } from '@/config/tasting-events.ts'

export function isExternalLink(href: string) {
  if (/^(\/*https?:)?\/\//.test(href)) {
    return true
  }
  return false
}

/**
 * Tracks the live header height and writes it to the CSS variable
 * `--header-height` on <html>. Pair with `scroll-margin-top: var(--header-height)`
 * on target elements so hash-link navigation clears the fixed header.
 *
 * Also re-scrolls to any hash already in the URL after the variable is set,
 * so direct links like /faq#section-meal land in the right place.
 */
export function initAnchorOffset(): void {
  const setVar = () => {
    const header = document.querySelector<HTMLElement>('header')
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
    }
  }

  setVar()

  const header = document.querySelector('header')
  if (header) new ResizeObserver(setVar).observe(header)

  // Re-scroll after the CSS variable is applied so the initial hash lands correctly
  if (location.hash) {
    requestAnimationFrame(() => {
      try {
        const el = document.querySelector(location.hash)
        el?.scrollIntoView({ block: 'start' })
      } catch {
        // ignore invalid selectors
      }
    })
  }
}

/**
 * Order-site URL for a `orderPaths` key, localized for one of our locales:
 *   - API paths (/-/...) have no language dimension.
 *   - Query-route pages select language via ?lng=<lng>.
 *   - Normal pages select language via the /<short> path prefix.
 *   - Without a locale, the order site auto-detects the language.
 */
export function orderUrl(key: keyof typeof orderPaths, locale?: string): string {
  const path = orderPaths[key]
  const lang = locale ? orderSiteLangs[locale] : undefined
  if (!lang || path.startsWith('/-/')) return `${orderSiteUrl}${path}`
  if (path.includes('?')) return `${orderSiteUrl}${path}&lng=${lang.lng}`
  return `${orderSiteUrl}/${lang.short}${path}`
}

/** Locale segment of a pathname (e.g. /zh-tw/faq → zh-tw), or the default locale. */
export const getPathLocale = (pathname: string): string =>
  pathname.split('/').find(s => locales.includes(s)) ?? defaultLocale

/**
 * Fill {token} placeholders in an i18n string with config values, e.g.
 * interpolate(t.tagline, { founded: site.founded }). Unknown tokens are kept.
 */
export const interpolate = (s: string, vars: Record<string, string | number>): string =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))

type PostalAddress = typeof site.address

// '618 Brea Canyon Road Unit F' — first display line of an address
export const addressLine1 = (a: PostalAddress) => a.streetAddress
// 'Walnut, CA 91789' — second display line of an address
export const addressLine2 = (a: PostalAddress) =>
  `${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`
// Full single-line address: '618 Brea Canyon Road Unit F, Walnut, CA 91789'
export const formatAddress = (a: PostalAddress) => `${addressLine1(a)}, ${addressLine2(a)}`

// US phone display format: '6262177539' => '(626) 217-7539'
export const phoneDisplay = (digits: string) =>
  `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`

/**
 * Locale-prefixed internal route, shared by every locale (all site routes are
 * /{locale}/...): route('/about', 'en') => '/en/about'; route('/', 'zh-tw') => '/zh-tw/'.
 */
export const route = (p: string, locale: string): string =>
  p === '/' ? `/${locale}/` : `/${locale}${p}`

// Number display format with thousands separators: 10000 => 10,000
export const formatNumber = (n: number) => n.toLocaleString('en-US')

// USD display format: 1234 => $1,234 ; 59.99 => $59.99
export const usd = (n: number) => `$${n.toLocaleString('en-US')}`

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
 * active date. `locale` is one of OUR locales (mapped to the order site's lng).
 */
export function tastingReserveUrl(locale = 'en', today?: Date): string {
  const url = new URL(orderUrl('tasting_party_form', locale))
  const date = nextActiveTastingDate(today)
  if (date) url.searchParams.set('date', date)
  return url.toString()
}
