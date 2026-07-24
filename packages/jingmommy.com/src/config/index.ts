/*
  Rule: files under src/config hold PURE DATA only — constants, plain
  objects/arrays, and types. Functions belong in src/utils; the only exception
  is a helper a config file itself needs in order to build its data.
*/
export const locales = [
  'zh-tw',
  'zh-cn',
  'en',
  'en-translated',
]
// The default locale is always the first entry above. Shared with astro.config.js
// (i18n.locales / defaultLocale) so there is a single source of truth for locales.
export const defaultLocale = locales[2]

// Display metadata for every locale above. Labels are autonyms (each
// language's name in that language), so the same label is shown on every site.
export interface LocaleMeta {
  label: string
  hreflang: string
}
export const localeMeta: Record<string, LocaleMeta> = {
  'en': { label: 'English', hreflang: 'en' },
  'zh-tw': { label: '繁體中文', hreflang: 'zh-Hant-TW' },
  'zh-cn': { label: '简体中文', hreflang: 'zh-Hans-CN' },
  // en-translated is a direct translation of the zh site (copy not editorially reviewed)
  'en-translated': { label: 'English (Translated)', hreflang: 'en' },
}

// Production domains and the locales each one owns. The SAME build is deployed to
// every domain; language switching only hops between domains when running on one of
// these production hosts (matched with or without a leading "www."). Other hosts —
// local dev and the jingmeal.com staging environment — stay same-origin (no hop).
// See packages/jingmommy.com/CLAUDE.md ("Locale ↔ domain routing").
export const siteDomains: Record<string, string[]> = {
  'jingmommy.com': ['zh-tw', 'zh-cn'],
  'postpartummeal.com': ['en', 'en-translated'],
}
// Global site metadata + shared, language-independent brand/company facts,
// used across every locale (type "a" in the config-placement rule — see
// CLAUDE.md "Config placement").
export const site = {
  brandName: 'JingMommy',
  image: 'https://file.jingmommy.com/favicons/favicon-48x48.png',
  url: 'https://jingmommy.com',
  email: 'order@jingmommy.com',
  companyName: 'Comtion Corp.', // This is important for legal and tax purposes. It is the official name of the business entity that owns the brand.
  // schema.org PostalAddress — embed directly in JSON-LD; for display use
  // formatAddress / addressLine1 / addressLine2 from src/utils.
  address: {
    '@type': 'PostalAddress',
    streetAddress: '618 Brea Canyon Road Unit F',
    addressLocality: 'Walnut',
    addressRegion: 'CA',
    postalCode: '91789',
    addressCountry: 'US',
  },
  founded: '2010',
  mothersServed: 10000,
}
// Central kitchen — same building (and city/state/ZIP) as the head office in
// `site.address`, but a different unit. NOTE: `unit` is currently the office
// unit as a placeholder — set it to the kitchen's actual unit.
export const kitchen = {
  street: '618 Brea Canyon Road',
  unit: 'Unit F',
  addressLocality: site.address.addressLocality,
  addressRegion: site.address.addressRegion,
  postalCode: site.address.postalCode,
}
// Phone numbers — digits only (pure data). Render for display with
// `phoneDisplay()` from src/utils ((xxx) xxx-xxxx); build tel links inline at
// the usage site, e.g. href={`tel:${phones.main}`} — never store tel: strings.
export const phones = {
  main: '6262177539', // 總機
  salesPatricia: '6269915899',
  salesMiya: '6269915786',
  customerService: '9099100285',
}
// Per-locale brand display names (lang key => name). `site.brandName` stays
// the canonical latin name used in metadata.
export const brandNames: Record<string, string> = {
  'zh-tw': '金品月子膳食',
  'zh-cn': '金品月子膳食',
  'en': 'JingMommy',
  'en-translated': 'JingMommy',
}
// Facebook Messenger account per locale (lang key => url).
export const messengerUrls: Record<string, string> = {
  'zh-tw': 'https://www.messenger.com/t/148231668540780/',
  'zh-cn': 'https://www.messenger.com/t/148231668540780/',
  'en': 'https://www.messenger.com/t/453550428399457/',
  'en-translated': 'https://www.messenger.com/t/453550428399457/',
}
// Order-site (order.jingmommy.com) linking:
//   1. API paths (/-/...) have no language dimension.
//   2. A language is selected either by path prefix — orderSiteUrl/<short><path>
//      — or by query param (?lng=<lng>) for query-route pages.
//   3. Without a language, the order site auto-detects on its own.
// Compose URLs with `orderUrl(key, locale)` from src/utils.
export const orderSiteUrl = 'https://order.jingmommy.com'

