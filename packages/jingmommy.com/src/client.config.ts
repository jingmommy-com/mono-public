export const locales = [
  'zh-tw',
  'zh-cn',
  'en',
  'en-old',
]
// The default locale is always the first entry above. Shared with astro.config.js
// (i18n.locales / defaultLocale) so there is a single source of truth for locales.
export const defaultLocale = locales[2]

// Production domains and the locales each one owns. The SAME build is deployed to
// every domain; language switching only hops between domains when running on one of
// these production hosts (matched with or without a leading "www."). Other hosts —
// local dev and the jingmeal.com staging environment — stay same-origin (no hop).
// See packages/jingmommy.com/CLAUDE.md ("Locale ↔ domain routing").
export const siteDomains: Record<string, string[]> = {
  'jingmommy.com': ['zh-tw', 'zh-cn'],
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
// All customer-facing dollar amounts, keyed by strict product id — these ids are
// shared across repos, do not rename without coordinating. Values are numbers
// (USD) in the Shopify shape { price, compare_at_price }: `price` is what the
// customer actually pays; `compare_at_price` is rendered crossed out. Format
// for display with `usd()` below. Keys with an empty object are reserved ids
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

// USD display format: 1234 => $1,234 ; 59.99 => $59.99
export const usd = (n: number) => `$${n.toLocaleString('en-US')}`

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