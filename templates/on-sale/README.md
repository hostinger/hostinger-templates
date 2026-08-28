# On Sale

A vivid static ticket page for one-off events, workshops, and shows.

## Overview

On Sale gives independent event organizers a focused page for announcing one event and turning interest into ticket enquiries or purchases. The included example promotes a screen-print workshop and poster show with high-impact event details, three ticket tiers, and a clear booking path.

Visitors can check the early-bird countdown, compare committed ticket counts and inclusions, then use a configured checkout URL or a prefilled email fallback. The page clearly labels its counts as manually maintained rather than live inventory.

## Features

- Live hydration-safe early-bird countdown with an accessible text update.
- Three perforated ticket tiers with prices, inclusions, and visible remaining counts.
- Per-tier external checkout URLs with prefilled `mailto:` booking fallbacks.
- Honest static availability disclaimer with no backend or inventory API claims.
- Five expandable FAQs plus Event and FAQPage JSON-LD.
- Responsive layouts for desktop, `390 × 844`, and `320px` mobile widths.
- Reduced-motion support and visible keyboard focus states.

## Tech stack

- **Language:** TypeScript
- **Framework:** SvelteKit with adapter-static
- **Build tool:** Vite
- **Styling:** Handwritten global CSS with design tokens and responsive media queries

## Getting started

### Prerequisites

- Node.js 22.12 or newer
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
├── lib/
│   ├── components/
│   │   ├── Countdown.svelte
│   │   ├── EventHero.svelte
│   │   ├── FaqList.svelte
│   │   ├── TicketList.svelte
│   │   └── TicketTier.svelte
│   ├── content/
│   │   └── event.json
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   └── event.ts
│   └── utils/
│       ├── countdown.ts
│       └── tickets.ts
├── routes/
│   ├── +layout.svelte
│   ├── +layout.ts
│   └── +page.svelte
└── app.html
```

## Personalizing

### Content and business data

Edit `src/lib/content/event.json` for event copy, dates, venue, organizer email, ticket tiers, counts, URLs, and FAQs. Set a tier's `ticketUrl` to an external checkout URL; leave it as `null` to generate a prefilled email enquiry.

### Branding and styles

Edit `src/lib/styles/global.css`. Color tokens, type stacks, spacing, layout, poster textures, and responsive breakpoints are centralized there.

### Images

This design uses typography and CSS/SVG patterns, so no local raster images are required. If you add photography, place optimized files in `static/images/` and reference them from components with `/images/<filename>`.

### Routes and features

`src/routes/+page.svelte` composes the single home route and defines its structured data. `src/lib/components/` contains major page sections. Countdown calculations and CTA link rules live in `src/lib/utils/`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `build/`.

## Screenshots

- Thumbnail: `preview/on-sale-thumbnail.png`
- Full page: `preview/on-sale-homepage.png`
