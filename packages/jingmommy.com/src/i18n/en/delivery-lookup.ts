import type { DeliveryLookupI18n } from '../delivery-lookup.ts'

const t: DeliveryLookupI18n = {
  title: 'Delivery Area Lookup',
  description: 'Check if your zip code is eligible for postpartum meal delivery and see available shipping methods.',
  intro: 'Enter your zip code below to check if your address qualifies for postpartum meal delivery and see available delivery options.',
  label: 'Zip Code',
  placeholder: 'e.g. 91789',
  button: 'Check',
  messages: {
    loading: {
      class: 'text-gray-400',
      lines: ['Loading...'],
    },
    systemError: {
      class: 'text-rose-600',
      lines: ['Something went wrong. Please try again later.'],
    },
    zipError: {
      class: 'text-rose-600',
      lines: ['Please enter a valid 5-digit zip code.'],
    },
    default: {
      class: 'text-gray-700',
      lines: ['Please enter your zip code above.'],
    },
    everyDay: {
      lines: ['Free delivery every day.'],
    },
    everyOtherDayFree: {
      lines: ['Free delivery every other day.'],
    },
    everyOtherDay: {
      lines: ["Delivery every other day (two days' meals per delivery) with a $200/month shipping surcharge."],
    },
    frozen: {
      lines: ['Frozen meal delivery available.'],
    },
    contact: {
      lines: ['<a href="//order.jingmommy.com/customer-service" target="_blank">Contact us</a> to determine delivery options.'],
    },
    eastvale: {
      lines: [
        'Free delivery every day. (Eastvale only)',
        'For other areas, please <a href="//order.jingmommy.com/customer-service" target="_blank">contact us</a> to determine delivery options.',
      ],
    },
  },
}

export default t
