# Bakery Preorder

A weekend microbakery preorder page with a rolling order cut-off countdown, collection slots that visibly fill up, and honest email reservations.

## Overview

Bakery Preorder is a single-page site for a weekend baker who sells small batches from a home kitchen. The demo brand, The Saturday Loaf, bakes six items to order: visitors browse this weekend's list, watch an oven-timer countdown to the Thursday 18:00 cut-off, check which Saturday collection slots still have space, and reserve their bakes.

The cut-off is configuration, not a hardcoded date. The countdown always targets the next occurrence of the configured weekday and time, and when this week's cut-off has already passed it rolls to next week and says so plainly. The reserve form is equally honest: submitting composes a prefilled order email to the baker and tells the visitor that nothing is reserved until they press Send — no fake server, no pretend confirmation.

## Features

- Oven-timer countdown to the next configured cut-off (weekday + time in `src/data/site.json`), rolling to next week automatically with an "orders reopen" message
- Collection slot tags with capacity meters, remaining counts, nearly-full and fully-booked states driven by seed data
- Six-bake list with local photography, per-item pricing, and units
- Quantity steppers plus a live order ticket showing line items, running total, chosen slot, and the computed collection date
- Reserve form that validates name, at least one bake, and an available slot, then opens a prefilled `mailto:` order and confirms locally what happened
- Full slots are disabled in the reservation select
- Copy-order-text fallback for visitors without a configured email app
- How-collection-works steps, baker introduction, and contact footer
- Five-question FAQ with `FAQPage` JSON-LD
- Semantic, keyboard-accessible markup with visible focus states, verified at 1440, 390, and 320 widths

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
├── types/
└── utils/
public/
└── images/
```

`src/pages/index.astro` composes the single route from focused components. Editable business content lives in committed JSON files under `src/data/`, typed by `src/types/content.ts`, with cut-off date math in `src/utils/cutoff.ts`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the bakery name, headline copy, baker introduction, email, phone, collection address, order cut-off weekday and time, bake day, and navigation labels. Edit `src/data/bakers.json` for the six bakes (name, unit, description, price, image, alt text) and the four collection slots (time range, capacity, reserved count). FAQ questions and answers live in the `faqs` array of `src/data/site.json`. The how-it-works steps live in `src/pages/index.astro`.

### Branding and styles

Edit `src/styles/global.css`. Colour and font tokens are in the `:root` block at the top; section layouts and responsive rules follow in the same file.

### Images

Replace local files in `public/images/` and keep the matching paths in `src/data/bakers.json` and the hero image in `src/pages/index.astro`. Photos at least 1200px wide work best: bake cards crop to 4:3 and the hero crops to 5:6. Current photos were sourced from Pexels contributors Lauren Heaton, K Zoltan, Polina Tankilevitch, Natalia Olivera, Lara, Geraud pfeiffer, and İdil Ceren Çelikler.

### Routes and features

The single route is `src/pages/index.astro`. The countdown behaviour lives in `src/components/Countdown.astro` with date math in `src/utils/cutoff.ts`; slot cards in `src/components/SlotBoard.astro`; the reservation form, order ticket, and mailto composition in `src/components/ReserveForm.astro`. Navigation anchors come from `src/data/site.json`.

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

- Thumbnail: `preview/bakery-preorder-thumbnail.png`
- Full page: `preview/bakery-preorder-homepage.png`
