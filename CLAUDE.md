# Notion Vault

A self-hosted viewer for Notion workspace exports with dark-mode aesthetics.

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Bun as package manager

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/               # REST endpoints (nav, page, csv, image, search)
│   └── page/[slug]/       # Dynamic page route
├── components/            # React components (Sidebar, PageContent, Table, SearchModal)
└── lib/
    ├── config.ts          # Loads notion-preview.config.js
    ├── parser/            # index.html, markdown, CSV parsers
    └── search/            # MiniSearch full-text search
```

## Key Files

- `notion-preview.config.js` — User configuration (dataPath, features)
- `data/index.html` — Source of truth for navigation tree (from Notion export)
- `data/**/*.md` — Markdown pages
- `data/**/*.csv` — Database exports

## Commands

```bash
bun run dev      # Development server
bun run build    # Production build
bun run lint     # ESLint
```

## Code Conventions

- Use `bun` for all package operations
- Prefer Tailwind utility classes over custom CSS
- Components use 'use client' directive when needed
- API routes read from `/data` folder at runtime (no hardcoded paths)

## Notion Dark Theme Colors

```css
--bg-primary: #191919;
--bg-secondary: #202020;
--bg-tertiary: #2f2f2f;
--text-primary: rgba(255, 255, 255, 0.81);
--text-secondary: rgba(255, 255, 255, 0.44);
--accent: #2eaadc;
--border: rgba(255, 255, 255, 0.08);
```

## Testing Changes

1. Ensure `data/` folder has a valid Notion export with `index.html`
2. Run `bun run dev` and check http://localhost:3000
3. Verify: sidebar navigation, page rendering, images, search (Cmd+K)
