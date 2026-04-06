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

const fileId = 'route-map'

function extractRouteAndAttributes(filepath, pagesDir, attrs = [], log) {
  const basename = path.basename(filepath)
  if (basename.startsWith('[')) {
    return null
  }
  const attrsMap = {}
  let content = ''
  try {
    content = fs.readFileSync(filepath, 'utf-8')
  } catch (e) {
    return null
  }
  const ext = path.extname(filepath).toLowerCase()
  switch (ext) {
    case '.md':
    case '.mdx':
    case '.astro': {
      try {
        const meta = grayMatter(content)
        for (const attr of attrs) {
          if (meta.data && Object.hasOwn(meta.data, attr)) {
            attrsMap[attr] = meta.data[attr]
          }
        }
      } catch {}
      for (const attr of attrs) {
        // fallback try to parse the title from js content
        if (!Object.hasOwn(attrsMap, attr)) {
          attrsMap[attr] = findVariableInJavascriptContent(content, attr)
        }
      }
      break
    }
    case '.js':
    case '.cjs':
    case '.mjs':
    case '.ts':
    case '.jsx':
    case '.tsx':
      for (const attr of attrs) {
        attrsMap[attr] = findVariableInJavascriptContent(content, attr)
      }
      break
    default: {
      log(`[${fileId}] Unknown ext: ${ext}`)
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
  return { route, attrs: attrsMap }
}

async function generateRouteMap(log, logError) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const rootDir = path.resolve(__dirname, '..', '..')

  log(`[${fileId}] Collecting titles from src/pages/`)

  const pagesDir = path.resolve(rootDir, 'src', 'pages')
  if (!fs.existsSync(pagesDir)) {
    logError(`[${fileId}] src/pages directory does not exist: ${pagesDir}`)
    return
  }

  const files = walkSync(pagesDir)
  const attrs = [
    'title',
    'description',
  ]
  const result = {}
  for (const file of files) {
    const res = extractRouteAndAttributes(file, pagesDir, attrs, log)
    if (res && res.route) {
      result[res.route] = res.attrs
    }
  }

  log(`[${fileId}] Extracted ${Object.keys(result).length} routes`)

  const outputFile = path.resolve(rootDir, 'src', `${fileId}.json`)
  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2))

  log(`[${fileId}] Wrote route data to ${outputFile}`)
}

export async function generateRouteFiles(logger) {
  const log = logger && typeof logger.info === 'function'
    ? (msg) => logger.info(msg)
    : (msg) => console.log(msg)
  const logError = logger && typeof logger.error === 'function'
    ? (msg) => logger.error(msg)
    : (msg) => console.error(msg)
  await generateRouteMap(log, logError)
}
