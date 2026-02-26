# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this package.

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

- Default locale is `zh-tw` with `prefixDefaultLocale: true` — all routes have a locale prefix (`/zh-tw/...`, `/en/...`)
- Root `src/pages/index.astro` handles redirect from `/`
- Pages are mirrored under `src/pages/zh-tw/` and `src/pages/en/`
- MDX pages use `layout` frontmatter to select a layout

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

### Route Title Auto-generation

`src/scripts/index.js` exports `generateRouteFiles()`, which scans `src/pages/` and writes `src/route-map.json` (route → title map). This is used for breadcrumb labels. It runs automatically:
- At dev server start (called directly in `astro.config.mjs`)
- On file changes via a native `fs.watch` watcher in the Vite config
- At build time via the `astro:build:setup` hook

If breadcrumbs show wrong titles, regenerate by restarting the dev server or triggering a page file save.

### Site Config

Global site metadata (title, description, URL, support phone/email) lives in `src/client.config.ts`. Import it as:

```ts
import { site } from '../client.config.ts'
```

### UI Components

- **Starwind** components (shadcn-style, Tailwind-based) live in `src/components/starwind/` — managed via `starwind.config.json`. Do not hand-edit these.
- Custom components are directly in `src/components/`
- Icons use `astro-icon` with the `@iconify-json/mdi` icon set

### Path Alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
