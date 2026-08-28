# Console

An admin and analytics console shell for a fictional webhook delivery platform, fully populated from committed mock data — so it demos with realistic numbers before any backend exists.

## Overview

Console is the dashboard of "Windrose", an invented event delivery platform, as seen by a team at the fictional customer "Atlas Labs". The overview leads with four stat cards (events delivered, success rate, median latency, active endpoints), an area chart and a bar chart drawn as inline SVG from the same committed time series, and a recent-activity feed. Every headline total is computed at build time from the series the charts draw, so the numbers always agree with each other.

The Events page is a real data table of the ten most recent deliveries with status chips, sortable client-side by six columns. Settings is an honest read-only stub: workspace, profile, and API fields rendered from mock JSON with a clear note that the template ships without a backend, plus a template FAQ with `FAQPage` JSON-LD.

There is no database, no auth, and no API layer — and the copy never pretends otherwise. Builds are deterministic: nothing is randomized at runtime, and every value on screen traces to a JSON file in `mocks/`.

## Features

- Overview dashboard with four derived stat cards (value, signed delta vs the previous 14 days, and a 14-point sparkline), all computed from `mocks/timeseries.json` and `mocks/metrics.json`
- Two interactive inline-SVG charts — an area chart of daily deliveries and a bar chart of daily failures — with a snapping crosshair or bar highlight, tooltips, arrow-key inspection, a live region for screen readers, and a "View as table" fallback under each chart
- Sortable deliveries table (`/events/`) with `aria-sort` column headers as real buttons, status chips (delivered / retrying / failed), latency and attempt counts, and a mobile card layout with its own sort controls
- Read-only settings page (`/settings/`) rendering workspace, profile, and API placeholder fields from `mocks/org.json`, with an honest "no backend" notice
- Template FAQ rendered from config with matching `FAQPage` JSON-LD structured data
- Shared console shell — sidebar navigation with active states, sticky topbar with a "Demo data" badge, and a keyboard-accessible mobile drawer — persistent across all three statically exported routes
- Internally consistent mock story: the Aug 21 failure spike in the chart matches the paused-endpoint alert in the activity feed, and stat-card totals equal the sums of the plotted series

## Tech stack

- **Language:** TypeScript
- **Framework:** Next.js (App Router, React, static export)
- **Build tool:** Next.js
- **Styling:** Plain CSS — design tokens in `app/globals.css` plus CSS Modules per component
- **Data:** Committed JSON in `mocks/` and `config/site.json`, loaded through typed modules in `lib/`
- **Linting:** ESLint

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

Open the local URL printed by Next.js.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
app/
├── events/             # Sortable deliveries table
├── settings/           # Read-only settings stub + template FAQ
├── globals.css         # Design tokens, fonts, reset, shared primitives
├── layout.tsx          # Metadata + console shell
└── page.tsx            # Overview: stat cards, charts, activity feed
components/
├── charts/             # Inline-SVG area + bar charts, sizing hook
└── …                   # Shell, nav, stat card, table, chips, feed, FAQ
config/
└── site.json           # Product name, org labels, page copy, FAQ
lib/                    # Typed loaders, metric derivation, chart math,
                        # table sorting, deterministic formatting
mocks/
├── activity.json       # Recent-activity feed entries
├── metrics.json        # Stat-card labels + endpoint counts
├── org.json            # Workspace, profile, and API placeholder fields
├── rows.json           # The 10 deliveries shown on /events/
└── timeseries.json     # 2 × 14 daily points that drive charts and totals
```

## Personalizing

### Content and business data

All demo numbers live in `mocks/`: edit `mocks/timeseries.json` for the daily series (stat-card totals, deltas, and both charts recompute from it at build time), `mocks/metrics.json` for card labels and endpoint counts, `mocks/rows.json` for the deliveries table, `mocks/activity.json` for the feed, and `mocks/org.json` for every settings field. Product and page copy — brand names, subtitles, notices, the footer line, and the FAQ (which also feeds the JSON-LD) — lives in `config/site.json`. To swap mock data for a real backend, replace the typed loaders in `lib/data.ts`; the expected shapes are defined in `lib/types.ts`.

### Branding and styles

Every color, font, radius, and layout token is a CSS custom property at the top of `app/globals.css`, including the Google Fonts import (Wix Madefor Display, Wix Madefor Text, Roboto Mono), the graphite surface steps, the cyan action accent, the validated chart series color, and the fixed status scale. Component-level styles live in colocated `*.module.css` files.

### Images

The template ships no photography. The compass-rose logo is `IconLogo` in `components/icons.tsx`, the favicon is `app/icon.svg`, and all other graphics (charts, sparklines, icons, avatar initials) are original inline SVG or CSS. Edit those files directly to rebrand.

### Routes and features

`app/page.tsx`, `app/events/page.tsx`, and `app/settings/page.tsx` compose the three screens. Sidebar and drawer navigation is the `NAV_ITEMS` list in `lib/nav.ts`. Chart behavior lives in `components/charts/`, table sorting in `lib/deliveries.ts` + `components/EventsTable.tsx`, and stat-card derivation in `lib/metrics.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `out/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/console-thumbnail.png`
- Full page: `preview/console-homepage.png`
