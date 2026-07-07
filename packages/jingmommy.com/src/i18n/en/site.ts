import type { SiteI18n } from '../site.ts'
import { site } from '@/config/index.ts'
import { formatNumber } from '@/utils/index.ts'

const t: SiteI18n = {
  title: 'JingMommy - Postpartum Meal Delivery, Confinement Meals & Recovery Cuisine in the US',
  description: `JingMommy delivers authentic Chinese postpartum (Zuo Yue Zi) meals across the US. Founded ${site.founded}, ${formatNumber(site.mothersServed)}+ mothers served. Fresh daily in SoCal, frozen nationwide.`,
  keywords: [
    'postpartum meal delivery',
    'confinement meal',
    'postpartum meals USA',
    'confinement food delivery',
    'postpartum recovery meals',
    'Chinese confinement meals',
    'postpartum meal service',
    'postpartum catering',
    'frozen postpartum meals',
    'miscarriage recovery meals',
    'post surgery meals',
    'postpartum meal California',
    'Los Angeles postpartum meals',
    'postpartum meal plan',
    'confinement care',
  ],
}

export default t
