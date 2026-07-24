import { defineMiddleware } from 'astro:middleware'

/*
  The single controller for "open external links in a new tab".

  Runs at build time (static output) for every rendered page, so the result is
  plain static HTML — every external <a> (href starting with http(s):// or //)
  gets target="_blank" rel="noopener noreferrer" baked in. No client-side JS, no
  per-link attributes to maintain: add an external link anywhere and it is
  handled here. Links that already declare a target are left untouched.
*/
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()
  const type = response.headers.get('content-type') || ''
  if (!type.includes('text/html')) return response

  const html = (await response.text()).replace(/<a\s([^>]*)>/g, (tag, attrs) => {
    if (!/href="(?:https?:)?\/\//.test(attrs)) return tag // external only
    if (/\btarget\s*=/.test(attrs)) return tag // respect an explicit target
    return `<a ${attrs} target="_blank" rel="noopener noreferrer">`
  })

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
})
