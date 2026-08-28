# Route Library

A running club's route book: filter routes by distance and climb, read an elevation profile for every route, and download the GPX.

## Overview

Route Library is a small server-rendered web app for a running or cycling club that wants its route knowledge out of members' heads and onto a page. The home page opens straight into the book: a filter bar for distance (under 10 km, 10–25 km, over 25 km) and climb (under 300 m, 300–700 m, over 700 m) above a grid of route cards, each carrying a mini elevation sparkline, distance, climb, surface, grade, start point and a GPX download.

Filtering happens on the server through query parameters (`/?distance=short&climb=steep`), so every filtered view is a shareable URL that works without JavaScript; a small enhancement script makes the same filters instant in the browser and keeps the URL in sync. Every route also has its own server-rendered page at `/routes/<slug>` with a full inline SVG elevation profile — hover for exact figures, or open the accessible data table — plus an honest "run at your own judgment" note and a GPX download served with the correct content type.

The demo content is a fictional Lake District fell running club, Bracken Fell Harriers, with five internally consistent routes: profile points, stated distance, stated climb and the GPX trackpoints all agree with each other.

## Features

- Distance and climb filter chips backed by shareable query-parameter URLs (`/?distance=short`), with progressive client-side instant filtering and `history.pushState` URL sync
- Five seeded routes, each with a server-rendered detail page at `/routes/<slug>` that loads directly
- Inline SVG elevation profile on every route page, built from the committed data points: area wash, gridlines, distance/elevation axes, a labelled high-point marker and a hover crosshair with tooltip
- Mini profile sparkline on every route card, drawn from the same data
- GPX download per route, served with `Content-Type: application/gpx+xml` and a `Content-Disposition: attachment` header
- Profile data table behind a disclosure on each route page, so every chart figure is reachable without hover or JavaScript
- Empty state with a mailto fallback when no routes match the chosen filters
- Unknown `/routes/<slug>` URLs get a proper 404 page listing the real routes
- Five-question FAQ rendered from JSON with `FAQPage` JSON-LD in the layout head
- Club section with meet point, club-run times and a mailto contact built from the same displayed data
- Semantic HTML, keyboard-reachable controls, visible focus states and layouts verified down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** Express 5 with server-rendered EJS views
- **Build tool:** tsc (TypeScript compiler); tsx for the dev server
- **Styling:** Plain hand-written CSS with centralized design tokens
- **Linting:** ESLint (flat config with typescript-eslint)

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

Open the local URL printed by the server (defaults to `http://localhost:4361`).

## Available scripts

- `npm run dev` — start the local development server with tsx watch
- `npm run build` — type-check and compile the server to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — run the compiled production server from `dist/`

The server reads the `PORT` environment variable and defaults to `4361`, so `PORT=4361 npm run preview` and `npm run preview` are equivalent.

## Project structure

```text
src/
├── data/          # site.json and routes.json — all editable content
├── types/         # shared content types
├── utils/         # filtering, formatting, SVG chart geometry, JSON-LD
├── views/         # EJS templates and partials
└── server.ts      # Express app: routes, static serving, 404, errors
public/
├── gpx/           # one downloadable GPX file per route
├── images/        # local photos
├── js/            # progressive-enhancement scripts
├── styles/        # main.css with all design tokens
└── favicon.svg
```

This is a Node server app, not a static export. The compiled server in `dist/` resolves views from `src/views/`, content from `src/data/` and static assets from `public/` relative to the project root, so the build needs no copy step — deploy the whole project folder and run `node dist/server.js`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the club name, area, tagline, heading, intro, about text, meet point, club-run times, route librarian contact (the mailto links are built from `librarian.email`), the disclaimer note, navigation and the FAQ list. Edit `src/data/routes.json` for the routes — each entry holds `name`, `slug`, `distanceKm`, `elevationGainM`, `surface`, `difficulty` (`Easy`, `Moderate` or `Hard`), `startPoint`, `description` and a `profile` array of `{ "km", "m" }` points. Keep the first profile point at km 0, the last at `distanceKm`, and the summed uphill differences equal to `elevationGainM`; add a matching GPX file at `public/gpx/<slug>.gpx`. Filter thresholds and labels live in `src/utils/filters.ts`.

### Branding and styles

Edit `public/styles/main.css`. All design tokens — the cream paper palette, burnt-orange accent, the Google Fonts `@import` (Chivo and Spline Sans Mono) and the topographic background pattern — sit in the `:root` block at the top; component and responsive rules follow in the same file. Chart geometry (size, padding, tick steps, the minimum elevation span that stops flat routes looking mountainous) lives in `src/utils/elevation.ts`.

### Images

Local images live in `public/images/`. The club-section photo is referenced in `src/views/index.ejs`; replace `public/images/fell-runners.jpg` with a photo around 1600 px wide (portrait 3:4 shows uncropped on desktop) and update the `alt`, `width` and `height` attributes. The favicon is `public/favicon.svg`. The current photo was sourced from Pexels contributor Alin Serban.

### Routes and features

HTTP routes live in `src/server.ts`: the filterable index (`/`), the route pages (`/routes/:slug`, validated against the route book with a 404 fallback) and the GPX headers set on `express.static`. Page markup lives in `src/views/` (`index.ejs`, `route.ejs`, `not-found.ejs` and `partials/`). The client-side filter and chart-hover enhancements are `public/js/filters.js` and `public/js/profile-hover.js`; both are optional layers over fully working server-rendered pages.

### Environment variables

`PORT` — the port the Express server listens on, defaulting to `4361`. See `.env.example`. The server reads it straight from the environment (`PORT=8080 npm run preview`); no dotenv loader is involved.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`. `npm run preview` runs the compiled Node server (`node dist/server.js`) on port 4361 unless `PORT` is set — this is a server app and must stay running behind your host's Node process manager.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/route-library-thumbnail.png`
- Full page: `preview/route-library-homepage.png`
