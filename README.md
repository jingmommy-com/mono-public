# mono-public

This monorepo manages multiple projects using npm workspaces.

## Developer Notes

### Folder Structure

```bash
$ tree -d -L 1 ./packages ./deploy
./packages
├── cms.jingmommy.com
├── jingmommy.com
└── netlify
```

- ./packages
  - `cms.jingmommy.com`: Decap CMS site deployed on Netlify (already connected)
  - `jingmommy.com`: Static website for jingmommy.com
  - `netlify`: Netlify-related configuration and files
