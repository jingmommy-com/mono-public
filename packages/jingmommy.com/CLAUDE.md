# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this package.

See [CONVENTIONS.md](./CONVENTIONS.md) for code style rules (quotes, imports, etc.).

## Project Goal

This is a new static Astro site being built to **replace the old jingmommy.com site**, which runs on Classic ASP and is too difficult to maintain. The primary ongoing work is migrating pages from the live site to this new codebase.

### Migration Approach

- Use the **live browser view of www.jingmommy.com** as the source of truth for layout and content — do not attempt to read or interpret the ASP source files.
- If actual source file content from the old site is needed (e.g. a specific data file or asset), **ask the user** — they can copy it from the remote machine.
- Migrated pages go under `src/pages/zh-tw/` (Traditional Chinese, the primary language) and optionally mirrored under `src/pages/en/`.
- Most content pages should use the MDX + `MarkdownPage` layout pattern (frontmatter `layout` pointing to `MarkdownPage.astro`).

## Commands

Run from the **monorepo root**:

```bash
npm -w packages/jingmommy.com run dev        # Start dev server
npm -w packages/jingmommy.com run build      # Build static site → dist/
npm -w packages/jingmommy.com run preview    # Preview production build
npm -w packages/jingmommy.com run lint       # Format with Prettier (writes in place)
```

## Architecture

**Astro 5** site with **Tailwind CSS v4**, **MDX**, and **i18n**.

### Routing & i18n

- Locales are `en` (default), `zh-tw`, `zh-cn`, `en-translated` — declared once in `src/config/index.ts` and imported by `astro.config.js` (single source of truth). `prefixDefaultLocale: true`, so all routes have a locale prefix (`/en/...`, `/zh-tw/...`, `/en-translated/...`)
- Root `src/pages/index.astro` handles redirect from `/`
- Pages are mirrored under `src/pages/zh-tw/` and `src/pages/en/`
- **zh-cn is generated, never hand-edited**: `src/pages/zh-cn/` and
  `src/i18n/zh-cn/` are a pure 1:1 OpenCC (Traditional → Simplified)
  translation of their zh-tw counterparts. After changing anything under
  zh-tw, regenerate with `npm -w packages/jingmommy.com run gen:zh-cn`
  (see `src/scripts/generate-zh-cn.mjs`) — it deletes and rewrites the
  zh-cn directories wholesale
- MDX pages use `layout` frontmatter to select a layout

#### Locale ↔ domain routing

The **same build is deployed to two production domains**, each of which owns a subset
of locales:

| Domain | Locales |
|---|---|
| `jingmommy.com` | `zh-tw`, `zh-cn` |
| `postpartummeal.com` | `en`, `en-translated` |

This mapping lives in **`siteDomains`** in `src/config/index.ts` (the single source of
truth — update it there when locales/domains change).

**Rule:** when switching language to a locale owned by a *different* production domain,
the destination URL must include that domain. Example: on `jingmommy.com/zh-tw/about`,
switching to `/en/about` must go to `https://postpartummeal.com/en/about` (not
`jingmommy.com/en/about`).

**Environments:** this domain hop happens **only on the production hosts** above (matched
with or without a leading `www.`). On **local dev** and the **`jingmeal.com` staging**
environment, language switching stays same-origin (just a path change) — no domain hop.

**Mechanism (client-side, because it depends on the runtime hostname):**
- Any language-switch link opts in with `data-locale-target="<locale>"` next to a normal
  same-origin `href` (e.g. `href="/en/about"`).
- `src/components/LocaleDomainSwitch.astro` inlines a small script that, only when the
  current hostname is a known production domain, rewrites those links whose target locale
  belongs to another domain into absolute cross-domain URLs.
- It is included wherever switch links appear: `src/components/Header.astro` (zh-tw /
  en-translated) and `src/components/en/LangSwitch.astro` (en). Add it anywhere new switch links
  are introduced.

### Layout Hierarchy

```
Base.astro          ← html shell, imports global.css, sets font
  └─ Index.astro    ← homepage layout (no breadcrumb/header/footer wrapping)
  └─ Page.astro     ← standard page: Header + Breadcrumb + h1 + Footer
       └─ MarkdownPage.astro       ← wraps Page, used by MDX via frontmatter layout
       └─ SinglePage.astro         ← single-column variant
       └─ MarkdownSinglePage.astro
```

`Page.astro` accepts a `color` prop (Tailwind color name, defaults to `orange`) to theme the gradient header, h1 text, and background. Dynamic color classes are explicitly safelisted via `@source inline(...)` in `src/styles/global.css` — **add new colors there if needed**.

### Theme System

Layouts support a theme prop that selects a visual variant. The theme registry (`themes`, `ThemeName`, `defaultTheme`) lives in `src/config/index.ts`.

