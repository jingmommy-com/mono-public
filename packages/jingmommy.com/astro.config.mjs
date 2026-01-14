// @ts-check
import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import { minifyHtml } from 'astro-minify-html'

import tailwindcss from '@tailwindcss/vite'
import { generateRouteFiles } from './src/scripts/index.js'

/*
  Why does generateRouteFiles not trigger correctly when running `astro dev`?
  -----------------------------------------------------------------------------
  Even with a Vite plugin watcher, there may be issues if you only use the integration's
  `astro:server:setup` hook, or if the watcher is not triggering at the right time.

  The best guarantee is to proactively call generateRouteFiles immediately 
  when the config loads during dev and again via the watcher, so there is 
  always a valid route-titles.json before startup and after any change.

  This config now ensures:
    1. Route titles are generated _at dev startup_ (before the dev server responds).
    2. File watching still triggers fresh route-titles.json after add/change/unlink to relevant files.
*/

// Immediately generateRouteFiles at dev startup, outside of hooks
if (process.env.NODE_ENV === 'development') {
  generateRouteFiles()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('[route-titles] Initial route-titles.json generated for dev startup')
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.error('[route-titles] Error generating initial route-titles.json:', e)
    })
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
  integrations: [
    mdx(),
    sitemap(),
    icon(),
    minifyHtml({
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
      collapseWhitespace: true,
    }),
    {
      name: 'route-titles-autogen',
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
        name: 'route-titles-native-watch',
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
              console.log(`[route-titles] Detected ${event} in ${filePath}, updating route-titles.json`)
              try {
                await generateRouteFiles()
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('[route-titles] Failed to update:', e)
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
    },
    // domains: {
    //   'zh-tw': 'https://jingmeal.com',
    //   // en: 'https://postpartummeal.com',
    //   en: 'https://en.jingmeal.com',
    // }
  },
})
