# Cloudflare Pages deployment

This repository is configured as a static Next.js export. Cloudflare Pages
should publish the generated `out/` directory directly; it does not need a
Next.js runtime adapter.

Use these Cloudflare Pages build settings:

- **Build command:** `pnpm build:cloudflare`
- **Build output directory:** `out`
- **Root directory:** `/`
- **Node.js version:** `22` (recommended)

The repository also pins Node.js 22 in both `.nvmrc` and `.node-version`, and
declares Next.js' minimum supported runtime in `package.json`. Build systems
that detect either version file will therefore upgrade from their legacy
Node.js 18 default before installing dependencies.

Remove the old `npx @cloudflare/next-on-pages@1` command from the Pages build
configuration. `@cloudflare/next-on-pages` is not used by this project.

The dynamic `[slug]` pages are enumerated by `generateStaticParams()` from the
Markdown files in `public/content`, so they are included in the static export.
