# wardayacode-site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. The implementation skill for visual/UI work is `frontend-design:frontend-design` — consult it when building the components (Tasks 3–9).

**Goal:** Build a single-page, terminal-themed Astro marketing site for wardayacode that showcases the tool and drives installs.

**Architecture:** Astro (latest) + TypeScript, no UI framework. One `index.astro` composes small per-section components. A `Base.astro` layout holds `<head>`/meta; `src/styles/global.css` holds design tokens and resets; each component uses Astro scoped `<style>`. Near-zero JS — only copy-to-clipboard and a hero typing animation, both progressive enhancements.

**Tech Stack:** Astro, TypeScript, hand-written CSS (custom properties), Google Fonts (JetBrains Mono + Inter), Playwright (manual verification only — not a test dependency).

## Global Constraints

- **Stack:** Astro + TypeScript only. NO React/Vue/Svelte, NO Tailwind/UnoCSS or any CSS framework.
- **JS budget:** Near-zero. Client JS allowed ONLY for: install-command copy buttons and hero typing animation. All content must render fully without JS.
- **Accuracy (must match wardayacode repo, NOT the site's placeholder README):**
  - Slash commands: phrase as "command palette" / "slash commands"; if a count is given it must be the real ~14, NEVER "56".
  - Privacy: NEVER claim "no data leaves your machine." Code goes to the user-selected provider. Frame as: local-first (sessions/config/keys stay local), no telemetry, dangerous ops blocked, you choose which provider sees your code.
  - Install: `npm install -g wardayacode` (also `npx wardayacode`). Alias `wdc`. Node.js 20+.
  - Providers (3): Anthropic/Claude, OpenAI/GPT-4, Google/Gemini.
  - Permission modes (5): `default`, `plan`, `acceptEdits`, `auto`, `internal`.
  - Tools (8): `read_file`, `write_file`, `edit_file`, `bash`, `git`, `glob`, `grep`, `list_files`.
  - License MIT. Repo: https://github.com/fawwazmw/wardayacode
- **Theme tokens:** dark base `#0d0f12`, off-white text, primary accent green `#7ee787`. Mono = JetBrains Mono; sans = Inter/system. Max content width ~1100px.
- **A11y:** semantic landmarks, keyboard navigable, sufficient contrast, `prefers-reduced-motion` disables the typing animation.
- **Deploy:** root deploy now; `astro.config.mjs` carries a commented `base` line + note for GitHub Pages project-site switch.
- **Commit** after each task.

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `src/pages/index.astro` (temporary placeholder)

**Interfaces:**
- Consumes: nothing.
- Produces: a buildable Astro project. `npm run dev`, `npm run build`, `npm run preview` scripts available.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "wardayacode-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "devDependencies": {
    "astro": "^5.0.0",
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Root deploy (e.g. custom domain or user.github.io). Set `site` to the final URL for correct OG/canonical tags.
  site: 'https://wardayacode.dev',

  // --- GitHub Pages project site? ---
  // If deploying to https://<user>.github.io/wardayacode-site/, uncomment the next line
  // and set `site` above to 'https://<user>.github.io':
  // base: '/wardayacode-site',
});
```

- [ ] **Step 4: Create `.gitignore`**

```
dist/
node_modules/
.astro/
.DS_Store
*.log
.env
.env.production
```

- [ ] **Step 5: Create temporary `src/pages/index.astro`**

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>wardayacode</title></head>
  <body><h1>wardayacode-site scaffold</h1></body>
</html>
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: completes, creates `node_modules/` and `package-lock.json`, no errors.

- [ ] **Step 7: Verify the build**

Run: `npm run build`
Expected: "Complete!" / exits 0, produces `dist/index.html`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs .gitignore src/pages/index.astro
git commit -m "chore: scaffold Astro project"
```

---

### Task 2: Design tokens, global stylesheet, and Base layout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (use the layout)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `global.css` exposing CSS custom properties on `:root`: `--bg`, `--bg-elev`, `--text`, `--text-muted`, `--accent` (`#7ee787`), `--accent-dim`, `--border`, `--radius`, `--maxw` (`1100px`), spacing scale `--space-1..--space-8`, `--font-mono`, `--font-sans`. Plus a reset and `.container` (max-width + horizontal padding) and `.sr-only` utility.
  - `Base.astro` — props `{ title: string; description: string }`. Renders full `<html>` document: `<head>` with charset/viewport, `<title>`, meta description, Open Graph + Twitter card tags, `theme-color`, favicon link, Google Fonts (Inter + JetBrains Mono) preconnect+stylesheet, imports `global.css`, and a `<slot />` inside `<body>`.

