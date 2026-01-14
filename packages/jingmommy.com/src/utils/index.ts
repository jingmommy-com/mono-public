export function isExternalLink(href: string) {
  if (/^(\/*https?:)?\/\//.test(href)) {
    return true
  }
  return false
}