import fs from 'fs'
import path from 'path'

export const redirectSources = [
  // map: from old jingmommy.com site urls to new
  { lang: 'zh-tw', from: "/about-jingmommy", to: "/about" },
  { lang: 'zh-tw', from: "/about-jingmommy/", to: "/about" },
  { lang: 'zh-tw', from: "/about-jingmommy/jingmommy-founding-story.html", to: "/about/founding-story" },
  { lang: 'zh-tw', from: "/about-jingmommy/why-choose-jingmommy.html", to: "/about/why-us" },
  { lang: 'zh-tw', from: "/about-jingmommy/central-kitchen.html", to: "/about/central-kitchen" },
  { lang: 'zh-tw', from: "/about-jingmommy/jingmommy-team.html", to: "/about/team" },
  { lang: 'zh-tw', from: "/about-jingmommy/in-the-media", to: "/news" },
  { lang: 'zh-tw', from: "/about-jingmommy/in-the-media/", to: "/news" },
  { lang: 'zh-tw', from: "/about-jingmommy/la-times-洛杉磯時報.html", to: "/news/la-times" },
  { lang: 'zh-tw', from: "/about-jingmommy/in-the-media/la-times-洛杉磯時報.html", to: "/news/la-times" },
  { lang: 'zh-tw', from: "/about-jingmommy/中天-中旺新聞.html", to: "/news/ctitv" },
  { lang: 'zh-tw', from: "/about-jingmommy/in-the-media/中天-中旺新聞.html", to: "/news/ctitv" },
  { lang: 'zh-tw', from: "/about-jingmommy/東森-超視新聞報導.html", to: "/news/ettvamerica" },
  { lang: 'zh-tw', from: "/about-jingmommy/in-the-media/東森-超視新聞報導.html", to: "/news/ettvamerica" },
  { lang: 'zh-tw', from: "/about-jingmommy/sharing.html", to: "/about/testimonial" },
  { lang: 'zh-tw', from: "/about-jingmommy/social-medias.html", to: "/about/social-media" },
]

// ref: https://developers.cloudflare.com/pages/configuration/redirects/
const defaultCode = 307
const redirects = []
for (const row of redirectSources) {
  redirects.push([
    row.from,
    row.lang
      ? `/${row.lang}${row.to}`
      : row.to,
    row.code ?? defaultCode
  ])
}
const redirectsContent = redirects.map(r => r.join(' ')).join('\n') + '\n'
const outputPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../public/_redirects')
fs.writeFileSync(outputPath, redirectsContent, { encoding: 'utf8' })