// Our locale → order-site language codes (`short` = path prefix, `lng` = query id).
export const orderSiteLangs: Record<string, { short: string; lng: string }> = {
  'zh-tw': { short: 'zh', lng: 'zh-tw' },
  'zh-cn': { short: 'zh', lng: 'zh-tw' }, // the order site has no Simplified store
  'en': { short: 'en', lng: 'en-gb' },
  'en-translated': { short: 'en', lng: 'en-gb' },
}

// Order-site paths (language-neutral), keyed by the same product-family ids as
// `products` where one exists (one order page sells every duration of a family).
export const orderPaths = {
  home: '',
  contact: '/contact',
  customer_service: '/customer-service',
  zipcode_delivery_status: '/?route=tool/zipcode_delivery_status',
  delivery_zip_api: '/-/api/delivery_zip',
  group_buy_host_form: '/?route=form/form/apply_group_buy_host',
  tasting_party_form: '/?route=form/form/tasting_party',
  // category pages
  postpartum_meals: '/postpartum-meals',
  postpartum_meals_zh: '/金品月子餐', // Chinese-slug category page
  postpartum_products: '/postpartum-products',
  sample_meals: '/sample-meals',
  // meal plans (products family ids)
  local_herbal: '/herbal-postpartum-meals',
  local_classic: '/classic-postpartum-meals',
  local_vita: '/vita-postpartum-meals',
  local_lowcarb: '/low-carb-postpartum-meals',
  local_easy: '/easy-postpartum-meals',
  local_miscarriage: '/miscarriage-healing-meals',
  local_post_surgery: '/post-surgery-meals',
  local_recovery_plus: '/recovery-plus-meals',
  local_healthy: '/healthy-meals',
  frozen: '/frozen-postpartum-meals', // zh store: one order page for all frozen plans
  frozen_herbal: '/frozen-herbal-postpartum-meals',
  frozen_classic: '/frozen-classic-postpartum-meals',
  // 冷凍活力餐 — official English name is "Essential Meal"
  frozen_essential: '/frozen-essential-postpartum-meals',
  frozen_soup_dessert: '/frozen-postpartum-soup-and-dessert',
  // Per-week frozen plan order pages. Served at the ROOT (no /en or /zh prefix)
  // — from https://order.jingmommy.com/en/sitemap.xml — so link with
  // orderUrl(key) and NO locale so the root URL is used verbatim. Keys match
  // the `products` ids. Note: 1-week is singular, 2–4 are "-weeks".
  frozen_herbal_1w: '/frozen-herbal-postpartum-meal-1-week.html',
  frozen_herbal_2w: '/frozen-herbal-postpartum-meal-2-weeks.html',
  frozen_herbal_3w: '/frozen-herbal-postpartum-meal-3-weeks.html',
  frozen_herbal_4w: '/frozen-herbal-postpartum-meal-4-weeks.html',
  frozen_classic_1w: '/frozen-classic-postpartum-meal-1-week.html',
  frozen_classic_2w: '/frozen-classic-postpartum-meal-2-weeks.html',
  frozen_classic_3w: '/frozen-classic-postpartum-meal-3-weeks.html',
  frozen_classic_4w: '/frozen-classic-postpartum-meal-4-weeks.html',
  frozen_essential_1w: '/frozen-essential-postpartum-meal-1-week.html',
  frozen_essential_2w: '/frozen-essential-postpartum-meal-2-weeks.html',
  frozen_essential_3w: '/frozen-essential-postpartum-meal-3-weeks.html',
  frozen_essential_4w: '/frozen-essential-postpartum-meal-4-weeks.html',
  frozen_soup_dessert_1w: '/frozen-postpartum-soup-and-dessert-1-week.html',
  frozen_soup_dessert_2w: '/frozen-postpartum-soup-and-dessert-2-weeks.html',
  frozen_soup_dessert_3w: '/frozen-postpartum-soup-and-dessert-3-weeks.html',
  frozen_soup_dessert_4w: '/frozen-postpartum-soup-and-dessert-4-weeks.html',
  // samples (products ids)
  local_classic_sample_1d: '/sample-meals/sample-meal.html',
  frozen_classic_sample_8item: '/sample-meals/frozen-sample-meal.html',
  // frozen soups retail (products family ids)
  frozen_taiwanese_soup: '/frozon-taiwanese-postpartum-soups',
  frozen_fish_soup: '/frozen-sea-bass-soups',
  frozen_dinner_soup: '/frozen-postpartum-stewed-soups',
  frozen_dessert: '/frozen-desserts',
  frozen_chicken_essence: '/frozen-chicken-essence',
  frozen_soup_set: '/diy-frozen-postpartum-soup-sets',
  frozen_soup_spring_4: '/four-seasons-soups-spring-4.html',
}

