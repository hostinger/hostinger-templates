# Launch

An editorial SaaS homepage for turning product releases into clear, high-energy campaigns.

## Overview

Launch is a single-page marketing template for SaaS teams that need a memorable product homepage. It leads visitors from a bold product story through proof, workflow, pricing, feature comparison, and common questions.

The primary journey ends with an honest email-backed early-access form. The static site opens the visitor’s email client with a prepared request; it does not claim to store data or create an account.

## Features

- Responsive editorial hero with a CSS and SVG product-room illustration
- Product story, quantified proof, testimonial, and three-step workflow sections
- Three pricing plans with a live monthly/annual billing toggle and explicit yearly savings
- Recommended middle tier and an eight-row feature comparison
- Mobile plan comparison cards with controlled horizontal scrolling
- Four-question FAQ with `FAQPage` JSON-LD
- Accessible, mailto-backed waitlist form with browser-native email validation
- Single statically exported home route

## Tech stack

- **Language:** TypeScript
- **Framework:** Next.js App Router with React
- **Build tool:** Next.js static export
- **Styling:** Plain CSS split into foundation, section, and responsive layers
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
launch/
├── preview/
│   ├── launch-homepage.png
│   └── launch-thumbnail.png
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ClosingSections.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Pricing.tsx
│   │   ├── ProductVisual.tsx
│   │   └── StorySections.tsx
│   ├── content/
│   │   ├── pricing.json
│   │   └── site.ts
│   ├── styles/
│   │   ├── foundation.css
│   │   ├── responsive.css
│   │   └── sections.css
│   └── types/
│       └── index.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Personalizing

### Content and business data

Edit all site copy, navigation, contact details, FAQ content, proof points, and workflow steps in `src/content/site.ts`. Edit plan prices, billing labels, plan descriptions, and feature availability in `src/content/pricing.json`.

### Branding and styles

Edit colors, typography, spacing tokens, and shared element styles in `src/styles/foundation.css`. Section layout and component presentation live in `src/styles/sections.css`; breakpoints and mobile behavior live in `src/styles/responsive.css`.

### Images

This template uses no raster content in the application. The product artwork is built from HTML, CSS, and the small inline arrow SVG in `src/components/ProductVisual.tsx`. If you add local images, keep them in `src/assets/images/` and import them from the component that renders them; use source images at least twice their largest displayed dimensions.

### Routes and features

The single Home route is composed in `src/app/page.tsx`; global metadata and styles are configured in `src/app/layout.tsx`. Major sections live in `src/components/`. Pricing interaction and the feature matrix live in `src/components/Pricing.tsx`; the mailto waitlist and FAQ live in `src/components/ClosingSections.tsx`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `out/`.

## Screenshots

- Thumbnail: `preview/launch-thumbnail.png`
- Full page: `preview/launch-homepage.png`
