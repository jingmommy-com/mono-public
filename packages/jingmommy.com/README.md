# jingmommy.com

A modern static website for `jingmommy.com`, built with Astro.

- Refer to `init.sh` for the steps used to initialize and set up this project.
- vscode setup, see `./vscode/**`

## Deployment

This project uses **GitHub Actions** to automate deployment to **Cloudflare Pages**, see `./github/workflows/deploy-jingmommy.com.*`

- **Push code base to `master` branch** Every push to the branch triggers a GitHub Actions workflow.
- **Build Astro site** The workflow installs dependencies and builds the static site (`astro build`).
- **Deploy to Cloudflare Pages** The output (`dist/`) is deployed to Cloudflare Pages using the Cloudflare API.

## Dev memo

For editing page feature:

- html
  - https://github.com/samclarke/SCEditor
  - https://github.com/ehtisham-afzal/tiptap-shadcn
  - https://github.com/JiHong88/suneditor
- markdown
  - directly edit on github
  - copy the page from github, then edit on https://hackmd.io/
- decap: see `packages/cms.jingmommy.com`
