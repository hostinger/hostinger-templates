# Flash Sheet

A tactile multi-page tattoo studio site for browsing and enquiring about one-off flash designs.

## Overview

Flash Sheet gives independent tattoo artists a distinctive digital wall for ready-made work. Visitors can scan eight original pieces, filter by motif, inspect practical details, and open any artwork on its own direct-load route.

Each claim action clearly opens a pre-filled email enquiry rather than taking a deposit or promising a booking. The flow keeps availability, size, suggested placement, and guide pricing transparent.

## Features

- Responsive flash wall with motif filters and eight original local SVG artworks
- Eight direct-load detail routes at `/flash/:id`
- Accessible enquiry dialog with design details and a pre-filled email handoff
- Studio information, four expandable FAQs, and FAQPage JSON-LD
- Desktop, tablet, 390px, and 320px layouts

## Tech stack

- **Language:** TypeScript
- **Framework:** React with React Router
- **Build tool:** Vite
- **Styling:** Responsive plain CSS

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
├── assets/flash/       # Eight original SVG artworks
├── components/         # Shared cards, artwork, dialog, header, FAQ, footer
├── constants/          # Typed content exports and artwork map
├── data/               # Editable studio and flash JSON
├── pages/              # Home and design-detail pages
├── styles/             # Foundation, sections, and responsive CSS
├── types/              # Shared content shapes
├── App.tsx             # Route composition
└── main.tsx            # React entry point
```

## Personalizing

### Content and business data

Edit `src/data/site.json` for studio copy, contact details, hours, address, and FAQs. Edit `src/data/flash.json` for design names, descriptions, prices, size, placement, availability, and artwork filenames.

### Branding and styles

Edit design tokens and typography in `src/styles/foundation.css`, section layouts in `src/styles/sections.css`, and breakpoints in `src/styles/responsive.css`.

### Images

Original artwork lives in `src/assets/flash/` and is mapped once in `src/constants/artwork.ts`. Keep replacement SVGs on the existing `400 × 500` viewBox for consistent card proportions.

### Routes and features

Routes are declared in `src/App.tsx`. Page composition lives in `src/pages/`, while filters, enquiry links, and shared content exports live in `src/constants/content.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist`.

## Screenshots

- Thumbnail: `preview/flash-sheet-thumbnail.png`
- Full page: `preview/flash-sheet-homepage.png`