- [ ] **Step 1: Create `src/styles/global.css`**

```css
:root {
  --bg: #0d0f12;
  --bg-elev: #161a20;
  --text: #e6edf3;
  --text-muted: #9aa7b4;
  --accent: #7ee787;
  --accent-dim: #4a8d54;
  --border: #232a33;
  --radius: 10px;
  --maxw: 1100px;
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem; --space-6: 2rem; --space-7: 3rem; --space-8: 5rem;
  --font-sans: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
h1, h2, h3 { line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
code, pre { font-family: var(--font-mono); }
.container { max-width: var(--maxw); margin-inline: auto; padding-inline: var(--space-5); }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
const ogImage = new URL('/og-image.png', Astro.site ?? 'https://wardayacode.dev').href;
const canonical = Astro.site ? new URL(Astro.url.pathname, Astro.site).href : undefined;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    <meta name="theme-color" content="#0d0f12" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
    />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Replace `src/pages/index.astro` to use the layout**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="wardayacode — AI coding agent for your terminal" description="An open-source, multi-provider AI coding agent that lives in your terminal. Claude, GPT-4, and Gemini.">
  <main class="container">
    <h1>wardayacode</h1>
  </main>
</Base>
```

- [ ] **Step 4: Create a placeholder favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0d0f12"/>
  <path d="M8 11l5 5-5 5" fill="none" stroke="#7ee787" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="16" y1="22" x2="24" y2="22" stroke="#7ee787" stroke-width="2.5" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains the `<title>` and meta description.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/pages/index.astro public/favicon.svg
git commit -m "feat: add design tokens, global styles, and base layout"
```

---

### Task 3: Hero component (tagline + faux terminal + CTA)

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro` (render `<Hero />`)

**Interfaces:**
- Consumes: design tokens from `global.css`.
- Produces: `Hero.astro` (no props) rendering a `<section>` with: H1 tagline, subline naming 3 providers, two CTA buttons (Install ↓ anchor to `#install`, GitHub link), and a faux terminal window. The terminal markup must contain the full demo text statically (works without JS). Includes an inline `<script>` that, when JS is on AND not reduced-motion, hides the static lines and types them out; the script targets `[data-terminal]` and `[data-line]` elements.

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
const repo = 'https://github.com/fawwazmw/wardayacode';
const lines = [
  { t: 'prompt', text: '❯ Fix the authentication bug in src/auth.ts' },
  { t: 'tool', text: '● read_file(src/auth.ts)' },
  { t: 'ok', text: '✓ Found issue: token expiry check uses wrong comparison' },
  { t: 'tool', text: '● edit_file(src/auth.ts)' },
  { t: 'ok', text: '✓ Fixed: changed > to < in token expiry check on line 42' },
  { t: 'text', text: 'The bug was on line 42 — the expiry comparison was inverted. Fixed.' },
];
---
<section class="hero">
  <div class="container hero-grid">
    <div class="hero-copy">
      <h1>An AI coding agent that lives in your terminal.</h1>
      <p class="sub">
        Open-source, multi-provider, and fully under your control —
        works with <strong>Claude</strong>, <strong>GPT-4</strong>, and <strong>Gemini</strong>.
      </p>
      <div class="cta">
        <a class="btn btn-primary" href="#install">Install</a>
        <a class="btn btn-ghost" href={repo} rel="noopener">View on GitHub →</a>
      </div>
    </div>

    <div class="term" data-terminal aria-label="Example wardayacode session" role="img">
      <div class="term-bar">
        <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
        <span class="term-title">wardayacode</span>
      </div>
      <pre class="term-body">{lines.map((l) => (
        <div class={`line ${l.t}`} data-line>{l.text}</div>
      ))}</pre>
    </div>
  </div>
</section>

