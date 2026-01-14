import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import grayMatter from 'gray-matter'

const allowedExtensions = [
  '.mdx',
  '.md',
  '.astro',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
]

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir)
  files.forEach(function(file) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      walkSync(filepath, filelist)
    } else {
      if (allowedExtensions.includes(path.extname(file))) {
        filelist.push(filepath)
      }
    }
  })
  return filelist
}

function findVariableInJavascriptContent(content, varName) {
  const titleMatch = content.match(new RegExp(`${varName}\\s*[=]\\s*["'\`](.*?)["'\`]`))
  if (titleMatch) return titleMatch[1]
}

function extractTitleAndRoute(filepath, pagesDir, log) {
  const ext = path.extname(filepath).toLowerCase()
  let title = ''
  let content = ''
  try {
    content = fs.readFileSync(filepath, 'utf-8')
  } catch (e) {
    return null
  }

  switch (ext) {
    case '.md':
    case '.mdx':
    case '.astro':
      try {
        const meta = grayMatter(content)
        if (meta.data && meta.data.title) {
          title = meta.data.title
        }
      } catch {}
      if (!title) { // fallback try to parse the title from js content
        title = findVariableInJavascriptContent(content, 'title')
      }
      break
    case '.js':
    case '.cjs':
    case '.mjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      title = findVariableInJavascriptContent(content, 'title')
      break
    default: {
      log(`[route-titles] Unknown ext: ${ext}`)
    }
  }

  let relPath = path.relative(pagesDir, filepath)
  relPath = path.join(
    path.dirname(relPath),
    path.parse(relPath).name
  )
  if (path.basename(relPath) === 'index') {
    relPath = path.dirname(relPath)
    if (relPath === '.') {
      relPath = ''
    }
  }
  let route = '/' + relPath
    .replace(/\\/g, '/')
    .replace(/(?!^\/)\/+$/, '') // Trim trailing / unless it's the first /
  return { route, title }
}

async function generateRouteTitles(log, logError) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const rootDir = path.resolve(__dirname, '..', '..')

  log('[route-titles] Collecting titles from src/pages/')

  const pagesDir = path.resolve(rootDir, 'src', 'pages')
  if (!fs.existsSync(pagesDir)) {
    logError(`[route-titles] src/pages directory does not exist: ${pagesDir}`)
    return
  }

  const routeTitles = {}

  const files = walkSync(pagesDir)
  for (const file of files) {
    const res = extractTitleAndRoute(file, pagesDir, log)
    if (res && res.route && res.title) {
      routeTitles[res.route] = res.title
    }
  }

  log(`[route-titles] Extracted ${Object.keys(routeTitles).length} titles`)

  const outputFile = path.resolve(rootDir, 'src', 'route-titles.json')
  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, JSON.stringify(routeTitles, null, 2))

  log(`[route-titles] Wrote route titles to ${outputFile}`)
}

export async function generateRouteFiles(logger) {
  const log = logger && typeof logger.info === 'function'
    ? (msg) => logger.info(msg)
    : (msg) => console.log(msg)
  const logError = logger && typeof logger.error === 'function'
    ? (msg) => logger.error(msg)
    : (msg) => console.error(msg)
  await generateRouteTitles(log, logError)
}
