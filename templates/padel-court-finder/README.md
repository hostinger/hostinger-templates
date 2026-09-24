# Padel Court Finder

A multi-page padel club directory that helps players find, compare, and contact courts across one city.

## Overview

Padel Court Finder is a starter site for a local padel directory, a city sports
portal, or a club group with several venues. The sample content covers
"Bandeja", a guide to nine fictional clubs in the fictional coastal city of
Portmar.

Visitors pick a starting area, search by club, area, or street, and narrow the
list by indoor, covered, or outdoor courts, off-peak price, facilities, and
whether a club is open now. Each result links to a club page with courts, hours,
prices per player, facilities, and nearby alternatives. Booking always goes
through the club by phone or a pre-filled email; the site never claims live
availability or takes payments.

A Padel 101 page explains the court, scoring, and what to bring for newcomers.
A "List your club" form lets venue owners send their details to the directory
by email.

## Features

- Court finder with search, starting-area distance sorting, setting,
  price, facility, and "open now" filters
- Filter state mirrored in the URL (`?q=`, `near=`, `setting=`, `amenities=`,
  and more) so a filtered list can be shared or bookmarked
- Schematic SVG city map whose numbered pins stay in sync with the results list
- Nine direct-load club routes at `/clubs/:id` with hours (today highlighted),
  peak and off-peak pricing per court and per player, courts, facilities, and
  nearby clubs
- "Call" and "Email" booking actions using `tel:` and pre-filled `mailto:` links
- `/guide` beginner page covering the court, rules, levels, kit, and an FAQ
- `/list-your-club` form with inline validation, an error summary, and an
  email handoff
- Accessible markup: skip link, labelled landmarks, keyboard-friendly filters,
  visible focus, and reduced-motion support
- Layouts tested on desktop, tablet, 390px, and 320px screens

## Tech stack

- **Language:** TypeScript
- **Framework:** React with React Router
- **Build tool:** Vite
- **Styling:** Responsive plain CSS with custom properties
- **Fonts:** Bricolage Grotesque and IBM Plex Mono, self-hosted with Fontsource

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
public/
└── favicon.svg          # Padel ball favicon
src/
├── components/          # Header, hero, filters, map, club card, tables, form field
├── constants/           # Typed content exports and route helpers
├── data/                # Editable site, club, neighbourhood, and filter JSON
├── hooks/               # Document title and live clock hooks
├── icons/               # Inline SVG icon set
├── pages/               # Home finder, club, guide, list-your-club, and 404 pages
├── styles/              # Foundation, component, page, and responsive CSS
├── types/               # Shared content shapes
├── utils/               # Finder filtering, distance, hours, pricing, and contact helpers
├── App.tsx              # Route composition
└── main.tsx             # React entry point
```

## Personalizing

### Content and business data

- `src/data/site.json` — brand name, city, locale and currency, contact
  details, navigation, hero, finder copy, booking notes, guide page, listing
  form copy, and footer.
- `src/data/clubs.json` — one entry per club: `id` (used in the URL), name,
  neighbourhood, address, map `location`, setting, courts, court type,
  `prices` (`offPeak` and `peak` per court), `hours` (weekdays, Saturday,
  Sunday, `HH:MM`), amenities, phone, email, summary, description, and
  `goodFor` tags.
- `src/data/neighbourhoods.json` — the starting areas in the "Starting from"
  menu and their map coordinates.
- `src/data/filters.json` — setting and facility labels, sort options, and the
  price steps.

Change `currency` and `locale` in `site.json` to format prices for another
market. `pricing.playersPerCourt` controls the per-player split.

### Branding and styles

- `src/styles/foundation.css` — design tokens (colours such as `--ink`,
  `--court`, `--turf`, `--clay`, `--ball`), fonts, radii, spacing, buttons,
  header, footer, and form controls.
- `src/styles/components.css` — hero, finder, club cards, and map.
- `src/styles/pages.css` — club, guide, listing, and 404 pages.
- `src/styles/responsive.css` — breakpoints at 1180, 960, 820, 760, and 520px.
- Fonts are imported in `src/main.tsx`; the page title and meta description are
  in `index.html`.

### Images

The template ships no photos. All artwork is original inline SVG: the court
diagrams in `src/components/CourtDiagram.tsx`, the city map in
`src/components/CityMap.tsx`, icons in `src/icons/index.tsx`, and
`public/favicon.svg`. The map uses a 100 × 70 unit coordinate space; place
clubs and neighbourhoods with `x`/`y` values in that range (one unit is about
100 m for distance estimates, set in `src/utils/distance.ts`). To redraw the
map for your own city, edit the roads, water, and park shapes in `CityMap.tsx`.

### Routes and features

Routes are declared in `src/App.tsx`, and paths live in
`src/constants/routes.ts`. Filtering, sorting, and URL (de)serialisation live
in `src/utils/finder.ts`; opening-hours logic lives in `src/utils/hours.ts`;
booking and listing email links are built in `src/utils/contact.ts` and
`src/utils/listing.ts`.

The production build writes a standalone `index.html` into `dist/guide/`,
`dist/list-your-club/`, and every `dist/clubs/:id/` directory, generated from
the IDs in `src/data/clubs.json`. Deploy the complete `dist/` directory and
clean URLs work on static hosts that serve directory indexes; no SPA fallback
is required. Hosts that do not serve directory indexes must rewrite unknown
routes to the root `index.html`. Always rebuild after adding or renaming a club
ID.

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

- Thumbnail: `preview/padel-court-finder-thumbnail.png`
- WebP variants: `preview/padel-court-finder-thumbnail-480.webp`,
  `preview/padel-court-finder-thumbnail-960.webp`