<style>
  .hero { padding-block: var(--space-8) var(--space-7); }
  .hero-grid { display: grid; gap: var(--space-7); align-items: center; }
  @media (min-width: 900px) { .hero-grid { grid-template-columns: 1fr 1fr; } }
  h1 { font-size: clamp(2rem, 5vw, 3.25rem); }
  .sub { color: var(--text-muted); font-size: 1.125rem; margin-top: var(--space-4); max-width: 42ch; }
  .cta { display: flex; gap: var(--space-3); margin-top: var(--space-6); flex-wrap: wrap; }
  .btn { display: inline-block; padding: 0.7rem 1.25rem; border-radius: var(--radius); font-weight: 600; font-size: 0.95rem; }
  .btn:hover { text-decoration: none; }
  .btn-primary { background: var(--accent); color: #08120a; }
  .btn-primary:hover { filter: brightness(1.08); }
  .btn-ghost { border: 1px solid var(--border); color: var(--text); }
  .btn-ghost:hover { border-color: var(--accent-dim); }

  .term { background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: 0 24px 60px -20px rgba(0,0,0,0.6); }
  .term-bar { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--border); }
  .dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ff5f56; } .dot.yellow { background: #ffbd2e; } .dot.green { background: #27c93f; }
  .term-title { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; margin-left: var(--space-2); }
  .term-body { margin: 0; padding: var(--space-4); font-size: 0.85rem; line-height: 1.7; white-space: pre-wrap; overflow-x: auto; }
  .line { font-family: var(--font-mono); }
  .line.prompt { color: var(--text); } .line.tool { color: #8ab4ff; }
  .line.ok { color: var(--accent); } .line.text { color: var(--text-muted); }
</style>

<script>
  const term = document.querySelector('[data-terminal]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (term && !reduce) {
    const lines = Array.from(term.querySelectorAll('[data-line]'));
    const texts = lines.map((el) => el.textContent ?? '');
    lines.forEach((el) => { el.textContent = ''; el.style.minHeight = '1.2em'; });
    let li = 0, ci = 0;
    const tick = () => {
      if (li >= lines.length) return;
      const target = texts[li];
      ci++;
      lines[li].textContent = target.slice(0, ci);
      if (ci >= target.length) { li++; ci = 0; setTimeout(tick, 260); }
      else { setTimeout(tick, 18); }
    };
    setTimeout(tick, 400);
  }
</script>
```

- [ ] **Step 2: Render Hero in `src/pages/index.astro`**

Replace the `<main>...</main>` block with:

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
---
<Base title="wardayacode — AI coding agent for your terminal" description="An open-source, multi-provider AI coding agent that lives in your terminal. Claude, GPT-4, and Gemini.">
  <main>
    <Hero />
  </main>
</Base>
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains "An AI coding agent that lives in your terminal." and the demo line "changed > to < in token expiry check on line 42".

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add hero with faux terminal demo"
```

---

### Task 4: Install component (commands + copy buttons)

**Files:**
- Create: `src/components/Install.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: design tokens.
- Produces: `Install.astro` (no props) — `<section id="install">` with a heading, two command rows (`npm install -g wardayacode` and `npx wardayacode`), each row a `<code>` + a copy `<button data-copy="...">`. A note line: "Requires Node.js 20+ · short alias `wdc`". One inline `<script>` wires all `[data-copy]` buttons to `navigator.clipboard.writeText` with a transient "Copied!" label. Buttons render and are visible without JS (they just no-op gracefully if clipboard is unavailable).

- [ ] **Step 1: Create `src/components/Install.astro`**

```astro
---
const commands = [
  { label: 'Install globally', cmd: 'npm install -g wardayacode' },
  { label: 'Or run once with npx', cmd: 'npx wardayacode' },
];
---
<section id="install" class="install">
  <div class="container">
    <h2>Install</h2>
    <p class="lead">Up and running in one command. Requires Node.js 20+ · short alias <code>wdc</code>.</p>
    <div class="cmds">
      {commands.map((c) => (
        <div class="cmd-row">
          <div class="cmd-label">{c.label}</div>
          <div class="cmd">
            <code>{c.cmd}</code>
            <button class="copy" data-copy={c.cmd} aria-label={`Copy: ${c.cmd}`}>Copy</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .install { padding-block: var(--space-7); border-top: 1px solid var(--border); }
  h2 { font-size: clamp(1.5rem, 3vw, 2rem); }
  .lead { color: var(--text-muted); margin-top: var(--space-3); }
  .lead code, .cmd code { font-family: var(--font-mono); }
  .cmds { margin-top: var(--space-5); display: grid; gap: var(--space-4); max-width: 640px; }
  .cmd-label { color: var(--text-muted); font-size: 0.85rem; margin-bottom: var(--space-2); }
  .cmd { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
    background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius); padding: var(--space-3) var(--space-4); }
  .cmd code { color: var(--accent); font-size: 0.95rem; overflow-x: auto; }
  .copy { background: transparent; border: 1px solid var(--border); color: var(--text); font-family: var(--font-sans);
    font-size: 0.8rem; padding: 0.35rem 0.7rem; border-radius: 6px; cursor: pointer; white-space: nowrap; }
  .copy:hover { border-color: var(--accent-dim); }
  .copy.copied { color: var(--accent); border-color: var(--accent-dim); }
</style>

<script>
  document.querySelectorAll('button[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') ?? '';
      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1500);
      } catch { /* clipboard unavailable — no-op */ }
    });
  });
