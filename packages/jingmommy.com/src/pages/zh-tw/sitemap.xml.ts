import routeMap from '@/route-map.json'
import { site } from '@/client.config.ts'


export async function GET() {
  const locale = 'zh-tw'
  const prefix = `/${locale}`
  const excluded = new Set(['/404', '/'])
  type RouteEntry = { sitemap?: boolean }
  const allRoutes = routeMap as Record<string, RouteEntry>

  const urls = Object.entries(allRoutes)
    .filter(([href, meta]) => (href.startsWith(prefix) || href === prefix) && !excluded.has(href) && meta.sitemap !== false)
    .map(([href]) => href)
    .sort()
    .map(href => `  <url>\n    <loc>${site.url}${href}</loc>\n  </url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
