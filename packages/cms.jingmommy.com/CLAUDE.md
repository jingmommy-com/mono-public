# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this package.

## Overview

Decap CMS configuration generator for `https://jingmommy.netlify.app/admin`. The build script dynamically generates `public/admin/config.yml` from a template — **do not edit `public/admin/config.yml` directly**, it is always overwritten.

## Commands

Run from the **monorepo root**:

```bash
npm -w packages/cms.jingmommy.com run build  # Regenerate public/admin/config.yml from src/config.yml
```

Run this after any changes to `src/config.yml` or to the page structure in `../jingmommy.com/src/pages/`.

## Architecture

`build/gen-config.js` reads `src/config.yml` (a Decap CMS config with template collections that have a `folder` property), walks all subdirectories under `../jingmommy.com/src/pages/`, and outputs a `public/admin/config.yml` with one collection per folder per template.

Collection names use ` > ` as the path separator (not `/`) — Decap CMS uses collection names in URL hash routing and does not URL-encode slashes, which breaks navigation.
