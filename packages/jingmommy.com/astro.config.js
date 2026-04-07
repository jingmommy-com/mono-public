import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'

import tailwindcss from '@tailwindcss/vite'
import { generateRouteFiles } from './src/scripts/index.js'

/*
  Why does generateRouteFiles not trigger correctly when running `astro dev`?
  -----------------------------------------------------------------------------
  Even with a Vite plugin watcher, there may be issues if you only use the integration's
  `astro:server:setup` hook, or if the watcher is not triggering at the right time.

  The best guarantee is to proactively call generateRouteFiles immediately 
  when the config loads during dev and again via the watcher, so there is 
  always a valid route-map.json before startup and after any change.

  This config now ensures:
    1. Route files are generated _at dev startup_ (before the dev server responds).
    2. File watching still triggers fresh route-map.json after add/change/unlink to relevant files.
*/

// Immediately generateRouteFiles at dev startup, outside of hooks
if (process.env.NODE_ENV === 'development') {
  generateRouteFiles()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('[route-map] Initial route files generated for dev startup')
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error('[route-map] Error generating initial route files:', e)
    })
}

/**
 * Rehype plugin: rewrites root-relative links in MDX files to include the
 * locale prefix derived from the file path (e.g. /about → /zh-tw/about).
 * This runs at build time so the generated HTML already has correct URLs.
 * @param {string[]} locales
 */
function makeRehypeLocaleLinks(locales) {
  return () => (tree, file) => {
    const fp = ((file.history ?? [])[0] ?? file.path ?? '').replace(/\\/g, '/')
    const locale = locales.find(l => fp.includes(`/pages/${l}/`))
    if (!locale) return
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        console.log(node)
        const href = node.properties?.href
        if (
          typeof href === 'string' &&
          href.startsWith('/') &&
          !locales.some(l => href.startsWith(`/${l}/`) || href === `/${l}`)
        ) {
          node.properties.href = `/${locale}${href}`
        }
      }
      for (const child of (node.children ?? [])) walk(child)
    }
    walk(tree)
  }
}

// helper to recursively watch all files in a directory
/**
 * @param {string} dir
 * @param {(eventType: string, filePath: string) => void} onEvent
 * @param {string[]} extensions
 * @param {fs.FSWatcher[]} watchers
 */
function watchDirRecursive(dir, onEvent, extensions, watchers) {
  if (!fs.existsSync(dir)) return
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      watchDirRecursive(fullPath, onEvent, extensions, watchers)
    } else if (
      file.isFile() &&
      extensions.includes(path.extname(file.name).toLowerCase())
    ) {
      const watcher = fs.watch(fullPath, (eventType) => {
        onEvent(eventType, fullPath)
      })
      watchers.push(watcher)
    }
  }
  // Also watch the directory itself for new/unlinked files
  const dirWatcher = fs.watch(dir, (eventType, filename) => {
    if (typeof filename !== 'string') return
    const ext = path.extname(filename).toLowerCase()
    if (extensions.includes(ext)) {
      const filePath = path.join(dir, filename)
      onEvent(eventType, filePath)
    }
    setTimeout(() => {
      for (let i = watchers.length - 1; i >= 0; i--) {
        const watcherObj = watchers[i]
        if (
          typeof watcherObj.close === 'function' &&
          watcherObj.constructor &&
          watcherObj.constructor.name === 'FSWatcher'
        ) {
          try {
            watcherObj.close()
            watchers.splice(i, 1)
          } catch {}
        }
      }
      watchDirRecursive(dir, onEvent, extensions, watchers)
    }, 100)
  })
  watchers.push(dirWatcher)
}

