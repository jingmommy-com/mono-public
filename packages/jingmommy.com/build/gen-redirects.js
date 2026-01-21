import fs from 'fs'
import path from 'path'

export const redirects = [
  // map: from old jingmommy.com site urls to new
  { from: "/about-jingmommy", to: "/about" },
  { from: "/about-jingmommy/", to: "/about" },
  { from: "/about-jingmommy/jingmommy-founding-story.html", to: "/about/founding-story" },
  { from: "/about-jingmommy/why-choose-jingmommy.html", to: "/about/why-us" },
  { from: "/about-jingmommy/central-kitchen.html", to: "/about/central-kitchen" },
  { from: "/about-jingmommy/jingmommy-team.html", to: "/about/team" },
  { from: "/about-jingmommy/in-the-media", to: "/news" },
  { from: "/about-jingmommy/in-the-media/", to: "/news" },
  { from: "/about-jingmommy/la-times-洛杉磯時報.html", to: "/news/la-times" },
  { from: "/about-jingmommy/in-the-media/la-times-洛杉磯時報.html", to: "/news/la-times" },
  { from: "/about-jingmommy/中天-中旺新聞.html", to: "/news/ctitv" },
  { from: "/about-jingmommy/in-the-media/中天-中旺新聞.html", to: "/news/ctitv" },
  { from: "/about-jingmommy/東森-超視新聞報導.html", to: "/news/ettvamerica" },
  { from: "/about-jingmommy/in-the-media/東森-超視新聞報導.html", to: "/news/ettvamerica" },
  { from: "/about-jingmommy/sharing.html", to: "/about/testimonial" },
  { from: "/about-jingmommy/social-medias.html", to: "/about/social-media" },
]

const redirectsContent = redirects.map(r => 
  `${r.from} ${r.to} 302!`
).join('\n') + '\n'

const outputPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../public/_redirects')
fs.writeFileSync(outputPath, redirectsContent, { encoding: 'utf8' })
