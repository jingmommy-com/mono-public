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
