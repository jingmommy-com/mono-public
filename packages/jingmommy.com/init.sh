create astro@latest
# Need to install the following packages:
# create-astro@4.12.1
# Ok to proceed? (y) 


# > npx
# > create-astro


# (node:3132075) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
# (Use `node --trace-deprecation ...` to show where the warning was created)
#  astro   Launch sequence initiated.


#    dir   Where should we create your new project?
#          ./jingmommy.com

#   tmpl   How would you like to start your new project?
#          A basic, helpful starter project

#   deps   Install dependencies?
#          Yes

#    git   Initialize a new git repository?
#          Yes

#       ✔  Project initialized!
#          ■ Template copied
#          ■ Dependencies installed
#          ■ Git initialized

#   next   Liftoff confirmed. Explore your project!

#          Enter your project directory using cd ./jingmommy.com 
#          Run npm run dev to start the dev server. CTRL+C to stop.
#          Add frameworks like react or tailwind using astro add.

#          Stuck? Join us at https://astro.build/chat

# ╭─────╮  Houston:
# │ ◠ ◡ ◠  Good luck out there, astronaut! 🚀
# ╰─────╯

cd ./jingmommy.com
npx astro add mdx
# ▶ Astro collects anonymous usage data.
#   This information helps us improve Astro.
#   Run "astro telemetry disable" to opt-out.
#   https://astro.build/telemetry

# ✔ Resolving packages...

#   Astro will run the following command:
#   If you skip this step, you can always run it yourself later

#  ╭────────────────────────────╮
#  │ npm i @astrojs/mdx@^4.3.0  │
#  ╰────────────────────────────╯

# ✔ Continue? … yes
# ✔ Installing dependencies...

#   Astro will make the following changes to your config file:

#  ╭ astro.config.mjs ─────────────────────────────╮
#  │ // @ts-check                                  │
#  │ import { defineConfig } from 'astro/config';  │
#  │                                               │
#  │ import mdx from '@astrojs/mdx';               │
#  │                                               │
#  │ // https://astro.build/config                 │
#  │ export default defineConfig({                 │
#  │   integrations: [mdx()]                       │
#  │ });                                           │
#  ╰───────────────────────────────────────────────╯

# ✔ Continue? … yes
  
#    success  Added the following integration to your project:
#   - @astrojs/mdx
npx astro add sitemap
# ✔ Resolving packages...

#   Astro will run the following command:
#   If you skip this step, you can always run it yourself later

#  ╭────────────────────────────────╮
#  │ npm i @astrojs/sitemap@^3.4.1  │
#  ╰────────────────────────────────╯

# ✔ Continue? … yes
# ✔ Installing dependencies...

#   Astro will make the following changes to your config file:

#  ╭ astro.config.mjs ─────────────────────────────╮
#  │ // @ts-check                                  │
#  │ import { defineConfig } from 'astro/config';  │
#  │                                               │
#  │ import mdx from '@astrojs/mdx';               │
#  │                                               │
#  │ import sitemap from '@astrojs/sitemap';       │
#  │                                               │
#  │ // https://astro.build/config                 │
#  │ export default defineConfig({                 │
#  │   integrations: [mdx(), sitemap()]            │
#  │ });                                           │
#  ╰───────────────────────────────────────────────╯

# ✔ Continue? … yes
  
#    success  Added the following integration to your project:
#   - @astrojs/sitemap

# see: https://tailwindcss.com/docs/installation/framework-guides/astro
npm install tailwindcss @tailwindcss/vite

# see: https://docs.astro.build/en/editor-setup/#prettier
npm install --save-dev --save-exact prettier prettier-plugin-astro
npm install --save-dev --save-exact prettier-plugin-tailwindcss

# see: https://docs.astro.build/en/recipes/tailwind-rendered-markdown/
npm install -D @tailwindcss/typography
