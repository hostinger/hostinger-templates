# Pricing Calculator

A shareable single-screen calculator for modeling technical SaaS costs by workspace seats and monthly API usage.

## Overview

Pricing Calculator gives SaaS teams a transparent way to explore a monthly infrastructure estimate without connecting an account or billing system. Users can adjust seats and API volume with synchronized sliders and number fields while a receipt-style summary explains every charge.

The estimate applies included allowances, per-seat pricing, and progressive API usage tiers from a committed JSON rate table. Valid values are restored from the URL, making any estimate easy to copy, share, and reopen.

## Features

- Live seat and monthly API usage controls with accessible range and number inputs
- Progressive usage-tier calculation with itemized platform, seat, and traffic charges
- Shareable URL state with validation and safe fallback for missing or invalid parameters
- Receipt-style estimate designed to remain useful when printed or captured
- Responsive layouts for desktop, tablet, 390px, and 320px viewports
- Three expandable Q&As explaining metering, tier behavior, and estimate limits

## Tech stack

- **Language:** TypeScript
- **Framework:** SvelteKit with adapter-static
- **Build tool:** Vite
- **Styling:** Hand-authored responsive CSS
- **Content:** Committed JSON pricing table

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
├── lib/
│   ├── components/        # Calculator, chart, receipt, and Q&A components
│   ├── content/           # Editable product copy and pricing table
│   ├── types/             # Shared pricing domain types
│   ├── calculation.ts     # Progressive pricing calculation and formatting
│   └── url-state.ts       # Typed URL parsing and serialization
├── routes/
│   ├── +layout.ts         # Static prerender configuration
│   └── +page.svelte       # Single-screen page composition and state
├── styles/
│   └── global.css         # Design tokens, layout, controls, and responsive rules
└── app.html               # SvelteKit document shell
```

## Personalizing

### Content and business data

Edit `src/lib/content/pricing.json` to change product copy, default values, input limits, included allowances, seat pricing, usage tiers, and Q&A content. Keep pricing field shapes aligned with `src/lib/types/pricing.ts`.

### Branding and styles

Edit `src/styles/global.css` for colors, typography, spacing, layout, control styling, print behavior, and responsive breakpoints. Core design tokens are grouped at the top in `:root`.

### Images

This project does not use raster images. The usage curve is generated as responsive SVG markup in `src/lib/components/UsageCurve.svelte`; adjust its view box and paths there.

### Routes and features

The single route is composed in `src/routes/+page.svelte`. Calculator controls live in `src/lib/components/MetricControl.svelte`, charge rules in `src/lib/calculation.ts`, URL behavior in `src/lib/url-state.ts`, and receipt output in `src/lib/components/EstimateReceipt.svelte`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `build/`.

## Screenshots

- Thumbnail: `preview/pricing-calculator-thumbnail.png`
- Full page: `preview/pricing-calculator-homepage.png`
