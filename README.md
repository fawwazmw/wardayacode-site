# wardayacode-site

Marketing site for [wardayacode](https://github.com/fawwazmw/wardayacode) — an open-source, multi-provider AI coding agent for the terminal.

**Live at: [wardayacode.my.id](https://wardayacode.my.id)**

## Pages

| Page | Description |
|------|-------------|
| `/` | Home — hero, install, features, demo, privacy, FAQ |
| `/docs` | Documentation — installation, config, permissions, commands, tools, sessions, development |
| `/changelog` | Release history with changelog |
| `404` | Custom terminal-themed 404 page |

## Stack

- **Astro** — static site generator, zero JS shipped by default
- **TypeScript** — strict mode
- **CSS** — custom properties (design tokens), component-scoped styles
- **Deploy** — Vercel (auto-deploys on push to `main`)

No UI framework, no Tailwind, no client-side JS framework.

## Theme

Matches the wardayacode TUI: dark base (`#0d0f12`) with purple accent (`#C084FC`), indigo tool calls (`#818CF8`), teal success (`#34D399`).

Fonts: JetBrains Mono (terminal/code) + Inter (body).

## Development

```bash
npm install          # install dependencies
npm run dev          # dev server at localhost:4321
npm run build        # static build to dist/
npm run preview      # preview built site
npm run check        # TypeScript + Astro diagnostics
```

## Project structure

```
wardayacode-site/
├── public/            # static assets (favicon, OG image)
├── src/
│   ├── components/    # UI components (Hero, Install, Features, Demo, FAQ, etc.)
│   ├── layouts/       # Base.astro (HTML shell, meta, fonts)
│   ├── pages/         # index.astro, docs.astro, changelog.astro, 404.astro
│   └── styles/        # global.css (design tokens, reset, utilities)
├── astro.config.mjs
└── package.json
```

## Deployment

Pushes to `main` auto-deploy via Vercel. Cloudflare handles DNS.

## License

MIT — see the [wardayacode repo](https://github.com/fawwazmw/wardayacode) for the source of the CLI tool itself.
