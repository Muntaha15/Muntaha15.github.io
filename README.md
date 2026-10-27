# Muntaha Kamal — Portfolio

My portfolio of AI engineering projects and professional experience.

**Website:** [muntaha15.github.io](https://muntaha15.github.io/)

## Built with

- Astro and TypeScript for a static website
- Pagefind for browser-based search
- Markdown and KaTeX for content and equations
- GitHub Actions and GitHub Pages for deployment

## Local development

Requires Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4321/. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Build and verify

```sh
npm run check
npm run build
npm run verify
npm run preview
```

The production build is generated in `dist/`. Build before previewing to include the search index.

## Deployment

Pushes to `main` run the checks, build, and verification before deploying to GitHub Pages through `.github/workflows/deploy.yml`. Pull requests run validation without deploying. The repository's Pages publishing source must be set to **GitHub Actions**.
