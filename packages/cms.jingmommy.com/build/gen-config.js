import fs from "fs"
import path from "path"
import yaml from "js-yaml"

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const ROOT_DIR = path.join(__dirname, '..', '..', '..')
const CONTENT_ROOT_FOLDER = path.join(__dirname, '..', '..', 'jingmommy.com/src/pages')
const CONFIG_FILE = path.join(__dirname, '..', 'src', 'config.yml')
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'admin', "config.yml")

// Recursively scan folders under the given directory
function walkFolders(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let folders = []
  folders.push({ relative: base, fullPath: dir })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subPath = path.join(dir, entry.name)
      const subBase = path.posix.join(base, entry.name)
      folders = folders.concat(walkFolders(subPath, subBase))
    }
  }
  return folders
}

// Helper for deep clone
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Load config.yml and strip all collections with a 'folder' property
const configRaw = fs.readFileSync(CONFIG_FILE, "utf-8")
const config = yaml.load(configRaw)
const oldCollections = Array.isArray(config.collections) ? config.collections : []

// Get all "template" collections that have a 'folder' property
const templateCollections = oldCollections.filter(item => typeof item.folder === "string")
if (templateCollections.length === 0) {
  throw new Error("No template collections with 'folder' property found in config file")
}

// Remove any collection object that has a 'folder' property
const collectionsWithoutFolder = oldCollections.filter(item => !('folder' in item))

function toPaths(relative) {
  return relative
    .split(path.sep)
    .map(s => s.trim())
    .filter(Boolean)
}
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// NOTE: Do NOT use '/' (slash) in the collection name, otherwise Decap CMS will break.
// Decap uses the collection name after #/collections/ in the route—if we use a slash, e.g. 'a/b', the hash path becomes #/collections/a/b
// but Decap expects the full name and does not URL encode the slash. Always use ' > ' or another safe separator, NOT '/'!
function toCollectionName(relativePaths, replaceSep = ' > ') {
  return relativePaths
    .join(replaceSep)
}

// Helper to convert to Label, e.g. capitalize segments: 'pages/en/about' => 'Pages > En > About'
function toCollectionLabel(relativePaths, replaceSep = ' > ') {
  if (relativePaths.length === 0) return '(No Label)'
  return relativePaths
    .map(s => capitalizeFirst(s))
    .join(replaceSep)
}

// Generate a collection config for a folder, cloning from the template
function makeCollectionData(f, templateCollection) {
  const basename = path.basename(templateCollection.folder)
  const relativePath = path.join(basename, f.relative)
  const relativePaths = toPaths(relativePath)
  return {
    ...deepClone(templateCollection),
    name: toCollectionName(relativePaths),
    label: toCollectionLabel(relativePaths),
    folder: path.dirname(templateCollection.folder) + (relativePath ? '/' + relativePath : '')
  }
}

// Generate dynamic collections for all folders under pages/ using all templates
const folders = walkFolders(CONTENT_ROOT_FOLDER)
// For each template collection, generate all matching collections for all folders:
let genCollections = []
for (const templateCollection of templateCollections) {
  genCollections = genCollections.concat(folders.map(f => makeCollectionData(f, templateCollection)))
}

// Compose the new config object: old (without folder) + generated
const newConfig = {
  ...config,
  collections: [
    ...collectionsWithoutFolder,
    ...genCollections
  ]
}

// Dump to output file as yaml
const yamlStr = yaml.dump(newConfig, {
  lineWidth: -1,
  quotingType: '"'
}).replace(/ +$/gm, "")

fs.writeFileSync(OUTPUT_FILE, yamlStr.trim(), "utf-8")
console.log("Collections YAML generated at", OUTPUT_FILE)