// All customer-facing dollar amounts, keyed by strict product id — these ids are
// shared across repos, do not rename without coordinating. Values are numbers
// (USD) in the Shopify shape { price, compare_at_price }: `price` is what the
// customer actually pays; `compare_at_price` is rendered crossed out. Format
// for display with `usd()` from src/utils. Keys with an empty object are reserved ids
// whose price is not published on this site (other repos use them).
//
// Herbal drink add-on rule: local (fresh) meals +$10/day (herbal_drink),
// frozen meals +$100/week (frozen_herbal_drink_7_1w, the with-meal add-on —
// distinct from the retail frozen_herbal_drink_7 SKU). Pages derive "+ herbal"
// bundle prices from these instead of separate keys.
export interface Product {
  price?: number
  compare_at_price?: number
  with_meal?: boolean // sold as an add-on alongside a meal plan
}
export const products = {
  // local delivery meal relatives
  local_herbal_30d: { price: 2890 },
  local_herbal_21d: { price: 2300},
  local_herbal_14d: { price: 1590},
  local_herbal_1d: { price: 120 },
  local_classic_30d: { price: 2590 },
  local_classic_21d: { price: 2090 },
  local_classic_14d: { price: 1450 },
  local_classic_1d: { price: 110 },
  local_classic_sample_1d: { price: 50 },
  local_classic_sample_8item: { price: 20 },
  local_vita_30d: { price: 2299 },
  local_vita_21d: { price: 1855 },
  local_vita_14d: { price: 1290 },
  local_vita_1d: { price: 99 },
  local_lowcarb_30d: { price: 1999 },
  local_lowcarb_21d: {price: 1620},
  local_lowcarb_14d: {price: 1120},
  local_lowcarb_1d: {price: 85},
  local_easy_15d: { price: 1550 },
  local_miscarriage_30d: { price: 2350 },
  local_miscarriage_14d: { price: 1330 },
  local_miscarriage_1d: { price: 100 },
  local_post_surgery_30d: { price: 2350 },
  local_post_surgery_14d: { price: 1330 },
  local_post_surgery_1d: { price: 100 },
  local_healthy_a_1d: { price: 65 },
  local_healthy_a2_1d: { price: 115 },
  local_healthy_b_1d: { price: 55 },
  local_healthy_b2_1d: { price: 95 },
  local_healthy_c_1d: { price: 45 },
  local_healthy_c2_1d: { price: 75 },
  local_daddy_1d: { price: 25, with_meal: true },
  local_recovery_plus_a_1d: { price: 70, compare_at_price: 75 },
  local_recovery_plus_b_1d: { price: 60, compare_at_price: 65 },
  local_recovery_plus_c_1d: { price: 45, compare_at_price: 50 },
  // local delivery add-ons relatives
  herbal_drink: { price: 10 },
  chicken_essence: { price: 10 },
  sheng_hua_tang_7: { price: 70 },
  full_moon_joy_box_single: { price: 23.99 },
  full_moon_joy_box_double: { price: 26.99 },
  // frozen meal relatives
  frozen_herbal_4w: { price: 3890 },
  frozen_herbal_3w: { price: 3190 },
  frozen_herbal_2w: { price: 2250 },
  frozen_herbal_1w: { price: 1250 },
  frozen_classic_4w: { price: 3490 },
  frozen_classic_3w: { price: 2890 },
  frozen_classic_2w: { price: 2050 },
  frozen_classic_1w: { price: 1150 },
  frozen_classic_sample_8item: { price: 80 },
  frozen_essential_4w: { price: 2790 },
  frozen_essential_3w: { price: 2190 },
  frozen_essential_2w: { price: 1590 },
  frozen_essential_1w: { price: 890 },
  frozen_soup_dessert_4w: { price: 2190 },
  frozen_soup_dessert_3w: { price: 1850 },
  frozen_soup_dessert_2w: { price: 1350 },
  frozen_soup_dessert_1w: { price: 750 },
  frozen_miscarriage_4w: { price: 3190 },
  frozen_miscarriage_2w: { price: 1950 },
  frozen_miscarriage_1w: { price: 1050 },
  frozen_post_surgery_4w: { price: 3190 },
  frozen_post_surgery_2w: { price: 1950 },
  frozen_post_surgery_1w: { price: 1050 },
  // frozen meal add-ons relatives
  frozen_herbal_drink_7_1w: { price: 100, with_meal: true },
  frozen_chicken_essence: { price: 12, with_meal: true },
  // frozen soups relatives
  frozen_taiwanese_soup_liver_7: { price: 59.99, compare_at_price: 69.99 },
  frozen_taiwanese_soup_kidney_7: { price: 59.99, compare_at_price: 69.99 },
  frozen_taiwanese_soup_chicken_7: { price: 59.99, compare_at_price: 69.99 },
  frozen_taiwanese_soup_set_224: { price: 65.99, compare_at_price: 79.99 },
  frozen_taiwanese_soup_set_448: { price: 125.99, compare_at_price: 159.99 },
  frozen_dinner_soup_warming_14: { price: 142.99, compare_at_price: 181.99 },
  frozen_dinner_soup_warming_7: { price: 79.99, compare_at_price: 90.99 },
  frozen_dinner_soup_restorative_14: { price: 168.99, compare_at_price: 209.99 },
  frozen_dinner_soup_restorative_7: { price: 92.99, compare_at_price: 104.99 },
  frozen_dessert_28: { price: 129.99, compare_at_price: 167.99 },
  frozen_dessert_14: { price: 67.99, compare_at_price: 83.99 },
  frozen_dessert_7: { price: 34.99, compare_at_price: 41.99 },
  frozen_fish_soup_28: { price: 349.99, compare_at_price: 447.99 },
  frozen_fish_soup_14: { price: 181.99, compare_at_price: 223.99 },
  frozen_fish_soup_7: { price: 97.99, compare_at_price: 111.99 },
  frozen_chicken_essence_28: { price: 259.99, compare_at_price: 335.99 },
  frozen_chicken_essence_14: { price: 132.99, compare_at_price: 167.99 },
  frozen_chicken_essence_7: { price: 69.99, compare_at_price: 83.99 },
  frozen_herbal_drink_30: { price: 355.99, compare_at_price: 419.99 },
  frozen_herbal_drink_21: { price: 249.99, compare_at_price: 293.99 },
  frozen_herbal_drink_14: { price: 174.99, compare_at_price: 195.99 },
  frozen_herbal_drink_7: { price: 90.99, compare_at_price: 97.99 },
  frozen_soup_set_basic_28: { price: 550 },
  frozen_soup_set_dessert_28: { price: 680 },
  frozen_soup_set_premium_28: { price: 940 },
  frozen_soup_set_starter_7item: { price: 66 },
  // spring4 soups relatives
  frozen_soup_spring_4_set_8: { price: 99.99 },
  frozen_soup_spring_4_set_8_custom: { price: 109.99 },
  frozen_soup_spring_4_set_12_custom: { price: 159.99 },
  frozen_sticky_rice_20oz: { price: 18 },
  frozen_sticky_rice_40oz: { price: 35 },
  frozen_taiwanese_pastries_8: { price: 25 },
  // dry goods relatives
  herbal_drink_pack_30d: { price: 349 }, // standalone 30-day herbal pack, ships nationwide
  // non food products relatives
  belly_wrap: { price: 30 },
  du_zhong_capsule: { price: 35 },
  // service fees relatives
  tasting_party_no_show_fee: { price: 20 },
  local_delivery_fee_1trip: { price: 15 },
  free_local_delivery_minimum_frozen_soup: { price: 200 }, // free delivery for frozen soup & dessert orders above $200
  local_delivery_fee_15d: { price: 200, compare_at_price: 225 }, // every other day delivery so it's 15 trips in 30 days (15 × local_delivery_fee_1trip = $225), but we charge $200 for the 30-day plan
} satisfies Record<string, Product>

