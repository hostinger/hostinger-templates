# Roadmap

A public now / next / later roadmap board for a SaaS product where visitors vote on what ships next — votes stay on their device, with no accounts and no backend.

## Overview

Roadmap is a single-page product board for a team that wants to build in the open. The page belongs to Ledgerline, a fictional invoicing app for one-person studios, and shows the whole build queue in three glowing columns: what's in development now, what's scoped next, and what's on the horizon. Every card carries a title, a plain-language paragraph, tags, and a vote pill.

Visitors tap a pill to vote an item up and tap again to take the vote back. Votes live in the browser's local storage — there is nothing to sign up for and nothing is sent to a server. The copy is deliberately honest about that: every count is the published baseline from the last board update plus the visitor's own on-device vote, and the page says so in the hero, the explainer, the FAQ, and the footer rather than pretending to be a live synced tally.

The whole page is rendered from JSON at build time, so the board is fully readable with JavaScript switched off — only the vote buttons deactivate, and a note explains why. A "Suggest an idea" button opens a pre-filled email built from the address shown in the footer.

## Features

- Now / Next / Later board seeded with eight roadmap items, each with a one-paragraph description, tags, a baseline vote count, and a distinct glowing column identity (emerald, sky, violet)
- One-tap voting with real `<button>` elements: `aria-pressed` state, keyboard operation via Enter/Space, visible focus rings, and a "Voted" flag styled in the column's accent
- Votes persist in `localStorage` across visits and toggle off when tapped again; displayed counts are always baseline + this device's vote
- Honest device-only voting copy in the hero note, three-step explainer, FAQ, and footer small print — the page never implies a live synced tally
- Build-time rendering from `src/data` JSON via posthtml-expressions, so the entire board is readable without JavaScript (a `noscript` note covers the disabled pills)
- Five-question FAQ rendered from JSON with matching `FAQPage` JSON-LD structured data
- "Suggest an idea" mailto with a pre-filled subject and body template, built from the same email address displayed in the footer
- Responsive from 1440px down to 320px with stacked columns on mobile, no horizontal overflow, and reduced-motion support

## Tech stack

- **Language:** TypeScript (vanilla, no UI framework)
- **Framework:** None — static build-time rendering plus a small typed hydration module
- **Build tool:** Parcel 2 (with posthtml-expressions for build-time templating)
- **Styling:** Hand-written CSS with centralized design tokens
- **Linting:** ESLint

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

Open the local URL printed by Parcel.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
index.html
favicon.svg
.posthtmlrc.cjs
src/
├── data/
│   ├── roadmap.json
│   └── site.json
├── styles/
│   ├── main.css
│   ├── base.css
│   ├── sections.css
│   └── responsive.css
├── types/
│   └── content.ts
├── utils/
│   ├── template.ts
│   └── votes.ts
├── content.ts
└── main.ts
```

`index.html` holds the whole page as a template; `.posthtmlrc.cjs` injects the JSON from `src/data/` at build time, so the served HTML is complete and readable without JavaScript. `src/main.ts` only hydrates the vote pills: it enables them, restores this device's votes, and keeps counts, labels, and pressed state in sync. Vote logic is a set of pure functions in `src/utils/votes.ts`, typed by `src/types/content.ts`.

## Personalizing

### Content and business data

Edit `src/data/roadmap.json` for the board itself — the three column definitions (`label`, `description`) and the items, each with `id`, `title`, a one-paragraph `description`, `tags`, a `baseVotes` count, and a `status` of `now`, `next`, or `later`. Adding, removing, or moving items is just editing this file; vote wiring keys off the item `id`. Edit `src/data/site.json` for the product name, tagline, meta description, contact email, navigation, the suggest-email subject/body templates (`{product}` placeholder), hero copy, board section copy and vote-button label templates (`{title}`, `{count}`), the three explainer steps, the FAQ entries, and the footer lines. The localStorage key lives in `src/utils/votes.ts` (`VOTES_STORAGE_KEY`).

### Branding and styles

Edit `src/styles/base.css` — background, surface, text, and the three column accent tokens (`--now`, `--next`, `--later`) sit at the top, alongside fonts and radii. Column accents are mapped to columns in the `.column-now` / `.column-next` / `.column-later` rules in `src/styles/sections.css`, which also holds all section layout. Breakpoints live in `src/styles/responsive.css`, and the Google Fonts import (Onest) is the first line of `src/styles/main.css`; counts and tags use the system mono stack from `--font-mono`.

### Images

There are no photographs — all artwork is inline SVG. The brand mark (three kanban bars) appears in the header and footer of `index.html`, the vote chevron/check and note icons sit inside the same file, and the favicon is `favicon.svg` at the project root.

### Routes and features

This is a single static route. Section order comes from `index.html`; the data injected at build time is assembled in `.posthtmlrc.cjs` (column grouping, vote-label prefill, the suggest mailto, and the FAQ JSON-LD). Vote behavior — toggle, persistence, count math — lives in `src/utils/votes.ts` and is wired to the pills by `src/main.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/roadmap-thumbnail.png`
- Full page: `preview/roadmap-homepage.png`
