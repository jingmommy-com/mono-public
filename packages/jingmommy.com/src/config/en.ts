/*
  Config for the "en" locale/design — holds config used across en pages (type "b"
  in the config-placement rule; see CLAUDE.md "Config placement"). Language-shared
  facts live in client.config.ts (`site`); single-page config lives in the page.
  Business facts (plan names/prices, sample pricing) are locked per the brief.
*/
import { site } from "@/client.config.ts"

export const LOCALE = "en"
const base = `/${LOCALE}`

/** Prefix a root-relative path with the locale, e.g. route('/about/founding-story'). */
export const route = (p = "/") => (p === "/" ? `${base}/` : `${base}${p}`)

// External order-system URLs. These are cross-origin, so links to them open in a
// new tab (handled by ExternalLinksNewTab).
export const orderUrl = "https://order.jingmommy.com/en"
export const orderSampleUrl = "https://order.jingmommy.com/en/sample-meals"

/** Per-plan pages in the order system, keyed by plan (cross-origin — links to
    these open in a new tab via ExternalLinksNewTab). Built from `orderUrl`. */
export const planOrderUrls = {
  herbal: `${orderUrl}/herbal-postpartum-meals`,
  classic: `${orderUrl}/classic-postpartum-meals`,
  vita: `${orderUrl}/vita-postpartum-meals`,
  lowCarb: `${orderUrl}/low-carb-postpartum-meals`,
  easy: `${orderUrl}/easy-postpartum-meals`,
  frozenHerbal: `${orderUrl}/frozen-herbal-postpartum-meals`,
  frozenClassic: `${orderUrl}/frozen-classic-postpartum-meals`,
  // 冷凍活力餐 — official English name is "Essential Meal"
  frozenEssential: `${orderUrl}/frozen-essential-postpartum-meals`,
  frozenSoupDessert: `${orderUrl}/frozen-postpartum-soup-and-dessert`,
}

export const brand = {
  // language-shared facts, from client.config.ts `site`
  name: site.brandName,
  phone: site.phone,
  // derived from `phone` (no separately-maintained value)
  phoneHref: `tel:${site.phone.replace(/[^0-9]/g, "")}`,
  email: site.email,
  address: site.address,
  city: site.city,
  founded: site.founded,
  mothersServed: site.mothersServed,
  // en-only copy
  tagline:
    "Authentic Chinese postpartum meals, delivered with care since 2010.",
  languages: "English & Chinese",
  domain: "postpartummeal.com",
  promise: "Your recovery matters, because you matter.",
}

/** Primary top-bar navigation (Try a Taste is rendered as the CTA). */
export const nav = [
  { label: "Our Story", href: route("/about/founding-story") },
  { label: "Why Zuo Yue Zi", href: route("/guide/why-zuo-yue-zi") },
  { label: "Food Therapy", href: route("/guide/chinese-food-therapy") },
  { label: "Meal Plans", href: route("/plans") },
  { label: "Real Stories", href: route("/about/testimonial") },
]

export const navCta = { label: "Try a Taste", href: route("/sample") }

export const footerColumns = [
  {
    heading: "Explore",
    links: [
      { label: "Our Story", href: route("/about/founding-story") },
      { label: "Why Zuo Yue Zi", href: route("/guide/why-zuo-yue-zi") },
      { label: "Chinese Food Therapy", href: route("/guide/chinese-food-therapy") },
      { label: "Meal Plans", href: route("/plans") },
      { label: "Real Stories", href: route("/about/testimonial") },
    ],
  },
  {
    heading: "Get Started",
    links: [
      { label: "Try a Taste", href: route("/sample") },
      { label: "FAQ", href: route("/faq") },
      { label: "Contact", href: route("/contact") },
    ],
  },
  {
    heading: "Reach Us",
    links: [
      { label: brand.phone, href: brand.phoneHref },
      { label: brand.languages, href: route("/contact") },
      { label: brand.city },
      { label: "Fresh local · Frozen nationwide" },
    ],
  },
]

/** The five 30-day meal plans. Names + prices are locked business facts. */
export const plans = [
  {
    name: "Herbal",
    price: "$2,890",
    per: "30 days",
    featured: true,
    badge: "Most complete",
    desc: "The full, uncompromising experience — three meals plus a daily herbal drink. The closest thing to a grandmother cooking for you.",
    persona: "For the mom who wants to do this completely.",
  },
  {
    name: "Classic",
    price: "$2,590",
    per: "30 days",
    desc: "Complete daily support without the guesswork. Three warm, comforting meals a day — meals that feel like Mom’s.",
    persona: "For the mom who wants daily care, simply.",
  },
  {
    name: "Vita",
    price: "$2,299",
    per: "30 days",
    desc: "A lighter, minimalist take — two nourishing meals a day plus a dessert. Perfect for smaller appetites or warmer seasons.",
    persona: "For the mom who prefers lighter portions.",
  },
  {
    name: "Low Carb",
    price: "$1,999",
    per: "30 days",
    desc: "The same warm healing, without rice, grains, or sweet drinks. For the mom caring for her body on her own terms.",
    persona: "For the mom managing blood sugar or going grain-free.",
  },
  {
    name: "Easy",
    price: "$1,550",
    per: "30 days · 15 deliveries",
    desc: "Nourishment with breathing room — warm meals every other day. Ideal if you have help at home and want to supplement.",
    persona: "For the mom who has family helping and wants to fill the gaps.",
  },
]
