/*
  Locale → resource maps for the i18n domains, plus the path → locale helper.
  Components must resolve their strings from here instead of hardcoding
  locale maps inline. `en-translated` reuses the en resources.

  Per-locale pages (e.g. zh-tw/delivery-lookup.astro) may still import their
  own locale's file directly — that's page-level i18n, not component config.
*/
import type { SiteI18n } from './site.ts'
import type { FooterI18n } from './footer.ts'
import type { LookupZipButtonI18n } from './lookup-zip-button.ts'
import type { TastingPartyI18n } from './tasting-party.ts'
import zhTwSite from './zh-tw/site.ts'
import zhCnSite from './zh-cn/site.ts'
import enSite from './en/site.ts'
import zhTwFooter from './zh-tw/footer.ts'
import zhCnFooter from './zh-cn/footer.ts'
import enFooter from './en/footer.ts'
import zhTwLookupZipButton from './zh-tw/lookup-zip-button.ts'
import zhCnLookupZipButton from './zh-cn/lookup-zip-button.ts'
import enLookupZipButton from './en/lookup-zip-button.ts'
import zhTwTastingParty from './zh-tw/tasting-party.ts'
import zhCnTastingParty from './zh-cn/tasting-party.ts'
import enTastingParty from './en/tasting-party.ts'

export const siteI18n: Record<string, SiteI18n> = {
  'zh-tw': zhTwSite,
  'zh-cn': zhCnSite,
  'en': enSite,
  'en-translated': enSite,
}

export const footerI18n: Record<string, FooterI18n> = {
  'zh-tw': zhTwFooter,
  'zh-cn': zhCnFooter,
  'en': enFooter,
  'en-translated': enFooter,
}

export const lookupZipButtonI18n: Record<string, LookupZipButtonI18n> = {
  'zh-tw': zhTwLookupZipButton,
  'zh-cn': zhCnLookupZipButton,
  'en': enLookupZipButton,
  'en-translated': enLookupZipButton,
}

export const tastingPartyI18n: Record<string, TastingPartyI18n> = {
  'zh-tw': zhTwTastingParty,
  'zh-cn': zhCnTastingParty,
  'en': enTastingParty,
  'en-translated': enTastingParty,
}

