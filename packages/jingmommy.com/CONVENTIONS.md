# Code Conventions

## Imports

- Always use **single quotes** for import paths.
  ```ts
  // ✅
  import Layout from '../../Default.astro'
  import { colors } from '@/client.config.ts'

  // ❌
  import Layout from "../../Default.astro"
  ```

- Use the `@/` path alias for anything under `src/` when referencing across directories.
  ```ts
  import Footer from '@/components/Footer.astro'  // ✅
  import Footer from '../../components/Footer.astro'  // ❌ (avoid deep relative paths)
  ```

## MDX files

- Always leave **one blank line** between the last `import` statement and the first content line (markdown text, heading, or JSX element). Missing this blank line causes a build error: `[@mdx-js/rollup] Could not parse import/exports with acorn`.
  ```mdx
  // ✅
  import { Badge } from '@/components/starwind/badge'

  ## Section Title

  // ❌
  import { Badge } from '@/components/starwind/badge'
  ## Section Title
  ```

- This applies to both the top-level import block (after frontmatter `---`) and any inline imports mid-file.
