import type { DeliveryLookupI18n } from '../delivery-lookup.ts'

const t: DeliveryLookupI18n = {
  title: '配送地區查詢',
  description: '查詢您的郵遞區號是否可配送月子餐及配送方式',
  intro: '請輸入您的郵遞區號查詢是否可配送月子餐及相關配送方式。',
  label: '郵遞區號',
  placeholder: 'e.g. 91789',
  button: '查詢',
  messages: {
    loading: {
      class: 'text-gray-400',
      lines: ['查詢中...'],
    },
    systemError: {
      class: 'text-rose-600',
      lines: ['發生錯誤，請稍後再試。'],
    },
    zipError: {
      class: 'text-rose-600',
      lines: ['請輸入正確的五碼郵遞區號'],
    },
    default: {
      class: 'text-gray-700',
      lines: ['請輸入五碼的郵遞區號'],
    },
    everyDay: {
      lines: ['每天免費新鮮配送。'],
    },
    everyOtherDayFree: {
      lines: ['每2天免費新鮮配送。'],
    },
    everyOtherDay: {
      lines: ['每月附加 $200 美元運費，每隔一天送兩天的餐點。'],
    },
    frozen: {
      lines: ['冷凍運送。'],
    },
    contact: {
      lines: ['<a href="//order.jingmommy.com/customer-service" target="_blank">聯繫我們</a>決定運送選項'],
    },
    eastvale: {
      lines: [
        '每天配送。(Eastvale only)',
        '其他地區請<a href="//order.jingmommy.com/customer-service" target="_blank">聯繫我們</a>決定運送選項',
      ],
    },
  },
}

export default t