</script>
```

- [ ] **Step 2: Render Install in `index.astro`** (import it and add `<Install />` after `<Hero />`).

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains `npm install -g wardayacode` and `npx wardayacode`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Install.astro src/pages/index.astro
git commit -m "feat: add install section with copy buttons"
```

---

### Task 5: Features component

**Files:**
- Create: `src/components/Features.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: design tokens.
- Produces: `Features.astro` (no props) — `<section id="features">` heading + responsive card grid. Six cards with accurate content (see Global Constraints). Pure HTML/CSS, no JS.

- [ ] **Step 1: Create `src/components/Features.astro`**

```astro
---
const features = [
  { title: 'Multi-provider', body: 'Claude, GPT-4, and Gemini out of the box. Switch models with a flag — no lock-in.' },
  { title: 'Permission system', body: 'Five modes — default, plan, acceptEdits, auto, internal — control exactly what runs automatically.' },
  { title: 'Slash commands', body: 'A built-in command palette: /undo, /diff, /checkpoint, /mode, /compact, and more. Type / to open it.' },
  { title: '8 built-in tools', body: 'read_file, write_file, edit_file, bash, git, glob, grep, list_files — with dangerous ops permanently blocked.' },
  { title: 'Session management', body: 'Conversations save as JSONL in your project. Resume any session across terminal restarts.' },
  { title: 'Undo & checkpoints', body: 'Revert the last edit with /undo, or git-stash checkpoints with /checkpoint and /rollback.' },
];
---
<section id="features" class="features">
  <div class="container">
    <h2>Everything you need, nothing you don't</h2>
    <div class="grid">
      {features.map((f) => (
        <article class="card">
          <h3>{f.title}</h3>
          <p>{f.body}</p>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
  .features { padding-block: var(--space-7); border-top: 1px solid var(--border); }
  h2 { font-size: clamp(1.5rem, 3vw, 2rem); }
  .grid { margin-top: var(--space-6); display: grid; gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .card { background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius);
    padding: var(--space-5); transition: border-color 0.2s ease; }
  .card:hover { border-color: var(--accent-dim); }
  .card h3 { font-size: 1.1rem; color: var(--accent); }
  .card p { color: var(--text-muted); margin-top: var(--space-3); font-size: 0.95rem; }
</style>
```

- [ ] **Step 2: Render Features in `index.astro`** (import + add `<Features />` after `<Install />`).

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains "Multi-provider" and "Session management"; does NOT contain the string "56".

- [ ] **Step 4: Commit**

```bash
git add src/components/Features.astro src/pages/index.astro
git commit -m "feat: add features grid"
```

---

### Task 6: Social proof component

**Files:**
- Create: `src/components/SocialProof.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: design tokens.
- Produces: `SocialProof.astro` (no props) — `<section>` with shields.io badges (stars + license) as `<img>` and a link to the repo / contributors. Static, no runtime fetch.

- [ ] **Step 1: Create `src/components/SocialProof.astro`**

```astro
---
const repo = 'https://github.com/fawwazmw/wardayacode';
const starsBadge = 'https://img.shields.io/github/stars/fawwazmw/wardayacode?style=for-the-badge&color=7ee787&labelColor=161a20&logo=github';
const licenseBadge = 'https://img.shields.io/github/license/fawwazmw/wardayacode?style=for-the-badge&color=7ee787&labelColor=161a20';
---
<section class="social">
  <div class="container">
    <p class="kicker">Open source · MIT licensed</p>
    <div class="badges">
      <a href={`${repo}/stargazers`} rel="noopener"><img src={starsBadge} alt="GitHub stars" height="28" loading="lazy" /></a>
      <a href={`${repo}/blob/main/LICENSE`} rel="noopener"><img src={licenseBadge} alt="License: MIT" height="28" loading="lazy" /></a>
    </div>
    <p class="link">Built in the open — <a href={`${repo}/graphs/contributors`} rel="noopener">see the contributors</a> or <a href={repo} rel="noopener">star the repo</a>.</p>
  </div>
</section>

<style>
  .social { padding-block: var(--space-7); border-top: 1px solid var(--border); text-align: center; }
  .kicker { color: var(--text-muted); font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 0.05em; }
  .badges { display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; margin-top: var(--space-4); }
  .link { color: var(--text-muted); margin-top: var(--space-4); }
</style>
```

- [ ] **Step 2: Render SocialProof in `index.astro`** (import + add after `<Features />`).

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains `img.shields.io/github/stars/fawwazmw/wardayacode`.

- [ ] **Step 4: Commit**

```bash
git add src/components/SocialProof.astro src/pages/index.astro
git commit -m "feat: add social proof badges"
```

---

### Task 7: Privacy component (accurate messaging)

**Files:**
- Create: `src/components/Privacy.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: design tokens.
- Produces: `Privacy.astro` (no props) — `<section id="privacy">` with heading and a short list. Messaging MUST follow Global Constraints (no "no data leaves your machine" claim). No JS.

- [ ] **Step 1: Create `src/components/Privacy.astro`**

```astro
---
const points = [
  { title: 'Local-first', body: 'Sessions, config, and API keys live on your machine — in your project and home directory, never on our servers.' },
  { title: 'No telemetry', body: 'wardayacode collects no analytics and phones nothing home. There is no account to create.' },
  { title: 'You choose the provider', body: 'Your code is sent only to the LLM provider you configure — Anthropic, OpenAI, or Google. You pick who sees it.' },
  { title: 'Guardrails built in', body: 'Destructive operations like force-push, rm -rf, and dd are permanently blocked, in every permission mode.' },
];
---
<section id="privacy" class="privacy">
  <div class="container">
    <h2>Your code, your keys, your rules</h2>
    <div class="grid">
      {points.map((p) => (
        <div class="point">
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .privacy { padding-block: var(--space-7); border-top: 1px solid var(--border); }
  h2 { font-size: clamp(1.5rem, 3vw, 2rem); }
  .grid { margin-top: var(--space-6); display: grid; gap: var(--space-5);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .point h3 { font-size: 1.05rem; color: var(--accent); }
  .point p { color: var(--text-muted); margin-top: var(--space-2); font-size: 0.95rem; }
</style>
```

- [ ] **Step 2: Render Privacy in `index.astro`** (import + add after `<SocialProof />`).

- [ ] **Step 3: Verify the build + accuracy guard**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains "You choose the provider" and does NOT contain "no data leaves your machine".

- [ ] **Step 4: Commit**

```bash
git add src/components/Privacy.astro src/pages/index.astro
git commit -m "feat: add privacy section with accurate messaging"
```

---

### Task 8: FAQ component (zero-JS accordion)

**Files:**
- Create: `src/components/Faq.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: design tokens.
- Produces: `Faq.astro` (no props) — `<section id="faq">` with `<details>`/`<summary>` items. No JS.

- [ ] **Step 1: Create `src/components/Faq.astro`**

```astro
---
const faqs = [
  { q: 'Which models does it support?', a: 'Claude (Anthropic), GPT-4 (OpenAI), and Gemini (Google). Switch with --model and --provider, or per-session with /model.' },
  { q: 'Is it free and open source?', a: 'Yes — wardayacode is MIT licensed. You only pay your chosen provider for API usage.' },
  { q: 'Where are my API keys stored?', a: 'Locally — as environment variables, in a per-project .wardayacode.json, or in your user config. They never leave your machine except in requests to your provider.' },
  { q: 'Does it send my code anywhere?', a: 'Only to the LLM provider you configure, as part of each request. There is no other telemetry and no wardayacode server.' },
  { q: 'How do I undo a change I did not want?', a: 'Use /undo to revert the last file edit, /diff to review uncommitted changes, or /rollback to restore the last git checkpoint.' },
  { q: 'What do I need to run it?', a: 'Node.js 20 or newer. Install with npm install -g wardayacode, then run wardayacode (or the wdc alias).' },
];
---
<section id="faq" class="faq">
  <div class="container">
    <h2>FAQ</h2>
    <div class="list">
      {faqs.map((f) => (
        <details>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  </div>
</section>

<style>
  .faq { padding-block: var(--space-7); border-top: 1px solid var(--border); }
  h2 { font-size: clamp(1.5rem, 3vw, 2rem); }
  .list { margin-top: var(--space-5); max-width: 760px; }
  details { border: 1px solid var(--border); border-radius: var(--radius); padding: var(--space-4) var(--space-5);
    margin-bottom: var(--space-3); background: var(--bg-elev); }
  summary { cursor: pointer; font-weight: 600; list-style: none; }
  summary::-webkit-details-marker { display: none; }
  summary::after { content: '+'; float: right; color: var(--accent); font-weight: 700; }
  details[open] summary::after { content: '−'; }
  details p { color: var(--text-muted); margin-top: var(--space-3); font-size: 0.95rem; }
</style>
```

- [ ] **Step 2: Render Faq in `index.astro`** (import + add after `<Privacy />`).

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains "Which models does it support?".

- [ ] **Step 4: Commit**

```bash
git add src/components/Faq.astro src/pages/index.astro
git commit -m "feat: add FAQ accordion"
```

---

### Task 9: Footer + nav header

**Files:**
- Create: `src/components/Footer.astro`
- Create: `src/components/Header.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: design tokens.
- Produces:
  - `Header.astro` (no props) — a slim sticky top bar: wordmark `wardayacode` (link to `#`) + nav links (`Features`, `Privacy`, `FAQ`, `GitHub`). No JS.
  - `Footer.astro` (no props) — `<footer>` with install one-liner, GitHub/license/author links, copyright. No JS.

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
const repo = 'https://github.com/fawwazmw/wardayacode';
---
<header class="site-header">
  <div class="container bar">
    <a class="wordmark" href="#">wardaya<span>code</span></a>
    <nav>
      <a href="#features">Features</a>
      <a href="#privacy">Privacy</a>
      <a href="#faq">FAQ</a>
      <a href={repo} rel="noopener">GitHub</a>
    </nav>
  </div>
</header>

<style>
  .site-header { position: sticky; top: 0; z-index: 10; background: rgba(13,15,18,0.8);
    backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
  .bar { display: flex; align-items: center; justify-content: space-between; padding-block: var(--space-3); }
  .wordmark { font-family: var(--font-mono); font-weight: 700; color: var(--text); }
  .wordmark span { color: var(--accent); }
  .wordmark:hover { text-decoration: none; }
  nav { display: flex; gap: var(--space-5); font-size: 0.9rem; }
  nav a { color: var(--text-muted); }
  nav a:hover { color: var(--text); text-decoration: none; }
  @media (max-width: 600px) { nav a:not(:last-child) { display: none; } }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
const repo = 'https://github.com/fawwazmw/wardayacode';
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container">
    <div class="cta-final">
      <code>npm install -g wardayacode</code>
    </div>
    <nav class="links">
      <a href={repo} rel="noopener">GitHub</a>
      <a href={`${repo}/blob/main/LICENSE`} rel="noopener">MIT License</a>
      <a href="https://github.com/fawwazmw" rel="noopener">@fawwazmw</a>
    </nav>
    <p class="copy">© {year} Wardaya Dev. Built for the terminal.</p>
  </div>
</footer>

<style>
  .site-footer { padding-block: var(--space-7); border-top: 1px solid var(--border); text-align: center; }
  .cta-final code { font-family: var(--font-mono); color: var(--accent); background: var(--bg-elev);
    border: 1px solid var(--border); border-radius: var(--radius); padding: var(--space-3) var(--space-5); display: inline-block; }
  .links { display: flex; gap: var(--space-5); justify-content: center; margin-top: var(--space-5); font-size: 0.9rem; }
  .links a { color: var(--text-muted); }
  .copy { color: var(--text-muted); font-size: 0.85rem; margin-top: var(--space-4); }
</style>
```

- [ ] **Step 3: Wire Header + Footer into `index.astro`**

Final `index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Install from '../components/Install.astro';
import Features from '../components/Features.astro';
import SocialProof from '../components/SocialProof.astro';
import Privacy from '../components/Privacy.astro';
import Faq from '../components/Faq.astro';
import Footer from '../components/Footer.astro';
---
<Base title="wardayacode — AI coding agent for your terminal" description="An open-source, multi-provider AI coding agent that lives in your terminal. Claude, GPT-4, and Gemini.">
  <Header />
  <main>
    <Hero />
    <Install />
    <Features />
    <SocialProof />
    <Privacy />
    <Faq />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` contains "Wardaya Dev" and the nav link "FAQ".

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add header nav and footer"
```

---

### Task 10: Type-check, OG image placeholder, and final polish

**Files:**
- Create: `public/og-image.png` (placeholder)
- Modify: any component needing a fix surfaced by `astro check`.

**Interfaces:**
- Consumes: the whole site.
- Produces: a clean `astro check` and a present (placeholder) OG image so meta tags resolve.

- [ ] **Step 1: Run the type/diagnostics check**

Run: `npm run check`
Expected: 0 errors. Fix any reported issue in the named file, then re-run until clean.

- [ ] **Step 2: Add an OG image placeholder**

Create `public/og-image.png` — a 1200×630 PNG. If no design asset exists, generate a simple dark placeholder:

Run:
```bash
node -e "const f='public/og-image.png';const b=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');require('fs').writeFileSync(f,b);console.log('wrote',f)"
```
(This writes a 1×1 placeholder so the `og:image` URL resolves; replace with a real 1200×630 asset later.)

- [ ] **Step 3: Final build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add public/og-image.png
git commit -m "chore: add OG image placeholder and pass type-check"
```

---

### Task 11: Browser verification (manual, via Playwright)

**Files:** none (verification only).

**Interfaces:**
- Consumes: the running preview server.
- Produces: confirmation that the site renders and behaves correctly. No commit unless a fix is needed.

- [ ] **Step 1: Start preview server**

Run: `npm run build && npm run preview` (serves on http://localhost:4321 by default).

- [ ] **Step 2: Desktop render check**

Navigate to the preview URL at 1280×800. Confirm: header, hero with terminal demo, install commands, features grid, social badges, privacy, FAQ, footer all present and styled (dark theme, green accent).

- [ ] **Step 3: Interactions**

- Click a copy button → label flips to "Copied!".
- Click a FAQ `<summary>` → answer expands, `+` becomes `−`.
- Hero terminal types out the demo lines.

- [ ] **Step 4: Responsive check**

Resize to 375×812 (mobile). Confirm: hero stacks to one column, feature cards reflow to one column, nav collapses, no horizontal overflow.

- [ ] **Step 5: Reduced-motion check**

Emulate `prefers-reduced-motion: reduce` and reload. Confirm the terminal shows all lines immediately (no typing animation) and content is fully present.

- [ ] **Step 6: Record result**

If all checks pass, the site is done. If any check fails, fix the relevant component, rebuild, and re-verify before declaring complete (per verification-before-completion).

---

## Self-Review

**Spec coverage:**
- Stack (Astro/TS, no framework) → Task 1, Global Constraints. ✓
- Terminal/dark theme + tokens → Task 2. ✓
- Hero + faux terminal + typing animation → Task 3. ✓
- Install + copy buttons + Node 20 + `wdc` → Task 4. ✓
- Features (accurate numbers, no "56") → Task 5 (+ build guard). ✓
- Social proof (static badge) → Task 6. ✓
- Privacy (reframed, no false claim) → Task 7 (+ build guard). ✓
- FAQ (zero-JS accordion) → Task 8. ✓
- Footer + community links → Task 9. ✓
- SEO/OG/meta + favicon → Task 2 (meta) + Task 10 (og image). ✓
- A11y + reduced-motion → Task 2 (global) + Task 3 (script guard) + Task 11 (verify). ✓
- Root deploy now + documented project-site path → Task 1 (`astro.config.mjs`). ✓
- Build + browser verification → Tasks 10–11. ✓

**Placeholder scan:** No "TBD/TODO" left in plan content. The only intentional placeholders are the favicon and OG image assets, each flagged as replaceable. ✓

**Type/name consistency:** Component names (`Hero`, `Install`, `Features`, `SocialProof`, `Privacy`, `Faq`, `Header`, `Footer`) and the data attributes (`data-terminal`, `data-line`, `data-copy`) are used consistently across tasks and the final `index.astro`. ✓
