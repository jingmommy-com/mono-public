/**
 * Theme registry for jingmommy.com layouts.
 *
 * To add a new theme:
 *   1. Add its name to `themes` below.
 *   2. Create `src/layouts/themes/<name>/Page.astro` (required).
 *      Any layout not present in the theme folder falls back to the base theme.
 *   3. Register it in the themeLayouts map inside each layout router file.
 *
 * Pages select a theme via:
 *   - .astro files:  <Page theme="modern" ... />
 *   - .mdx files:    theme: modern  (in frontmatter)
 */

export const themes = ['base', 'modern'] as const
export type ThemeName = (typeof themes)[number]
export const defaultTheme: ThemeName = themes[0]

/**
 * Use this class string wherever you need to escape both Tailwind Typography
 * prose styles (not-prose) and Starwind's prose styles (not-sw-prose).
 * Import and apply to any element that should not inherit prose formatting.
 */
export const notProse = 'not-prose not-sw-prose'
