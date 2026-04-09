export function isExternalLink(href: string) {
  if (/^(\/*https?:)?\/\//.test(href)) {
    return true
  }
  return false
}

/**
 * Tracks the live header height and writes it to the CSS variable
 * `--header-height` on <html>. Pair with `scroll-margin-top: var(--header-height)`
 * on target elements so hash-link navigation clears the fixed header.
 *
 * Also re-scrolls to any hash already in the URL after the variable is set,
 * so direct links like /faq#section-meal land in the right place.
 */
export function initAnchorOffset(): void {
  const setVar = () => {
    const header = document.querySelector<HTMLElement>('header')
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
    }
  }

  setVar()

  const header = document.querySelector('header')
  if (header) new ResizeObserver(setVar).observe(header)

  // Re-scroll after the CSS variable is applied so the initial hash lands correctly
  if (location.hash) {
    requestAnimationFrame(() => {
      try {
        const el = document.querySelector(location.hash)
        el?.scrollIntoView({ block: 'start' })
      } catch {
        // ignore invalid selectors
      }
    })
  }
}