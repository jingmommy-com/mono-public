import { locales } from './client.config.ts'
export const onRequest = async (context, next) => {
  const { pathname } = context.url
  const shared = [
    '/404',
    '/delivery-lookup',
  ]
  if (shared.includes(pathname)) {
    return next()
  }
  const hasLocale = locales.some(lang => pathname.startsWith(`/${lang}`))
  if (!hasLocale) {
    const locale = context.preferredLocale || locales[0]
    return context.redirect(`/${locale}${pathname}`)
  }
  return next()
}