import fs from "fs"
import path from "path"
import yaml from "js-yaml"

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const ROOT_FOLDER = path.join(__dirname, '..', '..', 'jingmommy.com/src/pages')
const CONFIG_FILE = path.join(__dirname, 'config.yml')
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

// Load config.yml and strip all collections with a 'folder' property
const configRaw = fs.readFileSync(CONFIG_FILE, "utf-8")
const config = yaml.load(configRaw)
const oldCollections = Array.isArray(config.collections) ? config.collections : []

// Get the first "template" collection that has a 'folder' property
const templateCollection = oldCollections.find(item => typeof item.folder === "string")
if (!templateCollection) {
  throw new Error("No template collection with 'folder' property found in config file")
}

// Remove any collection object that has a 'folder' property
const collectionsWithoutFolder = oldCollections.filter(item => !('folder' in item))

// Generate a collection config for a folder, cloning from the template
function makeCollectionData(f) {
  const name = `pages${f.relative ? '/' + f.relative : ''}`.replace(/\/$/,"").trim()
  const label = name
  const folder = `packages/jingmommy.com/src/pages${f.relative ? '/' + f.relative : ''}`.replace(/\\/g,"/").trim()
  // Deep clone everything except name, label, folder
  const {
    name: _omitName,
    label: _omitLabel,
    folder: _omitFolder,
    ...rest
  } = templateCollection
  return {
    ...rest,
    name,
    label,
    folder
  }
}

// Generate dynamic collections for all folders under pages/
const folders = walkFolders(ROOT_FOLDER)
const genCollections = folders.map(makeCollectionData)

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