// Deposit taken on multi-day (14–30 day) fresh meal plans; balance due within 3
// days of first delivery. A policy figure, not a purchasable product SKU — the
// Herbal plan carries a higher deposit than the other fresh plans. Format for
// display with `usd()` from src/utils.
export const deposits = {
  standard: 500,
  herbal: 800,
}

products.local_herbal_30d.compare_at_price ??= products.local_herbal_1d.price * 30
products.local_herbal_21d.compare_at_price ??= products.local_herbal_1d.price * 21
products.local_herbal_14d.compare_at_price ??= products.local_herbal_1d.price * 14
products.local_herbal_7d ??= {price: products.local_herbal_1d.price * 7}

products.local_classic_30d.compare_at_price ??= products.local_classic_1d.price * 30
products.local_classic_21d.compare_at_price ??= products.local_classic_1d.price * 21
products.local_classic_14d.compare_at_price ??= products.local_classic_1d.price * 14
products.local_classic_7d ??= {price: products.local_classic_1d.price * 7}
products.local_classic_sample_1d.compare_at_price ??= products.local_classic_1d.price

products.local_vita_30d.compare_at_price ??= products.local_vita_1d.price * 30
products.local_vita_21d.compare_at_price ??= products.local_vita_1d.price * 21
products.local_vita_14d.compare_at_price ??= products.local_vita_1d.price * 14
products.local_vita_7d ??= {price: products.local_vita_1d.price * 7}

