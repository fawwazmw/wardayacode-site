# wardayacode-site — Design Spec

**Date:** 2026-06-24
**Status:** Approved
**Author:** brainstormed with Claude Code

## Goal

A single-page marketing site for [wardayacode](https://github.com/fawwazmw/wardayacode) — an
open-source, multi-provider AI coding agent for the terminal. The site showcases the product,
explains what it does, and drives installs. Reference: opencode.ai.

## Decisions (locked)

- **Stack:** Astro (latest) + TypeScript, no UI framework. Hand-written CSS with design tokens.
- **Visual direction:** Terminal/dark aesthetic with a faux terminal window in the hero.
- **Hero visual:** Faux terminal built in HTML/CSS (no image assets), with a typing animation.
- **Sections:** Hero + Install, Features, Social proof, Privacy, FAQ, Footer (all included).
- **Deploy target:** Configure for a root deploy now; leave a documented path to switch to a
  GitHub Pages project site (`base: '/wardayacode-site'`) later.
- **Project structure:** Component-per-section (Approach A) + hand-written scoped CSS.

## Accuracy notes (must not repeat the placeholder README's errors)

The site's own `README.md` contains marketing placeholders that are factually wrong about the
product. Use the real data from the wardayacode repo README instead:

- **Slash commands:** ~14 (NOT "56"). Examples: `/help`, `/clear`, `/compact`, `/mode`, `/model`,
  `/session`, `/tokens`, `/undo`, `/diff`, `/checkpoint`, `/rollback`, `/login`, `/logout`,
  `/auth`, `/exit`. Phrase as "slash commands" or "a command palette" rather than a hard count,
  or use the accurate count.
- **Privacy:** Do NOT claim "no data leaves your machine." wardayacode sends code to whichever
  LLM provider the user selects (Claude / OpenAI / Gemini). Reframe honestly: local-first —
  sessions, config, and API keys stay on the user's machine; no telemetry; dangerous operations
  (force push, `rm -rf`, `dd`) are permanently blocked; **you choose which provider sees your code.**

### Verified product facts (source: wardayacode repo, v0.6.0)

- Install: `npm install -g wardayacode`; also runnable via `npx wardayacode`. Short alias: `wdc`.
- Requires Node.js 20+.
- Providers: Anthropic (Claude), OpenAI (GPT-4), Google (Gemini).
- Permission modes (5): `default`, `plan`, `acceptEdits`, `auto`, `internal`.
- Tools (8): `read_file`, `write_file`, `edit_file`, `bash`, `git`, `glob`, `grep`, `list_files`.
- Sessions saved as JSONL in `.wardayacode/`; resume with `--resume <id>`.
- Undo (`/undo`) and git checkpoint/rollback (`/checkpoint`, `/rollback`, `/diff`).
- License: MIT. Author: Fawwaz Mufid W / Wardaya Dev.
- Repo: https://github.com/fawwazmw/wardayacode

## Architecture & tooling

- Astro with TypeScript. No React/Vue/Tailwind. Near-zero JS shipped.
- Global stylesheet `src/styles/global.css` holds design tokens (CSS custom properties),
  resets, and shared utilities. Per-component styling via Astro scoped `<style>`.
- `astro.config.mjs`: root deploy now, with a commented `base` line + note for project-site path.
- Minimal client JS, progressively enhanced (content fully renders without JS):
  - Copy-to-clipboard on install command blocks.
  - Hero terminal typing animation (disabled under `prefers-reduced-motion`).

### File structure

```
wardayacode-site/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/                  # favicon, og-image (placeholder)
└── src/
    ├── pages/index.astro
    ├── layouts/Base.astro    # <head>, meta/OG tags, fonts, global css
    ├── styles/global.css     # tokens, resets, shared utilities
    └── components/
        ├── Hero.astro        # tagline + faux terminal + primary CTA
        ├── Install.astro     # npm / npx commands w/ copy buttons
        ├── Features.astro    # value-prop grid
        ├── SocialProof.astro # GitHub stars badge + contributors link
        ├── Privacy.astro     # reframed local-first messaging
        ├── Faq.astro         # accordion (details/summary, no JS)
        └── Footer.astro      # community + GitHub links
```

## Theme / design tokens

- Dark base (~`#0d0f12`), soft off-white text, one primary accent (terminal green ~`#7ee787`)
  used for prompts/CTAs, plus a muted secondary tone. Keep effects restrained to avoid a
  generic "AI gradient" look.
- Monospace (JetBrains Mono or similar) for terminal + code; clean sans (Inter / system stack)
  for body copy.
- Tokens as CSS custom properties: colors, spacing scale, radii, font sizes, max content
  width (~1100px).

## Section content

- **Hero:** Tagline ("An AI coding agent that lives in your terminal") + subline naming the
  three providers. Faux terminal (traffic-light dots, `$ wardayacode` prompt) replaying the
  README's auth-bug demo with a typing animation. Primary CTA → install / GitHub.
- **Install:** Stacked/tabbed blocks for `npm install -g wardayacode` and `npx wardayacode`,
  each with a copy button. Note Node.js 20+ requirement and the `wdc` alias.
- **Features:** Grid of cards — Multi-provider (3), 5 permission modes, slash command palette,
  8 built-in tools, session management (resume/JSONL), undo & git checkpoints. Accurate numbers.
- **Social proof:** GitHub stars via shields.io badge (static, no runtime fetch) + repo/
  contributors link.
- **Privacy:** Reframed honestly per the accuracy notes above.
- **FAQ:** `<details>`/`<summary>` accordion (zero JS): which models, is it free/OSS, how are
  keys stored, does it send my code anywhere, how to undo changes, Node version.
- **Footer:** GitHub, MIT license, author, install one-liner.

## Accessibility, SEO, performance

- Semantic landmarks, keyboard navigable, sufficient contrast.
- `prefers-reduced-motion` disables the typing animation.
- `<head>`: title, description, Open Graph + Twitter card, theme-color, favicon, placeholder
  `og-image`.
- Target: near-zero JS, single small CSS bundle, Lighthouse ~100.

## Testing / verification

- `npm run build` succeeds; `npm run dev` serves locally.
- Manual browser check (Playwright): each section renders, copy buttons work, FAQ toggles,
  reduced-motion respected, responsive at mobile + desktop widths.
- No live data dependencies → no flaky network tests.

## Out of scope (YAGNI)

- Multi-page docs, blog, or i18n.
- Runtime GitHub API fetch for live star counts (use a badge).
- Analytics/telemetry.
- Real screenshot/asciinema asset (faux terminal covers the hero; can swap later).
