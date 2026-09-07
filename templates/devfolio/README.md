# Devfolio

A developer résumé you can explore like a terminal — type `projects`, get the list — with the same content readable as plain semantic HTML when JavaScript is off.

## Overview

Devfolio is a single-page portfolio for a developer who wants their résumé to be remembered. The page opens on an interactive terminal: visitors type `help`, `experience`, or `projects` and the matching résumé block prints into the scrollback, complete with arrow-key history, tab completion, and a "did you mean" hint for typos.

Below the terminal, the entire résumé repeats as man-page-styled semantic HTML — about, experience, projects, skills, education, contact, and an FAQ. Both views render from the same `src/lib/data/resume.json`, so they can never drift apart. Because the site is fully prerendered with adapter-static, the HTML version loads and reads without a single script: the terminal is a progressive enhancement, not a requirement.

Recruiters who don't play along still get a skimmable, printable CV; the ones who do get a demo of exactly the kind of care the candidate puts into software.

## Features

- Interactive terminal with nine commands (`help`, `about`, `whoami`, `experience`/`work`, `projects`, `skills`, `education`, `contact`, `clear`) — each prints the matching block rendered from `resume.json`
- Arrow-key command history with draft restore, plus bash-style tab completion that completes unique prefixes and lists candidates for ambiguous ones
- Helpful unknown-command response with an edit-distance "did you mean" suggestion and a pointer to `help`
- Keyboard-accessible prompt with a visible focus state, an `aria-live` output log, click-to-focus that respects text selection, and quick-command chips for touch screens
- Full no-JavaScript fallback: the complete résumé is prerendered semantic HTML, the prompt disables itself, and a `<noscript>` note points readers to the text below
- Man-page-styled sections with `user@host:~$ command` markers that mirror the terminal commands
- `mailto:` contact actions built from the same email address shown on screen, plus social links
- Five-question FAQ with `FAQPage` JSON-LD structured data
- CRT theme: true-black background, phosphor-green text, amber block cursor, subtle static scanlines, reduced-motion-safe cursor blink, and a print stylesheet that flips to black-on-white
- Responsive down to 320 px with no horizontal overflow

## Tech stack

- **Language:** TypeScript
- **Framework:** SvelteKit (Svelte 5) with `@sveltejs/adapter-static` — fully prerendered
- **Build tool:** Vite
- **Styling:** Hand-written CSS — design tokens in a global stylesheet plus scoped component styles
- **Linting:** ESLint (`eslint-plugin-svelte`, `typescript-eslint`)
- **Overrides:** `cookie@^0.7.0` — `@sveltejs/kit` still pins `cookie@^0.6.0`. Remove the override when Kit raises that range.

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL printed by Vite.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── lib/
│   ├── assets/            # favicon.svg
│   ├── components/        # status bar, hero, terminal panel, résumé sections, FAQ, footer
│   ├── data/              # resume.json + faq.json — all editable copy
│   ├── styles/            # global.css — CRT design tokens and base styles
│   ├── terminal/          # commands.ts (registry), output.ts (line model), banner.ts (ASCII art)
│   ├── resume.ts          # typed content access, mailto builder, prompt string
│   └── types.ts           # shared content types
├── routes/
│   ├── +layout.svelte
│   ├── +layout.ts         # prerender = true
│   └── +page.svelte       # composes the page
static/
└── robots.txt
```

## Personalizing

### Content and business data

Everything on the page renders from `src/lib/data/resume.json`: name, role, location, summary and about paragraphs, email and subject line, the contact lede, social links, three jobs with impact bullets, four projects with stacks and links, grouped skills, and education. The `meta` block holds the site title, the `username`/`hostname` pair shown in every prompt, the hero tagline (also used as the meta description), and the playful SYNOPSIS line. FAQ questions and answers live in `src/lib/data/faq.json` and feed both the visible FAQ and its JSON-LD.

Terminal behavior is code, not copy: commands are a typed registry in `src/lib/terminal/commands.ts` — add an entry (name, aliases, summary, `run`) and `help`, tab completion, and the typo suggestions pick it up automatically.

### Branding and styles

Edit `src/lib/styles/global.css` — the true-black/phosphor-green/amber color tokens, the Space Mono Google Fonts import, glow shadows, the scanline overlay, buttons, man-page heading styles, and the print palette sit at the top. Section-specific rules live in each component's scoped `<style>` block in `src/lib/components/`. The ASCII wordmark in the terminal welcome is `src/lib/terminal/banner.ts`; any figlet-style ASCII art drops in.

### Images

This template ships no photography by design — the visuals are CSS, ASCII art, and one original SVG favicon at `src/lib/assets/favicon.svg` (referenced in `src/routes/+layout.svelte`). Replace it with any square SVG.

### Routes and features

Single prerendered route: `src/routes/+page.svelte` composes `StatusBar`, `Hero` (which mounts `TerminalPanel`), the man-page sections (`AboutSection` through `ContactSection`), `FaqSection`, and `SiteFooter` from `src/lib/components/`. Section anchors, prompt strings, and the man-header reference all derive from `resume.json`. Prerendering is switched on in `src/routes/+layout.ts`. The quick-command chips are the `QUICK_COMMANDS` array in `src/lib/components/TerminalPanel.svelte`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `build/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/devfolio-thumbnail.png`
- Full page: `preview/devfolio-homepage.png`
