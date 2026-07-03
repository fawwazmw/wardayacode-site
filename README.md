# wardayacode-site

Marketing landing page for [WardayaCode](https://github.com/fawwazmw/wardayacode) — an open-source AI coding agent for the terminal.

## Goal

A single-page marketing site like [opencode.ai](https://opencode.ai/) that showcases the project, explains what it does, and drives installs.

## Recommended stack

**Astro** — zero JS shipped by default, ~12KB output, deploys to GitHub Pages/Cloudflare Pages for free.

Alternatives to decide in your new session: plain HTML/CSS (simplest), or Astro (best balance of modern + lightweight).

## Content to cover

- Hero: tagline + screenshot of the TUI
- Install: `npx wardayacode` / `npm install -g wardayacode`
- Features: multi-provider, permission system, 56 slash commands, session management
- Social proof: GitHub stars, contributors
- Privacy: local-first, no data leaves your machine
- FAQ
- Footer / community links

## Getting started

```bash
# in your new session, pick a stack and scaffold:
# Option A: Astro
npm create astro@latest

# Option B: plain HTML
# just start writing index.html
```

## Structure

```
wardayacode-site/
├── README.md          # this file
├── public/            # static assets (screenshots, favicon)
├── src/               # or root-level if plain HTML
│   ├── index.html
│   └── styles/
└── package.json       # if using a framework
```

## Related

- [wardayacode](https://github.com/fawwazmw/wardayacode) — the CLI tool (sibling directory)
