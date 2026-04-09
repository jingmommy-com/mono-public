export interface DeliveryLookupMsg {
  class?: string
  lines: string[]
}

export interface DeliveryLookupI18n {
  title: string
  description: string
  intro: string
  label: string
  placeholder: string
  button: string
  messages: {
    loading: DeliveryLookupMsg
    systemError: DeliveryLookupMsg
    zipError: DeliveryLookupMsg
    default: DeliveryLookupMsg
    everyDay: DeliveryLookupMsg
    everyOtherDayFree: DeliveryLookupMsg
    everyOtherDay: DeliveryLookupMsg
    frozen: DeliveryLookupMsg
    contact: DeliveryLookupMsg
    eastvale: DeliveryLookupMsg
  }
}
