# Quote Slider

A transparent, interactive home-cleaning quote page that turns room counts and visit frequency into a shareable estimate.

## Overview

Quote Slider is a focused single-page site for an independent residential cleaning service. It replaces opaque “contact us for pricing” flows with an immediate estimate and clear, inspectable pricing rules.

Visitors adjust bedroom and bathroom sliders, choose one of three cleaning frequencies, and see the visit price and itemized math update live. Their choices are preserved in the URL, so a configured estimate survives reloads and can be shared. Print and pre-filled email actions provide an honest handoff to the cleaning team without pretending to book or charge a customer.

## Features

- Live bedroom, bathroom, and frequency quote controls
- Explicit base, per-room, and repeat-visit pricing rules
- URL-serialized state with direct-load hydration
- Itemized quote with transparent discount calculation
- Browser-print one-pager and pre-filled `mailto:` quote handoff
- Responsive service overview, proof points, and four-question FAQ
- `FAQPage` JSON-LD generated from visible FAQ content
- Accessible range inputs, radio controls, landmarks, and focus states

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro
- **Build tool:** Astro
- **Styling:** Plain responsive CSS with print styles
- **Content:** Committed JSON data
- **Linting:** ESLint flat configuration

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
├── assets/
│   └── images/
├── components/
├── data/
├── layouts/
├── pages/
├── styles/
└── types/
preview/
```

Astro statically renders the single route. The calculator owns its browser state and pricing updates; structured content and pricing remain outside component logic.

## Personalizing

### Content and business data

Edit `src/data/site.json` for brand copy, contact details, service area, navigation, checklist items, and proof points. Edit `src/data/pricing.json` for the base price, room increments, control limits, frequency labels, and discounts. FAQ copy lives in `src/pages/index.astro` beside its matching structured data.

### Branding and styles

Edit `src/styles/global.css`. Design tokens, typography, layout, responsive breakpoints, control styling, and the dedicated print stylesheet live in that file.

### Images

Local imagery lives in `src/assets/images/` and is imported through Astro’s image pipeline in `src/pages/index.astro`. Replace the hero with a portrait image around a 2:3 ratio and at least 1200px wide. The current image, “A Smiling Woman Holding a Spray Bottle,” is by Liliana Drew on Pexels: https://www.pexels.com/photo/a-smiling-woman-holding-a-spray-bottle-9462206/

### Routes and features

The Home route lives at `src/pages/index.astro`. `src/components/QuoteCalculator.astro` contains quote controls, URL hydration and serialization, price calculation, print action, and pre-filled email handoff. Update the frequency IDs and rules in `src/data/pricing.json`; keep IDs URL-safe and unique.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/quote-slider-thumbnail.png`
- Full page: `preview/quote-slider-homepage.png`