**Directory structure:**
```
src/
  layouts/
    Page.astro                  ← theme router (delegates to themes/*/Page.astro)
    MarkdownPage.astro          ← passes frontmatter.theme → Page
    themes/
      base/
        Page.astro              ← default design (light gradient bar + centered h1)
        MarkdownPage.astro      ← wraps base Page, uses base Markdown
        MarkdownSinglePage.astro← wraps Base.astro, uses base Markdown
      modern/
        Page.astro              ← bold banner design (colored hero with title inside)
        MarkdownPage.astro      ← wraps modern Page, uses starwind Markdown
        MarkdownSinglePage.astro← wraps Base.astro, uses starwind Markdown
```

**`Default`, `Index`, `FullScreenPage`, and `FullScreenLoading` are not theme-aware** — they always use the base design.

**Selecting a theme:**
- `.astro` page: `<Page theme="modern" ... />`
- `.mdx` frontmatter: `theme: modern`
- Default is `base` if omitted.

**Adding a new theme:**
1. Add the name to `themes` in `src/config/index.ts`
2. Create `src/layouts/themes/<name>/Page.astro`
3. Import and register it in `src/layouts/Page.astro`'s `themeMap`

**Components** are themed too: theme-specific components live in
`src/components/themes/<name>/` (`base` serves the zh-tw/zh-cn/en-translated site,
`en` serves the en design). Only genuinely locale/theme-agnostic components
stay at the `src/components/` root (currently `Head`, `ComingSoon`,
`AnchorOffset`, `LocaleDomainSwitch`, `Markdown`, plus the managed
`starwind/` library).

### Route Title Auto-generation

`src/scripts/index.js` exports `generateRouteFiles()`, which scans `src/pages/` and writes `src/route-map.json` (route → title map). This is used for breadcrumb labels. It runs automatically:
- At dev server start (called directly in `astro.config.mjs`)
- On file changes via a native `fs.watch` watcher in the Vite config
- At build time via the `astro:build:setup` hook

If breadcrumbs show wrong titles, regenerate by restarting the dev server or triggering a page file save.

#### Route-map metadata — centralized config

`src/config/pages.yml` is the primary place to set `order`, `sidebar`, and `sitemap` metadata for pages. Keys are the page file path relative to `src/pages/`, without extension, keeping `index`:

```yaml
en/sample/tasting-party:
  order: 1
  sidebar: true

en/sitemap.xml:
  sitemap: false
```

**Pages can still declare these as inline variables** (frontmatter in `.mdx`, or `const` in `.astro`/`.ts`) — the page value overrides the config value if both are present. Use inline declarations sparingly, only when a page needs to differ from what the config says.

**Do NOT remove inline variable declarations** from `.astro` and `.ts` files unless you have confirmed the value is covered in `config/pages.yml` — they are not used at runtime, but are read by the build script.

### Site Config

Global site metadata (title, description, URL, support phone/email) lives in `src/config/index.ts`. Import it as:

```ts
import { site } from '../config/index.ts'
```

#### Config placement

Decide where a piece of config lives by how widely it is used:

- **(a) Shared across languages** (language-independent facts — address, phone, brand
  name, founded year, etc.) → **`src/config/index.ts`** (the `site` object). Derive
  `tel:` links from `site.phone` (e.g. `` `tel:${site.phone.replace(/[^0-9]/g, '')}` ``)
  rather than storing a separate value.
- **(b) One language, multiple pages** → **`src/config/<locale>.ts`** (create as
  needed — currently none exists; per-locale copy belongs in `src/i18n/<locale>/`).
- **(c) One language, one page** (e.g. the landing page's "as featured in" `press` list)
  → **inline in that page**, passed to any component as a prop.

Follow this when adding new config: promote a value up (page → `config/<locale>.ts` →
`config/index.ts`) only once it's actually reused at that wider scope.

**Config files hold pure data only** — constants, plain objects/arrays, types.
Functions (formatters like `usd`, URL builders like `tastingReserveUrl`) live in
`src/utils/`; the only exception is a helper a config file itself needs in order
to build its data.

#### Config ↔ i18n reference direction

Components/pages import **config and i18n separately** and compose them at the
usage site (`component → config + i18n`), instead of chaining
`component → i18n → config`. What i18n files may and may not reference:

- **OK — display-text facts**: an i18n string may embed a config value that is
  part of the copy (e.g. the founded year in a tagline). Prefer `{token}`
  placeholders filled at the usage site with `interpolate()` from `src/utils`
  (`t(key, vars)` style), e.g. i18n has `'e.g. {postalCode}'` and the component
  renders `interpolate(t.placeholder, { postalCode: site.address.postalCode })`.
- **NOT OK — layout/styling**: CSS classes and other presentation config are
  unrelated to i18n and must not live in i18n files — they belong to the
  component (or config, per the placement rules above). The only presentation
  allowed inside i18n strings is embedded HTML when a translated fragment
  needs it (e.g. an inline `<a href="{customerServiceUrl}">` link).

### UI Components

- **Starwind** components (shadcn-style, Tailwind-based) live in `src/components/starwind/` — managed via `starwind.config.json`. Do not hand-edit these.
- Shared (theme-agnostic) components are directly in `src/components/`; theme-specific ones are under `src/components/themes/<name>/` (see "Theme System")
- Icons use `astro-icon` with the `@iconify-json/mdi` icon set

### Path Alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