products.local_lowcarb_30d.compare_at_price ??= products.local_lowcarb_1d.price * 30
products.local_lowcarb_21d.compare_at_price ??= products.local_lowcarb_1d.price * 21
products.local_lowcarb_14d.compare_at_price ??= products.local_lowcarb_1d.price * 14
products.local_lowcarb_7d ??= {price: products.local_lowcarb_1d.price * 7}

products.local_miscarriage_21d ??= {price: products.local_miscarriage_14d.price / 14 * 21, compare_at_price: products.local_miscarriage_1d.price * 21}
products.local_miscarriage_14d.compare_at_price ??= products.local_miscarriage_1d.price * 14
products.local_miscarriage_7d ??= {price: products.local_miscarriage_1d.price * 7}

products.local_post_surgery_21d ??= {price: products.local_post_surgery_14d.price / 14 * 21, compare_at_price: products.local_post_surgery_1d.price * 21}
products.local_post_surgery_14d.compare_at_price ??= products.local_post_surgery_1d.price * 14
products.local_post_surgery_7d ??= {price: products.local_post_surgery_1d.price * 7}

products.frozen_herbal_4w.compare_at_price ??= products.frozen_herbal_1w.price * 4
products.frozen_herbal_3w.compare_at_price ??= products.frozen_herbal_1w.price * 3
products.frozen_herbal_2w.compare_at_price ??= products.frozen_herbal_1w.price * 2

products.frozen_classic_4w.compare_at_price ??= products.frozen_classic_1w.price * 4
products.frozen_classic_3w.compare_at_price ??= products.frozen_classic_1w.price * 3
products.frozen_classic_2w.compare_at_price ??= products.frozen_classic_1w.price * 2

products.frozen_essential_4w.compare_at_price ??= products.frozen_essential_1w.price * 4
products.frozen_essential_3w.compare_at_price ??= products.frozen_essential_1w.price * 3
products.frozen_essential_2w.compare_at_price ??= products.frozen_essential_1w.price * 2

products.frozen_soup_dessert_4w.compare_at_price ??= products.frozen_soup_dessert_1w.price * 4
products.frozen_soup_dessert_3w.compare_at_price ??= products.frozen_soup_dessert_1w.price * 3
products.frozen_soup_dessert_2w.compare_at_price ??= products.frozen_soup_dessert_1w.price * 2

products.frozen_miscarriage_4w.compare_at_price ??= products.frozen_miscarriage_1w.price * 4
products.frozen_miscarriage_3w ??= {price: products.frozen_miscarriage_2w.price / 2 * 3, compare_at_price: products.frozen_miscarriage_1w.price * 3}
products.frozen_miscarriage_2w.compare_at_price ??= products.frozen_miscarriage_1w.price * 2

products.frozen_post_surgery_4w.compare_at_price ??= products.frozen_post_surgery_1w.price * 4
products.frozen_post_surgery_3w ??= {price: products.frozen_post_surgery_2w.price / 2 * 3, compare_at_price: products.frozen_post_surgery_1w.price * 3}
products.frozen_post_surgery_2w.compare_at_price ??= products.frozen_post_surgery_1w.price * 2

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

/**
 * Theme registry for jingmommy.com layouts.
 *
 * To add a new theme:
 *   1. Add its name to `themes` below.
 *   2. Create `src/layouts/themes/<name>/Page.astro` (required).
 *      Any layout not present in the theme folder falls back to the base theme.
 *   3. Register it in the themeLayouts map inside each layout router file.
 *
 * Pages select a theme via:
 *   - .astro files:  <Page theme="modern" ... />
 *   - .mdx files:    theme: modern  (in frontmatter)
 */

export const themes = ['base', 'modern'] as const
export type ThemeName = (typeof themes)[number]
export const defaultTheme: ThemeName = themes[0]

/**
 * Use this class string wherever you need to escape both Tailwind Typography
 * prose styles (not-prose) and Starwind's prose styles (not-sw-prose).
 * Import and apply to any element that should not inherit prose formatting.
 */
export const notProse = 'not-prose not-sw-prose'
