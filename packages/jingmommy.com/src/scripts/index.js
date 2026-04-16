import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import grayMatter from 'gray-matter'
import yaml from 'js-yaml'

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
  // This regex matches:
  // - string assignment (const foo = 'bar' or "bar")
  // - number assignment (const foo = 42)
  // - boolean assignment (const foo = true/false)
  // It also allows for whitespace and optional semicolon.
  const regex = new RegExp(
    // 1: declaration, 2: varName, 3: assign, 4: quote (optional), 5: value
    String.raw`(?:^|\s)(?:const|let|var)\s+${varName}\s*=\s*(?:(['"])(.*?)\1|([0-9]+(?:\.[0-9]+)?)|(\btrue\b|\bfalse\b))`,
    'm'
  )
  const matches = content.match(regex)
  if (!matches) return undefined
  // If string assignment (groups 2 and 1):
  if (matches[2] !== undefined) {
    return matches[2].trim()
  }
  // If number assignment (group 3):
  if (matches[3] !== undefined) {
    return Number(matches[3])
  }
  // If boolean assignment (group 4):
  if (matches[4] !== undefined) {
    return matches[4] === 'true'
  }
  return undefined
}

const fileId = 'route-map'

function filePathToRouteUrl(filepath, pagesDir) {
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
  return '/' + relPath
    .replace(/\\/g, '/')
    .replace(/(?!^\/)\/+$/, '') // Trim trailing / unless it's the first /
}

function extractAttrs(filepath, attrs = [], log) {
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
        // fallback: parse from JS content
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
  return attrsMap
}

const METADATA_KEYS = new Set(['order', 'sidebar', 'sitemap', 'title', 'description'])

/**
 * Returns true if every key in obj is a known metadata field (leaf node).
 */
function isLeaf(obj) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    Object.keys(obj).every(k => METADATA_KEYS.has(k))
  )
}

/**
 * Recursively flatten a nested pages.config.yml tree into a fileKey → attrs map.
 * Keys mirror the file path relative to src/pages/ without extension (e.g. "en/sample/index").
 * Leaf detection: a node whose every key is a metadata key is a page entry.
 */
function flattenConfigTree(node, parts = []) {
  if (!node || typeof node !== 'object') return {}
  const result = {}
  for (const [key, val] of Object.entries(node)) {
    const nextParts = [...parts, key]
    if (isLeaf(val)) {
      result[nextParts.join('/')] = val
    } else if (val && typeof val === 'object') {
      Object.assign(result, flattenConfigTree(val, nextParts))
    }
  }
  return result
}

/**
 * Load src/pages.config.yml and return a map of fileKey → attrs.
 * fileKey is the path relative to src/pages/ without extension (e.g. "en/sample/index").
 * Returns {} if the file doesn't exist.
 */
function loadPagesConfig(rootDir, log) {
  const configFile = path.resolve(rootDir, 'src', 'pages.config.yml')
  if (!fs.existsSync(configFile)) return {}
  try {
    const raw = fs.readFileSync(configFile, 'utf-8')
    const parsed = yaml.load(raw) ?? {}
    const result = flattenConfigTree(parsed)
    log(`[${fileId}] Loaded pages.config.yml (${Object.keys(result).length} entries)`)
    return result
  } catch (e) {
    log(`[${fileId}] Warning: failed to parse pages.config.yml — ${e.message}`)
    return {}
  }
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

  // Load centralized config first (lower priority)
  const configAttrs = loadPagesConfig(rootDir, log)

  const files = walkSync(pagesDir)
  const result = {}
  for (const file of files) {
    if (path.basename(file).startsWith('[')) continue

    // File key (relative path without extension) for config lookup
    const relRaw = path.relative(pagesDir, file)
    const fileKey = path.join(path.dirname(relRaw), path.parse(relRaw).name)
      .replace(/\\/g, '/')

    const route = filePathToRouteUrl(file, pagesDir)
    const pageAttrs = extractAttrs(file, METADATA_KEYS, log)
    if (!pageAttrs) continue

    // Merge: config base first (by file key), then page attrs override (page wins)
    result[route] = {
      ...(configAttrs[fileKey] ?? {}),
      ...Object.fromEntries(
        Object.entries(pageAttrs).filter(([, v]) => v !== undefined)
      ),
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
