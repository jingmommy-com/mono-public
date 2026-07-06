import type { DeliveryLookupI18n } from '../delivery-lookup.ts'
import { products, usd } from '@/client.config.ts'

const t: DeliveryLookupI18n = {
  title: '配送地区查询',
  description: '查询您的邮递区号是否可配送月子餐及配送方式',
  intro: '请输入您的邮递区号查询是否可配送月子餐及相关配送方式。',
  label: '邮递区号',
  placeholder: 'e.g. 91789',
  button: '查询',
  messages: {
    loading: {
      class: 'text-gray-400',
      lines: ['查询中...'],
    },
    systemError: {
      class: 'text-rose-600',
      lines: ['发生错误，请稍后再试。'],
    },
    zipError: {
      class: 'text-rose-600',
      lines: ['请输入正确的五码邮递区号'],
    },
    default: {
      class: 'text-gray-700',
      lines: ['请输入五码的邮递区号'],
    },
    everyDay: {
      lines: ['每天免费新鲜配送。'],
    },
    everyOtherDayFree: {
      lines: ['每2天免费新鲜配送。'],
    },
    everyOtherDay: {
      lines: [`每月附加 ${usd(products.local_delivery_fee_15d.price)} 美元运费，每隔一天送两天的餐点。`],
    },
    frozen: {
      lines: ['冷冻运送。'],
    },
    contact: {
      lines: ['<a href="//order.jingmommy.com/customer-service" target="_blank">联系我们</a>决定运送选项'],
    },
    eastvale: {
      lines: [
        '每天配送。(Eastvale only)',
        '其他地区请<a href="//order.jingmommy.com/customer-service" target="_blank">联系我们</a>决定运送选项',
      ],
    },
  },
}

export default t
