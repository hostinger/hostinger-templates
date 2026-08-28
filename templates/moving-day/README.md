# Moving Day

A polished single-page removals homepage with an interactive room-by-room move estimator.

## Overview

Moving Day is a static marketing site for a small independent removals company serving Bristol, Bath, and nearby areas. It gives prospective customers useful guidance before they make contact, while keeping the enquiry journey straightforward and personal.

Visitors choose room types and quantities to see an estimated move volume, recommended van size, and ballpark price. Their selection is saved in the URL, so the estimate survives a reload and can be shared.

## Features

- Interactive six-room inventory with quantity controls
- Live van-size, volume, and guide-price recommendation
- URL-serialized estimator state with reload hydration
- Pre-filled email quote handoff and click-to-call links
- Responsive service process, testimonial, statistics, and five-question FAQ
- FAQPage JSON-LD generated from the committed FAQ data

## Tech stack

- **Language:** TypeScript
- **Framework:** Vue 3
- **Build tool:** Vite
- **Styling:** Responsive plain CSS with custom properties

## Getting started

### Prerequisites

- Node.js 22+
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
├── assets/images/        # Local removals photography
├── components/           # Header, hero, estimator, and FAQ sections
├── composables/          # Estimate rules and URL-state behavior
├── data/                 # Business copy, rooms, vans, and pricing
├── styles/               # Global design system and responsive layout
├── types/                # Shared content types
├── App.vue               # Homepage composition and structured data
└── main.ts               # Vue entry point
```

## Personalizing

### Content and business data

Edit `src/data/site.json` for company details, contact links, trust points, process copy, statistics, and FAQs. Edit `src/data/pricing.json` for room types, cubic-volume assumptions, base pricing, per-volume pricing, rounding, and van-size thresholds.

### Branding and styles

Edit `src/styles/main.css` for colors, typography, spacing, layout, and responsive breakpoints. Core design tokens are grouped at the top in `:root`.

### Images

Local photographs live in `src/assets/images/` and are imported by `src/components/HeroSection.vue` and `src/App.vue`. Use high-quality landscape replacements at least 1600 pixels wide.

Photography attribution:

- “Men Carrying Boxes Inside the House” by RDNE Stock project — https://www.pexels.com/photo/men-carrying-boxes-inside-the-house-7464232/
- “A Man in Coveralls and Rubber Shoes Holding a Clipboard Near Cardboard Boxes” by RDNE Stock project — https://www.pexels.com/photo/a-man-in-coveralls-and-rubber-shoes-holding-a-clipboard-near-cardboard-boxes-7464367/

### Routes and features

This is a single-page app composed in `src/App.vue`. Section components live in `src/components/`. Estimator calculations, counter limits, URL query serialization, and hydration live in `src/composables/useMoveEstimate.ts`; inventory and pricing rules remain in `src/data/pricing.json`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/moving-day-thumbnail.png`
- Full page: `preview/moving-day-homepage.png`
