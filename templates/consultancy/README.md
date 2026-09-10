# Consultancy

A one-page Nuxt site for an independent strategy consultant or leadership coach.

## Overview

Consultancy gives an independent advisor a distinctive home for explaining the change they create, answering common buying questions and inviting a useful first conversation. It is designed for solo consultants and coaches whose work spans strategy, alignment and leadership.

The page moves from a clear positioning statement through three outcome-led services, a practical working philosophy, four buying-blocker FAQs and a direct call to book. Booking uses the configured URL when one exists and falls back honestly to a pre-addressed email when it does not.

## Features

- Three outcome-led service statements presented as annotated working notes
- Configurable booking link with a no-backend `mailto:` fallback
- Four accessible native FAQ accordions
- `FAQPage` structured data generated from the same FAQ content
- Responsive editorial layout for desktop, tablet, 390px and 320px screens
- Server-rendered Nuxt production build under `.output`

## Tech stack

- **Language:** TypeScript
- **Framework:** Nuxt 4 with Vue 3
- **Build tool:** Nuxt / Nitro (SSR)
- **Styling:** Custom responsive CSS with centralized design tokens
- **Linting:** ESLint flat config with `@nuxt/eslint`

## Getting started

### Prerequisites

- Node.js 22.19–22.x, 24.11–24.x, or 26 or newer
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
- `npm run generate` — type-check and generate the static production site
- `npm run build` — alias for the static generate command
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
app/
├── assets/css/main.css
├── components/
│   ├── FaqList.vue
│   ├── OutcomeNote.vue
│   ├── ProcessDiagram.vue
│   └── SiteHeader.vue
├── data/site.json
├── pages/index.vue
├── types/site.ts
├── utils/contact.ts
└── app.vue
public/
└── favicon.svg
eslint.config.mjs
nuxt.config.ts
package.json
tsconfig.json
```

## Personalizing

### Content and business data

Edit `app/data/site.json` for all visible copy, services, FAQs, contact details, navigation, availability and business metadata. Set `bookingUrl` to a full booking URL; leave it blank to use the email fallback built from `email`.

### Branding and styles

Edit `app/assets/css/main.css`. Colors and typefaces are at the top in `:root`; section layout, spacing and responsive rules follow in the same file.

### Images

This visual direction uses CSS and hand-drawn inline SVG diagrams instead of photography. Put any future local images in `app/assets/images/`, import them from the owning component and prefer landscape crops of at least 1600px wide.

### Routes and features

`app/pages/index.vue` composes the home route and its structured data. Reusable page sections live in `app/components/`. Navigation anchors and feature content are configured in `app/data/site.json`; booking URL selection lives in `app/utils/contact.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` writes a Nuxt SSR app to `.output`. `npm run preview` runs the Nitro server at `.output/server/index.mjs`. This is a server-rendered app, not a static export.

## Screenshots

- Thumbnail: `preview/consultancy-thumbnail.png`
- Full page: `preview/consultancy-homepage.png`
