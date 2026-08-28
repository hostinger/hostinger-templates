# Drop

A drop-shop page for vintage one-of-one pieces — a live countdown to Friday's drop, items that flip to a stamped SOLD state, and claims over plain email.

## Overview

Drop is a single-page site for a seller whose stock is one of one: vintage jackets, boots, watches, frames. Instead of a cart and a stock counter it sells the ritual of a drop — a huge masthead countdown ticks down to the configured release time, the eight pieces hang in a brutalist rail below it, and every claim happens over email, first come, first served.

The page has two honest states computed from one configured datetime. Before the drop, pieces carry a "Drops Fri" chip and an "Ask about this piece" button that opens a pre-filled question email. Once the time passes, the masthead flips to a giant LIVE NOW, chips flip to AVAILABLE, and the buttons become "Claim by email" with a CLAIM subject line. Pieces marked sold are desaturated, stamped SOLD at an angle, show a struck-through price with a GONE flag, and lose their claim action entirely.

Nothing pretends to be a live system: the copy explains that SOLD stamps are updated by hand when a claim lands, and every email action is built from the same seller address displayed on the page.

## Features

- Live countdown masthead (days : hours : minutes : seconds) computed each second from the drop datetime in `src/data/drops.json`
- Automatic upcoming → live flip in the browser once the configured datetime passes: LIVE NOW masthead, AVAILABLE chips, claim-mode buttons, and a state-aware ticker — no redeploy needed
- Sold pieces are visibly dead: greyscale photo, rotated SOLD stamp, struck price with a GONE flag, and no enquiry action
- Per-item mailto enquiry pre-filled with the piece name, spec line, and price; the subject switches from "Question" to "CLAIM" when the drop is live
- Full-bleed marquee ticker strip repeating the drop facts, with a static fallback under `prefers-reduced-motion`
- Eight-piece brutalist grid driven entirely by committed JSON (`src/data/drops.json`), with drop-wide counts ("6 still unclaimed") derived from the sold flags
- "How a drop works" steps plus an honesty strip explaining there is no cart, checkout, or live stock counter
- Five-question FAQ rendered from `src/data/site.json` with `FAQPage` JSON-LD structured data
- Fully prerendered static output (`ssr: false` + `prerender`) that any static file host can serve
- Semantic HTML, native keyboard-accessible `details`/`summary` FAQ, visible focus states, and responsive layouts down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** React 19 with React Router 8 (framework mode, `ssr: false` + prerendered routes)
- **Build tool:** Vite (via `@react-router/dev`)
- **Styling:** Plain hand-written CSS with centralized design tokens
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

Open the local URL printed by the development server.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── components/
├── data/
├── routes/
├── styles/
├── types/
├── utils/
├── root.tsx
└── routes.ts
public/
└── images/
```

`src/routes.ts` maps the single index route to `src/routes/home.tsx`, which composes the page from focused components in `src/components/`. Editable content lives in committed JSON files in `src/data/`, typed by `src/types/content.ts`; countdown, formatting, and mailto logic live in `src/utils/`. `react-router.config.ts` points the app directory at `src/` and enables static prerendering.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the shop name, tagline, seller name, email, city, intro, the no-cart honesty note, the three how-it-works steps, social links, FAQ questions and answers, and the footer fine print. Edit `src/data/drops.json` for the drop itself: `dropName`, `dropNumber`, `dropDatetime` (ISO 8601 with a UTC offset, e.g. `2026-09-25T19:00:00-04:00`), `timezone` (IANA name used to render dates), `timezoneLabel`, and the `items` array — each item holds `name`, `era`, `size`, `condition`, `price`, `image`, `imageAlt`, and `sold`. Set `sold` to `true` after a claim lands to stamp the piece SOLD and remove its email action; the countdown, the upcoming/live flip, and the "still unclaimed" counts are all computed from this file by `src/utils/drop.ts` and `src/utils/content.ts`.

### Branding and styles

Edit `src/styles/global.css`. The design tokens (`--ink`, `--paper`, `--accent`, type stacks, spacing) and the Google Fonts `@import` (Archivo and JetBrains Mono) sit at the top of the file; header, ticker, masthead, grid, FAQ, footer, and responsive rules follow in the same file.

### Images

Local photos live in `public/images/` and are referenced by path from `src/data/drops.json` (`item-01.jpg` … `item-08.jpg`). Cards crop to a 4:5 ratio with `object-fit: cover`, so portrait photos around 1600px wide work best; keep `imageAlt` in sync when swapping. The favicon is `public/favicon.svg`. The current photos were sourced from Pexels contributors Keenan Constance, MART PRODUCTION, Robert So, ge yonk, Castorly Stock, Hanna Pad, Margarita, and Badis Benkhelil.

### Routes and features

This is a single prerendered route: `src/routes.ts` → `src/routes/home.tsx`, which orders the sections (`Header`, `Ticker`, `CountdownMasthead`, `DropGrid`, `HowItWorks`, `FaqSection`, `Footer` in `src/components/`). Static output is configured in `react-router.config.ts` (`ssr: false`, `prerender: ["/"]`). Countdown and status logic live in `src/utils/drop.ts`, the ticking clock in `src/utils/useNow.ts`, and the pre-filled mailto builder in `src/utils/enquiry.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `build/`; the deployable static site is `build/client/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/drop-thumbnail.png`
- Full page: `preview/drop-homepage.png`
