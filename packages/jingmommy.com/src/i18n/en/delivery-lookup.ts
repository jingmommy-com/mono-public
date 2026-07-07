import type { DeliveryLookupI18n } from '../delivery-lookup.ts'

const t: DeliveryLookupI18n = {
  title: 'Delivery Area Lookup',
  description: 'Check if your zip code is eligible for postpartum meal delivery and see available shipping methods.',
  intro: 'Enter your zip code below to check if your address qualifies for postpartum meal delivery and see available delivery options.',
  label: 'Zip Code',
  placeholder: 'e.g. {postalCode}',
  button: 'Check',
  messages: {
    loading: ['Loading...'],
    systemError: ['Something went wrong. Please try again later.'],
    zipError: ['Please enter a valid 5-digit zip code.'],
    default: ['Please enter your zip code above.'],
    everyDay: ['Free delivery every day.'],
    everyOtherDayFree: ['Free delivery every other day.'],
    everyOtherDay: ["Delivery every other day (two days' meals per delivery) with a {shippingSurcharge}/month shipping surcharge."],
    frozen: ['Frozen meal delivery available.'],
    contact: ['<a href="{customerServiceUrl}" target="_blank">Contact us</a> to determine delivery options.'],
    eastvale: [
        'Free delivery every day. (Eastvale only)',
        'For other areas, please <a href="{customerServiceUrl}" target="_blank">contact us</a> to determine delivery options.',
      ],
  },
}

export default t
