# Compare

An evidence-minded SaaS comparison page for presenting a product shortlist with clear, honest trade-offs.

## Overview

Compare is a static product-marketing template for technical SaaS teams that need a credible alternative to vague feature grids. It positions the fictional product Plainly against three competitors using ten concrete buying criteria, transparent pricing context, and an explicit “Where we lose” disclosure.

Visitors can scan the decision brief, inspect the semantic comparison table, review best-fit summaries, open common procurement questions, and request a trial through a prefilled email. The single-page journey is designed to remain readable on narrow screens through a keyboard-focusable, controlled horizontal table scroll.

## Features

- Semantic comparison table covering four products and ten committed criteria
- Clearly marked competitor win and honest “Where we lose” row
- Sticky legend, best-offer markers, methodology note, and review date
- Responsive product verdict cards and controlled mobile table scrolling
- Five accessible FAQ disclosures with matching FAQPage JSON-LD
- WebPage and SoftwareApplication structured metadata for answer engines
- Prefilled `mailto:` trial CTA with no backend or environment variables

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro 6
- **Build tool:** Astro
- **Styling:** Custom responsive CSS with design tokens
- **Linting:** ESLint flat config with eslint-plugin-astro

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
│   ├── ComparisonTable.astro
│   ├── DecisionBrief.astro
│   ├── FaqSection.astro
│   ├── FinalCta.astro
│   └── SiteHeader.astro
├── content/
│   └── compare.json
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── styles/
│   └── global.css
└── types/
    └── compare.ts
```

## Personalizing

### Content and business data

Edit `src/content/compare.json` to change the product names, prices, comparison criteria, email address, methodology date, SEO copy, and FAQ content. Keep product IDs aligned with each feature’s `values` and `winner` fields.

### Branding and styles

Edit `src/styles/global.css`. Colors, type stacks, spacing, borders, layout rules, and responsive breakpoints are centralized there as custom properties and media queries.

### Images

This report-style design intentionally uses no photography or local image assets. If imagery is added, store it in `src/assets/images/`, import it from the owning Astro component, and provide meaningful alternative text.

### Routes and features

`src/pages/index.astro` owns the home route and composes all major sections. Reusable sections live in `src/components/`; structured metadata is assembled in `src/pages/index.astro` from the committed content file.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist`.

## Screenshots

- Thumbnail: `preview/compare-thumbnail.png`
- Full page: `preview/compare-homepage.png`
