# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

npm workspaces monorepo. Each package has its own `CLAUDE.md` with package-specific guidance.

- `packages/jingmommy.com` — Static Astro site for jingmommy.com, deployed to **Cloudflare Pages** via GitHub Actions
- `packages/cms.jingmommy.com` — Decap CMS config generator, deployed to **Netlify** (access at `https://jingmommy.netlify.app/admin`)
- `packages/netlify` — Netlify email templates (invitation, confirmation, password recovery, email change)

## Commands

All commands are run from the monorepo root using `npm -w <workspace>`.

```bash
npm -w packages/jingmommy.com run dev        # Start jingmommy.com dev server
npm -w packages/jingmommy.com run build      # Build jingmommy.com
npm -w packages/cms.jingmommy.com run build  # Regenerate CMS config.yml
```
