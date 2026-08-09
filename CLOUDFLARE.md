# Cloudflare Pages deployment

This repository is configured as a static Next.js export. Cloudflare Pages
should publish the generated `out/` directory directly; it does not need a
Next.js runtime adapter.

Use these Cloudflare Pages build settings:

- **Build command:** `pnpm build:cloudflare`
- **Build output directory:** `out`
- **Root directory:** `/`
- **Node.js version:** `22` (recommended)

Remove the old `npx @cloudflare/next-on-pages@1` command from the Pages build
configuration. `@cloudflare/next-on-pages` is not used by this project.

The dynamic `[slug]` pages are enumerated by `generateStaticParams()` from the
Markdown files in `public/content`, so they are included in the static export.
