# Tap List

A live taproom keg board that shows what is pouring, ABV, price, and how full every keg is — including what is about to blow.

## Overview

Tap List is a single-page website for a taproom whose real product changes nightly: the keg board. Instead of a stale PDF menu, visitors see the same board the staff keep behind the bar — eight numbered taps with beer name, brewery, style, ABV, pour size, price, and a vertical sight-glass gauge showing how full each keg is.

The gauges carry real states. Fresh kegs get a brass "Fresh keg" chip, kegs under 20% are flagged with a pulsing "About to blow" warning, and an empty keg is stamped "Blown" with a struck-through name and a drained, striped gauge. A masthead status panel counts pouring, about-to-blow, and blown kegs and shows when the board was last updated, so regulars can decide whether to walk over now or mourn from home.

Everything routes toward a visit: prominent click-to-call and email actions in the header, masthead, and visit section, plus address, opening hours, house rules for the board, and a five-question FAQ.

## Features

- Eight-tap keg board with vertical fill gauges, tick marks, and foam caps, each with an accessible "about 63% remaining" text equivalent
- Distinct visual states: fresh keg chip, pulsing "About to blow" warning under 20%, and a stamped, greyed-out "Blown" empty state
- Style filter chips (all, hoppy, crisp & lagered, dark & roasty, sour & farmhouse) with a live "Showing X of 8 taps" count announced via `aria-live`
- Masthead status panel computed from the tap data: pouring / about to blow / blown counts plus a "last updated" line
- Committed JSON content: `src/data/taps.json` is the single source of truth for the board and `src/data/site.json` for business details
- Prominent `tel:` and `mailto:` contact actions in the header, masthead, and visit section — no forms, no fake backend
- Visit section with address, opening hours, and a local bar photo; house-rules strip explaining how the board works
- Five-question FAQ with `FAQPage` JSON-LD structured data in the head
- Semantic HTML, keyboard-focusable controls with visible focus states, reduced-motion support, and responsive layouts down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro
- **Build tool:** Astro
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

Open the local URL printed by Astro.

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
├── layouts/
├── pages/
├── styles/
└── types/
public/
└── images/
```

`src/pages/index.astro` composes the page from focused components in `src/components/`. Editable content lives in committed JSON files in `src/data/`, typed by `src/types/content.ts`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the taproom name, city, tagline, intro, board-status line, phone, email, address, opening hours, navigation anchors, and social links. Edit `src/data/taps.json` for the eight taps — each entry holds `number`, `name`, `brewery`, `style`, `family` (one of `hoppy`, `crisp`, `dark`, `wild`), `abv`, `price`, `pour`, `fillPercent` (0–100), and a tasting `note`. Setting `fillPercent` to 20 or below triggers the "About to blow" state and 0 the "Blown" state; the thresholds live in `src/types/content.ts` (`LOW_FILL_THRESHOLD`, `FRESH_FILL_THRESHOLD`). FAQ questions and answers live in the `faqs` array of `src/data/site.json`. House-rule copy lives in `src/components/HouseNotes.astro`.

### Branding and styles

Edit `src/styles/global.css`. Color tokens, the Google Fonts import (Bebas Neue and Space Grotesk), and typography variables sit at the top of the file; component, gauge, and responsive rules follow in the same file.

### Images

Local images live in `public/images/`. The visit-section photo is referenced in `src/components/VisitSection.astro`; replace `public/images/taproom.jpg` with a landscape photo around 1600px wide and update the `alt`, `width`, and `height` attributes. The favicon is `public/favicon.svg`. The current bar photo was sourced from Pexels contributor Daka.

### Routes and features

This is a single static route: `src/pages/index.astro`. Section order is composed there from `BoardMasthead`, `TapBoard`, `HouseNotes`, `VisitSection`, and `FaqSection` in `src/components/`. Navigation anchor links live in `src/data/site.json`; the filter-chip families and the board interaction script live in `src/components/TapBoard.astro`.

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

- Thumbnail: `preview/tap-list-thumbnail.png`
- Full page: `preview/tap-list-homepage.png`
