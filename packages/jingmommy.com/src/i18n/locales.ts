// Display metadata for every locale in client.config.ts `locales`.
// Labels are autonyms (each language's name in that language), so the same
// label is shown on every site — this file is shared, not per-locale.
export interface LocaleMeta {
  label: string
  hreflang: string
}

const localeMeta: Record<string, LocaleMeta> = {
  'en': { label: 'English', hreflang: 'en' },
  'zh-tw': { label: '繁體中文', hreflang: 'zh-Hant-TW' },
  'zh-cn': { label: '简体中文', hreflang: 'zh-Hans-CN' },
  'en-old': { label: 'English (Old)', hreflang: 'en' },
}

export default localeMeta
