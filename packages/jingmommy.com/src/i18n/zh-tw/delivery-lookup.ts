import type { DeliveryLookupI18n } from '../delivery-lookup.ts'

const t: DeliveryLookupI18n = {
  title: '配送地區查詢',
  description: '查詢您的郵遞區號是否可配送月子餐及配送方式',
  intro: '請輸入您的郵遞區號查詢是否可配送月子餐及相關配送方式。',
  label: '郵遞區號',
  placeholder: 'e.g. {postalCode}',
  button: '查詢',
  messages: {
    loading: ['查詢中...'],
    systemError: ['發生錯誤，請稍後再試。'],
    zipError: ['請輸入正確的五碼郵遞區號'],
    default: ['請輸入五碼的郵遞區號'],
    everyDay: ['每天免費新鮮配送。'],
    everyOtherDayFree: ['每2天免費新鮮配送。'],
    everyOtherDay: ['每月附加 {shippingSurcharge} 美元運費，每隔一天送兩天的餐點。'],
    frozen: ['冷凍運送。'],
    contact: ['<a href="{customerServiceUrl}" target="_blank">聯繫我們</a>決定運送選項'],
    eastvale: [
        '每天配送。(Eastvale only)',
        '其他地區請<a href="{customerServiceUrl}" target="_blank">聯繫我們</a>決定運送選項',
      ],
  },
}

export default t
