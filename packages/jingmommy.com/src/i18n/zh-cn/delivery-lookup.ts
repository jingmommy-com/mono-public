import type { DeliveryLookupI18n } from '../delivery-lookup.ts'

const t: DeliveryLookupI18n = {
  title: '配送地区查询',
  description: '查询您的邮递区号是否可配送月子餐及配送方式',
  intro: '请输入您的邮递区号查询是否可配送月子餐及相关配送方式。',
  label: '邮递区号',
  placeholder: 'e.g. {postalCode}',
  button: '查询',
  messages: {
    loading: ['查询中...'],
    systemError: ['发生错误，请稍后再试。'],
    zipError: ['请输入正确的五码邮递区号'],
    default: ['请输入五码的邮递区号'],
    everyDay: ['每天免费新鲜配送。'],
    everyOtherDayFree: ['每2天免费新鲜配送。'],
    everyOtherDay: ['每月附加 {shippingSurcharge} 美元运费，每隔一天送两天的餐点。'],
    frozen: ['冷冻运送。'],
    contact: ['<a href="{customerServiceUrl}" target="_blank">联系我们</a>决定运送选项'],
    eastvale: [
        '每天配送。(Eastvale only)',
        '其他地区请<a href="{customerServiceUrl}" target="_blank">联系我们</a>决定运送选项',
      ],
  },
}

export default t
