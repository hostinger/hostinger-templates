# The Rooms

A static coastal guesthouse website with three room guides, seasonal rate comparison, and honest date-led enquiries.

## Overview

The Rooms is a complete website for an independent B&B, guesthouse, or small coastal inn. It gives prospective guests a clear sense of the house and its setting while keeping practical details—beds, access notes, room size, outlook, and rates—easy to compare.

Guests can browse all three rooms, open direct room-detail routes, compare seasonal prices, and choose arrival and departure dates. Dates remain in the URL and are passed to a configured booking service; when no service is configured, the same journey creates a pre-filled email enquiry without implying live availability.

## Features

- Browse three data-driven rooms and open a static detail route for each one.
- Compare room characteristics and seasonal nightly prices in an accessible table.
- Validate arrival and departure dates, restore them from the URL, and keep URL state in sync.
- Pass selected dates and room name to a configured booking URL or use an honest `mailto:` fallback.
- Read five expandable house FAQs backed by `FAQPage` JSON-LD.
- Use direct-loaded static routes at `/rooms/lookout`, `/rooms/boat-house`, and `/rooms/salt-store`.
- Navigate responsive layouts designed for desktop, `390px`, and `320px` viewports.

## Tech stack

- **Language:** TypeScript
- **Framework:** Nuxt 3 and Vue 3
- **Build tool:** Nuxt static generation with Vite
- **Styling:** Shared CSS with custom properties and scoped component structure
- **Content:** Committed JSON and typed TypeScript configuration
- **Fonts:** Local `@fontsource-variable` packages

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
assets/
├── images/
└── styles/main.css
components/
├── DatePlanner.vue
├── FaqList.vue
├── RoomCard.vue
├── RoomComparison.vue
├── SiteFooter.vue
├── SiteHeader.vue
└── TideRule.vue
data/
├── faqs.ts
├── rates.json
├── rooms.json
└── site.ts
pages/
├── index.vue
└── rooms/[slug].vue
public/
└── favicon.svg
types/
└── index.ts
utils/
└── booking.ts
app.vue
eslint.config.mjs
nuxt.config.ts
package.json
tsconfig.json
```

## Personalizing

### Content and business data

Edit `data/site.ts` for the guesthouse name, location, contact details, address, booking URL, check-in times, hero copy, and field notes. Edit `data/rooms.json` for room copy and facilities, `data/rates.json` for seasons and prices, and `data/faqs.ts` for FAQ content.

Set `bookingUrl` in `data/site.ts` to your booking engine. Its URL receives `arrival`, `departure`, and optional `room` query parameters. Leave it empty to keep the pre-filled email enquiry fallback.

### Branding and styles

Edit `assets/styles/main.css` for the sea-glass, chalk, rust, and navy palette, local font families, spacing, layout sizes, tide-line details, and responsive breakpoints. Component markup is organized in `components/`, with page-specific composition in `pages/`.

### Images

Local photos live in `assets/images/` and are imported through `utils/images.ts` or directly by `pages/index.vue`. Keep panoramic hero images near a `16:9` ratio and room images near `4:3`; update each room's useful alt text in `data/rooms.json`.

Photography was downloaded from Pexels and stored locally:

- Coast hero: https://www.pexels.com/photo/body-of-water-near-green-mountain-1001682/
- Coast path: https://www.pexels.com/photo/sea-dawn-landscape-nature-189349/
- The Lookout: https://www.pexels.com/photo/white-bed-linen-on-bed-164595/
- The Boat House: https://www.pexels.com/photo/white-bed-near-brown-wooden-nightstand-271624/
- The Salt Store: https://www.pexels.com/photo/bedroom-interior-with-bed-and-nightstands-6585759/

### Routes and features

`pages/index.vue` composes the home page. `pages/rooms/[slug].vue` builds room pages from `data/rooms.json`; matching routes are explicitly prerendered in `nuxt.config.ts`. `components/DatePlanner.vue` owns date input and URL synchronization, while `utils/booking.ts` contains validation and destination-link rules.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `.output/public`.

## Screenshots

- Thumbnail: `preview/the-rooms-thumbnail.png`
- Full page: `preview/the-rooms-homepage.png`
