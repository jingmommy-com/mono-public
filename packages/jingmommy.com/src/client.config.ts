export const locales = [
  'en', // first one is default
  'zh-tw',
  'en-old',
]
// The default locale is always the first entry above. Shared with astro.config.js
// (i18n.locales / defaultLocale) so there is a single source of truth for locales.
export const defaultLocale = locales[0]

// Production domains and the locales each one owns. The SAME build is deployed to
// every domain; language switching only hops between domains when running on one of
// these production hosts (matched with or without a leading "www."). Other hosts —
// local dev and the jingmeal.com staging environment — stay same-origin (no hop).
// See packages/jingmommy.com/CLAUDE.md ("Locale ↔ domain routing").
export const siteDomains: Record<string, string[]> = {
  'jingmommy.com': ['zh-tw'],
  'postpartummeal.com': ['en', 'en-old'],
}
// Global site metadata + shared, language-independent brand/company facts,
// used across every locale (type "a" in the config-placement rule — see
// CLAUDE.md "Config placement"). Derive tel: links from `phone` at the point of
// use, e.g. `tel:${site.phone.replace(/[^0-9]/g, '')}`.
export const site = {
  brandName: 'JingMommy',
  image: 'https://file.jingmommy.com/favicons/favicon-48x48.png',
  url: 'https://jingmommy.com',
  email: 'order@jingmommy.com',
  phone: '(626) 217-7539',
  companyName: 'Comtion Corp.',
  address: '618 Brea Canyon Road Unit F, Walnut, CA 91789',
  city: 'Walnut, California',
  founded: '2010',
  mothersServed: '10,000+',
}
// https://tailwindcss.com/docs/colors
export const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'taupe',
  'mauve',
  'mist',
  'olive',
]