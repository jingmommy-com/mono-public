import { locales } from './client.config.ts'
export const onRequest = async (context, next) => {
  const { pathname } = context.url
  if (pathname === '/404') {
    return next()
  }
  const hasLocale = locales.some(lang => pathname.startsWith(`/${lang}`))
  if (!hasLocale) {
    const locale = context.preferredLocale || locales[0]
    return context.redirect(`/${locale}${pathname}`)
  }
  return next()
}