export default defineConfig({
  site: 'https://jingmeal.com',
  compressHTML: true,
  integrations: [
    mdx({
      rehypePlugins: [makeRehypeLocaleLinks(['zh-tw', 'en'])],
    }),
    sitemap(),
    icon(),
    {
      name: 'route-map-autogen',
      hooks: {
        'astro:build:setup': async ({ logger }) => {
          await generateRouteFiles(logger)
        },
        'astro:server:setup': async ({ logger }) => {
          // Also run at dev server setup in case watcher is missed
          await generateRouteFiles(logger)
        },
      },
    },
  ],
  vite: {
    plugins: [
      // @ts-expect-error
      tailwindcss(),
      {
        name: 'route-map-native-watch',
        apply: 'serve',
        async configureServer(server) {
          const pagesDir = path.resolve(process.cwd(), 'src/pages')
          const watchedExtensions = [
            '.md', '.mdx', '.astro', '.js', '.ts', '.jsx', '.tsx',
          ]

          /** @type {NodeJS.Timeout | null} */
          let debounceTimer = null
          /**
           * @param {string} event
           * @param {string} filePath
           */
          const trigger = async (event, filePath) => {
            if (!watchedExtensions.includes(path.extname(filePath).toLowerCase())) return
            if (debounceTimer) clearTimeout(debounceTimer)
            debounceTimer = setTimeout(async () => {
              // eslint-disable-next-line no-console
              try {
                await generateRouteFiles()
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('[route-map] Failed to update:', e)
              }
            }, 75)
          }

          /** @type {fs.FSWatcher[]} */
          const watchers = []
          watchDirRecursive(pagesDir, trigger, watchedExtensions, watchers)

          server.httpServer?.on('close', () => {
            for (const watcher of watchers) {
              try {
                watcher.close()
              } catch {}
            }
          })
        },
      },
    ],
  },
  i18n: {
    locales: ['zh-tw', 'en'],
    defaultLocale: 'zh-tw',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
    // domains: {
    //   'zh-tw': 'https://jingmommy.com',
    //   en: 'https://postpartummeal.com',
    // }
  },
  image: {
    domains: [
      'www.jingmommy.com',
      'jingmommy.com',
      'file.jingmommy.com',
      'order.jingmommy.com',
      'www.mommybaobao.com',
      'mommybaobao.com',
      'jingmeal.com',
    ],
  },
  redirects: {
    // en
    '/en/plans': '/en',
    '/en/sample': '/en',
    '/en/cs': '/en/customer-service',
    '/en/tos': '/en/term-of-service',
    // zh-tw
    '/zh-tw/plans': '/zh-tw',
    '/zh-tw/sample': '/zh-tw',
    '/zh-tw/cs': '/zh-tw/customer-service',
    '/zh-tw/tos': '/zh-tw/term-of-service',

    // history reason for old www.jingmommy.com website
    /**
     * About section
     */
    // https://www.jingmommy.com/about-jingmommy/
    "/about-jingmommy": "/about",
    // https://www.jingmommy.com/about-jingmommy/jingmommy-founding-story.html
    "/about-jingmommy/jingmommy-founding-story.html": "/about/founding-story",
    // https://www.jingmommy.com/about-jingmommy/why-choose-jingmommy.html
    "/about-jingmommy/why-choose-jingmommy.html": "/about/why-us",
    // https://www.jingmommy.com/about-jingmommy/central-kitchen.html
    "/about-jingmommy/central-kitchen.html": "/about/central-kitchen",
    // https://www.jingmommy.com/about-jingmommy/jingmommy-team.html
    "/about-jingmommy/jingmommy-team.html": "/about/team",
    // https://www.jingmommy.com/about-jingmommy/social-medias.html
    "/about-jingmommy/social-medias.html": "/about/social-media",
    // https://www.jingmommy.com/about-jingmommy/sharing.html
    "/about-jingmommy/sharing.html": "/about/testimonial",
    // https://www.jingmommy.com/about-jingmommy/postpartum-meal-tv-channel.html
    "/about-jingmommy/postpartum-meal-tv-channel.html": "/news", // remove the page, and redirect to news
    // https://www.jingmommy.com/social-videos/
    "/social-videos": "/about/social-video",
    // https://www.jingmommy.com/actual-meal-gallery/
    "/actual-meal-gallery": "/gallery/dish",
    /** News */
    // https://www.jingmommy.com/about-jingmommy/in-the-media/
    "/about-jingmommy/in-the-media": "/news",
    // https://www.jingmommy.com/about-jingmommy/in-the-media/la-times-洛杉磯時報.html
    "/about-jingmommy/in-the-media/la-times-洛杉磯時報.html": "/news/la-times",
    // https://www.jingmommy.com/about-jingmommy/in-the-media/中天-中旺新聞.html
    "/about-jingmommy/in-the-media/中天-中旺新聞.html": "/news/ctitv",
    // https://www.jingmommy.com/about-jingmommy/in-the-media/東森-超視新聞報導.html
    "/about-jingmommy/in-the-media/東森-超視新聞報導.html": "/news/ettvamerica",
    // https://www.jingmommy.com/about-jingmommy/in-the-media/世界新聞網-洛杉磯訊.html
    "/about-jingmommy/in-the-media/世界新聞網-洛杉磯訊.html": "/news", // original is empty, so remove and redirect to news
    /**
     * Postpartum Meals
     */
    // https://www.jingmommy.com/postpartum-meals/
    "/postpartum-meals": "/postpartum-meals",
    // https://www.jingmommy.com/月子膳食/
    "/月子膳食": "/postpartum-meals",
    // https://www.jingmommy.com/postpartum-meals/herba-postpartum-meal.html
    "/postpartum-meals/herba-postpartum-meal.html": "/postpartum-meals/herbal-postpartum-meals",
    // https://www.jingmommy.com/postpartum-meals/deluxe-postpartum-meal.html
    "/postpartum-meals/deluxe-postpartum-meal.html": "/postpartum-meals/classic-postpartum-meals",
    // https://www.jingmommy.com/postpartum-meals/nourishing-postpartum-soup.html
    "/postpartum-meals/nourishing-postpartum-soup.html": "/postpartum-meals", // This product is discontinued; redirect to the index
    // https://www.jingmommy.com/postpartum-meals/vita-postpartum-meal.html
    "/postpartum-meals/vita-postpartum-meal.html": "/postpartum-meals/vita-postpartum-meals",
    // https://www.jingmommy.com/postpartum-meals/low-carb-postpartum-meal.html
    "/postpartum-meals/low-carb-postpartum-meal.html": "/postpartum-meals/low-carb-postpartum-meals",
    // https://www.jingmommy.com/postpartum-meals/easy-postpartum-meal.html
    "/postpartum-meals/easy-postpartum-meal.html": "/postpartum-meals/easy-postpartum-meals",
    // https://www.jingmommy.com/postpartum-meals/frozen-postpartum-meal-delivery.html
    "/postpartum-meals/frozen-postpartum-meal-delivery.html": "/postpartum-meals/frozen-postpartum-meals",
    // https://www.jingmommy.com/postpartum-meals/postpartum-recovery-meal.html
    "/postpartum-meals/postpartum-recovery-meal.html": "/postpartum-meals/recovery-plus-meals",
    // https://www.jingmommy.com/postpartum-meals/daddy-meal.html
    "/postpartum-meals/daddy-meal.html": "/postpartum-meals/daddy-meals",
    // https://www.jingmommy.com/postpartum-meals/healthy-meal.html
    "/postpartum-meals/healthy-meal.html": "/postpartum-meals/healthy-meals",
    /** Miscarriage Healing Meals */
    // https://www.jingmommy.com/miscarriage-recovery-meals/
    "/miscarriage-recovery-meals": "/miscarriage-healing-meals",
    // https://www.jingmommy.com/miscarriage-recovery-meals/delux-recovery-meal.html
    "/miscarriage-recovery-meals/delux-recovery-meal.html": "/miscarriage-healing-meals/deluxe",
    // https://www.jingmommy.com/miscarriage-recovery-meals/biweekly-recovery-meal.html
    "/miscarriage-recovery-meals/biweekly-recovery-meal.html": "/miscarriage-healing-meals/biweekly",
    // https://www.jingmommy.com/小產調理餐/
    "/小產調理餐": "/miscarriage-healing-meals",
    /**
     * Post-Surgery Meals
     */
    // https://www.jingmommy.com/post-surgery-meals/
    "/post-surgery-meals": "/post-surgery-meals",
    /** Confinement Care Advice */
    // https://www.jingmommy.com/confinement-care-advice/
    "/confinement-care-advice": "/confinement-care-advice",
    // https://www.jingmommy.com/confinement-care-advice/dos-and-donts-for-confinement.html
    "/confinement-care-advice/dos-and-donts-for-confinement.html": "/confinement-care-advice/dos-and-donts",
    // https://www.jingmommy.com/miscarriage-recovery-advice/
    "/miscarriage-recovery-advice": "/miscarriage-healing-advice",
    /**
     * Frozen Postpartum Soups
     */
    // https://www.jingmommy.com/frozen-postpartum-soups/
    "/frozen-postpartum-soups": "/frozen-postpartum-soups",
    // https://www.jingmommy.com/frozen-postpartum-soups/frozon-taiwanese-postpartum-soups.html
    "/frozen-postpartum-soups/frozon-taiwanese-postpartum-soups.html": "/frozen-postpartum-soups/taiwanese-soups",
    // https://www.jingmommy.com/frozen-postpartum-soups/frozen-postpartum-stewed-soups.html
    "/frozen-postpartum-soups/frozen-postpartum-stewed-soups.html": "/frozen-postpartum-soups/stewed-soups",
    // https://www.jingmommy.com/frozen-postpartum-soups/frozen-chicken-essence.html
    "/frozen-postpartum-soups/frozen-chicken-essence.html": "/frozen-postpartum-soups/chicken-essence",
    // https://www.jingmommy.com/frozen-postpartum-soups/frozen-desserts.html
    "/frozen-postpartum-soups/frozen-desserts.html": "/frozen-postpartum-soups/desserts",
    // https://www.jingmommy.com/frozen-postpartum-soups/frozen-sea-bass-soups.html
    "/frozen-postpartum-soups/frozen-sea-bass-soups.html": "/frozen-postpartum-soups/sea-bass-soups",
    // https://www.jingmommy.com/frozen-postpartum-soups/frozen-postpartum-soups-the-post-confinement-nourishment-plan.html
    "/frozen-postpartum-soups/frozen-postpartum-soups-the-post-confinement-nourishment-plan.html": "/frozen-postpartum-soups", // discontinued product, redirect to category index
    // https://www.jingmommy.com/frozen-postpartum-soups/diy-frozen-postpartum-soup-sets.html
    "/frozen-postpartum-soups/diy-frozen-postpartum-soup-sets.html": "/frozen-postpartum-soups/tiers",
    // https://www.jingmommy.com/frozen-postpartum-soups/four-seasons-soups-spring-1-lucky-bag.html
    "/frozen-postpartum-soups/four-seasons-soups-spring-1-lucky-bag.html": "/frozen-postpartum-soups", // discontinued product, redirect to category index
    // https://www.jingmommy.com/frozen-postpartum-soups/four-seasons-soups-winter-1.html
    "/frozen-postpartum-soups/four-seasons-soups-winter-1.html": "/frozen-postpartum-soups", // discontinued product, redirect to category index
    // https://www.jingmommy.com/frozen-postpartum-soups/four-seasons-soups-winter-1-lucky-bag.html
    "/frozen-postpartum-soups/four-seasons-soups-winter-1-lucky-bag.html": "/frozen-postpartum-soups", // discontinued product, redirect to category index
    // https://www.jingmommy.com/frozen-postpartum-soups/four-seasons-soups-winter-2.html
    "/frozen-postpartum-soups/four-seasons-soups-winter-2.html": "/frozen-postpartum-soups", // discontinued product, redirect to category index
    // https://www.jingmommy.com/frozen-postpartum-soups/four-seasons-soups-spring-4.html
    "/frozen-postpartum-soups/four-seasons-soups-spring-4.html": "/frozen-postpartum-soups/spring-4",
    /**
     * Postpartum Products
     */
    // https://www.jingmommy.com/other/
    "/other": "/postpartum-products",
    // https://www.jingmommy.com/other/postpartum-herbal-drink-pack.html
    "/other/postpartum-herbal-drink-pack.html": "/postpartum-products/herbal-drink-pack",
    // https://www.jingmommy.com/other/chicken-essence.html
    "/other/chicken-essence.html": "/postpartum-products/chicken-essence",
    // https://www.jingmommy.com/other/full-moon-joy-box.html
    "/other/full-moon-joy-box.html": "/postpartum-products/full-moon-joy-box",
    // https://www.jingmommy.com/other/sheng-hua-tang.html
    "/other/sheng-hua-tang.html": "/postpartum-products/sheng-hua-tang",
    // https://www.jingmommy.com/other/du-zhong-capsule-back-relief-supplement.html
    "/other/du-zhong-capsule-back-relief-supplement.html": "/postpartum-products/du-zhong-capsule",
    // https://www.jingmommy.com/other/belly-wrap.html
    "/other/belly-wrap.html": "/postpartum-products/belly-wrap",
    /**
     * Events & Sampling
     */
    // https://www.jingmommy.com/postpartum-meal-sampling-party/
    "/postpartum-meal-sampling-party": "/sample/tasting-party",
    // https://www.jingmommy.com/試吃派對/預約試吃-中央廚房.html
    "/試吃派對/預約試吃-中央廚房.html": "/sample/tasting-party",
    // https://www.jingmommy.com/sample-meal/
    "/sample-meal": "/sample/local-delivery",
    // https://www.jingmommy.com/out-of-state-frozen-postpartum-meal-delivery-reservation/
    "/out-of-state-frozen-postpartum-meal-delivery-reservation": "/sample/out-of-state-shipping",
    // https://www.jingmommy.com/媽媽教室/
    "/媽媽教室": "/", // discontinued page, redirect to homepage
    // https://www.jingmommy.com/試吃派對/
    "/試吃派對": "/sample/tasting-party",
    // https://www.jingmommy.com/媽寶手冊-免費/
    "/媽寶手冊-免費": "/", // discontinued page, redirect to homepage
    /**
     * Plans
     */
    // https://www.jingmommy.com/3tier/
    "/3tier": "/plans/3tier",
    /** Customer Service */
    // https://www.jingmommy.com/customer-service/
    // https://www.jingmommy.com/customer-service/faq.html
    "/customer-service/faq.html": "/faq",
    // https://www.jingmommy.com/customer-service/reward-program.html
    "/customer-service/reward-program.html": "/", // discontinued page, redirect to homepage
    // https://www.jingmommy.com/customer-service/patricia.html
    "/customer-service/patricia.html": "https://order.jingmommy.com/patricia",
    // https://www.jingmommy.com/customer-service/miya.html
    "/customer-service/miya.html": "https://order.jingmommy.com/miya",
    // https://www.jingmommy.com/customer-service/nicole.html
    "/customer-service/nicole.html": "https://order.jingmommy.com/nicole",
    // https://www.jingmommy.com/customer-service/customer-service-order.html
    "/customer-service/customer-service-order.html": "/customer-service",
    // https://www.jingmommy.com/customer-service/support.html
    "/customer-service/support.html": "/customer-service",
    // https://www.jingmommy.com/線上客服/
    "/線上客服": "/customer-service",
    /**
     * Misc
     */
    // https://www.jingmommy.com/postpartum-meals/postpartum-meal-delivery-lookup.html
    "/postpartum-meals/postpartum-meal-delivery-lookup.html": "/delivery-lookup",
    // https://www.jingmommy.com/review.html
    "/review.html": "/", // discontinued page, redirect to homepage
    // https://www.jingmommy.com/bonus-sharing/
    "/bonus-sharing": "/", // discontinued page, redirect to homepage
  },
})
