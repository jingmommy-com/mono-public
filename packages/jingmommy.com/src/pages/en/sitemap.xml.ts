import routeMap from '@/route-map.json'
import { siteDomains } from '@/config/index.ts'

// read by scripts/index.js so this route is excluded from the sitemap listing
const sitemap = false
void sitemap

export async function GET() {
  const locale = 'en'
  const prefix = `/${locale}`
  const excluded = new Set(['/404', '/'])
  // en lives on postpartummeal.com (siteDomains is the single source of truth)
  const domain = Object.keys(siteDomains).find((d) => siteDomains[d].includes(locale)) ?? 'postpartummeal.com'
  const baseUrl = `https://${domain}`

  type RouteEntry = { sitemap?: boolean }
  const allRoutes = routeMap as Record<string, RouteEntry>

  const urls = Object.entries(allRoutes)
    .filter(([href, meta]) => (href === prefix || href.startsWith(prefix + '/')) && !excluded.has(href) && meta.sitemap !== false)
    .map(([href]) => href)
    .sort()
    .map((href) => `  <url>\n    <loc>${baseUrl}${href}</loc>\n  </url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
