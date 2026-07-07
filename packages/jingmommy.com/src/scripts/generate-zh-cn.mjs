/*
  Regenerate the zh-cn locale from zh-tw.

  zh-cn is a pure 1:1 OpenCC (Traditional → Simplified) translation of zh-tw:
    src/pages/zh-tw  →  src/pages/zh-cn
    src/i18n/zh-tw   →  src/i18n/zh-cn

  Run after any zh-tw change:  npm -w packages/jingmommy.com run gen:zh-cn

  NEVER hand-edit files under the zh-cn directories — this script deletes and
  rewrites them wholesale, so manual edits are lost. Fix the zh-tw source (or
  this script) instead.

  Conversion rules:
    - OpenCC tw → cn, character-level (no regional-idiom substitution).
    - 'zh-tw' / 'zhTw' tokens (locale ids, imports, orderUrl(...) args) are
      rewritten to 'zh-cn' / 'zhCn'.
    - URLs containing CJK (e.g. //file.jingmommy.com/f/菜單總表.pdf, pixnet
      blog links) are protected — those remote resources keep their
      Traditional-character names.
*/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as OpenCC from 'opencc-js'

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const convert = OpenCC.Converter({ from: 'tw', to: 'cn' })

// URL-ish token (absolute or protocol-relative) containing at least one CJK char
const CJK_URL = /(?:https?:)?\/\/[^\s"'<>()[\]]*[一-鿿][^\s"'<>()[\]]*/g

function convertText(text) {
  const protectedUrls = []
  const masked = text.replace(CJK_URL, (m) => {
    protectedUrls.push(m)
    return `@@URL${protectedUrls.length - 1}@@`
  })
  const converted = convert(masked.replaceAll('zh-tw', 'zh-cn').replaceAll('zhTw', 'zhCn'))
  return converted.replace(/@@URL(\d+)@@/g, (_, i) => protectedUrls[Number(i)])
}

function walk(srcDir, dstDir, written) {
  fs.mkdirSync(dstDir, { recursive: true })
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name)
    const dst = path.join(dstDir, entry.name)
    if (entry.isDirectory()) {
      walk(src, dst, written)
    } else {
      fs.writeFileSync(dst, convertText(fs.readFileSync(src, 'utf8')))
      written.push(path.relative(srcRoot, dst))
    }
  }
}

const pairs = [
  [path.join(srcRoot, 'pages/zh-tw'), path.join(srcRoot, 'pages/zh-cn')],
  [path.join(srcRoot, 'i18n/zh-tw'), path.join(srcRoot, 'i18n/zh-cn')],
]

const written = []
for (const [src, dst] of pairs) {
  fs.rmSync(dst, { recursive: true, force: true }) // full sync: removals propagate too
  walk(src, dst, written)
}
console.log(written.join('\n'))
console.log(`\n[gen:zh-cn] ${written.length} files regenerated from zh-tw`)
