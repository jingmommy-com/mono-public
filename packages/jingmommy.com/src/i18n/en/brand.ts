import type { BrandI18n } from '../brand.ts'
import { site } from '@/config/index.ts'

const t: BrandI18n = {
  tagline: `Authentic Chinese postpartum meals, delivered with care since ${site.founded}.`,
  languages: 'English & Chinese',
  domain: 'postpartummeal.com',
  promise: 'Your recovery matters, because you matter.',
}

export default t
