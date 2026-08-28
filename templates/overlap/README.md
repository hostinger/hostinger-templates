# Overlap

A static timezone overlap planner for finding and sharing hours that work across cities.

## Overview

Overlap helps distributed teams, remote collaborators, and long-distance friends compare local time across a shared 24-hour day. Start with London, New York, and Tokyo, then search the typed city catalog to build the lineup you need.

Choose common working hours and the board highlights every hour when all selected cities are inside that window. The complete setup stays in the URL, so a copied link recreates the same cities and hours for another visitor.

## Features

- Search an accessible, keyboard-friendly catalog of 22 cities and remove cities from the board.
- Compare aligned 24-hour strips with local-hour labels, UTC offsets, daypart colors, and a current-time marker.
- Adjust one shared working-hours window and see exact overlap ranges or the closest available hour.
- Restore and update cities and working hours through URL query parameters.
- Copy a shareable setup link without accounts, tracking, a backend, or external timezone services.
- Read three concise answers explaining city controls, overlap highlighting, and sharing.
- Use a responsive layout designed for desktop and narrow mobile screens.

## Tech stack

- **Language:** TypeScript
- **Framework:** Nuxt 3 and Vue 3
- **Build tool:** Nuxt static generation with Vite
- **Styling:** Scoped Vue CSS and shared CSS custom properties
- **Timezone data:** Native `Intl.DateTimeFormat`
- **Font:** Local `@fontsource-variable/outfit` package

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
assets/
└── styles/main.css
components/
├── CityPicker.vue
├── CityStrip.vue
├── HowTo.vue
├── OverlapBoard.vue
├── OverlapLegend.vue
├── ShareBar.vue
└── WorkingHoursControl.vue
composables/
├── useOverlap.ts
└── useUrlCities.ts
constants/
├── cities.ts
├── copy.ts
└── palette.ts
types/
└── index.ts
utils/
└── time.ts
app.vue
eslint.config.mjs
nuxt.config.ts
package.json
tsconfig.json
```

## Personalizing

### Content and business data

Edit `constants/copy.ts` for all interface text and the three Q&As. Edit `constants/cities.ts` for city names, countries, IANA timezone identifiers, default cities, and default working hours.

### Branding and styles

Edit `assets/styles/main.css` for global colors, typography, spacing, layout sizes, responsive foundations, and shared controls. Component-specific layouts live in each file under `components/`. Edit `constants/palette.ts` to change the 24 hourly strip colors and legend swatches.

### Images

The interface does not use content images. Local preview captures live in `preview/`; if imagery is added later, place it under `assets/images/` and import it from the component that renders it.

### Routes and features

`app.vue` composes the single-page experience. `composables/useUrlCities.ts` controls URL state and city selection, `composables/useOverlap.ts` computes strip and overlap data, and `utils/time.ts` contains native `Intl` time helpers. Major controls and board sections live under `components/`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `.output/public`.

## Screenshots

- Thumbnail: `preview/overlap-thumbnail.png`
- Full page: `preview/overlap-homepage.png`
