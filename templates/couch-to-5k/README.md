# Couch to 5K

A nine-week couch-to-5K training plan the visitor ticks off session by session, with progress saved in their own browser — no account, no backend.

## Overview

Couch to 5K is a single-page site for a running coach who wants beginners to actually follow a plan instead of losing a PDF. The whole nine-week walk-run progression lives on one page: twenty-seven sessions, each with a title, interval instructions, and an approximate time, grouped into anchored week sections connected by a milestone rail.

Visitors tick sessions off on their own phone. Ticks are stored in `localStorage` on the device — nothing is uploaded and there is no sign-up — and survive reloads and revisits. A sticky header shows week chips 1–9 with done/in-progress states, a live "12 of 27 sessions done" counter, and a progress bar; the hero's SVG trail map fills in coral from START toward the 5K flag as weeks are completed in order.

Everything routes toward training with the coach: a "Train with me" mailto action in the header, hero, and coach section, a click-to-call phone link, the Saturday group-run details, and a five-question FAQ.

## Features

- Full nine-week plan as anchored sections (`#week-1` … `#week-9`) with 27 tickable session cards — title, interval instructions, and an approximate duration chip
- On-device progress: ticks persist in `localStorage` across reloads; the storage key holds plain session ids and invalid stored data is ignored safely
- Live progress everywhere: per-week "2 of 3 done" counters with segment bars, an `aria-live` overall counter, a sticky header progress strip, and week chips that fill as weeks complete
- Original SVG trail map from START to a 5K finish flag: milestones deep-link to their weeks, completed weeks fill coral, the current week pulses, and the trail line advances as weeks are finished in order
- Reset-progress control with an explicit confirm step ("Yes, reset" / "Keep my progress") and a polite status announcement
- Works without JavaScript: the page is fully prerendered, native checkboxes still tick with CSS done-styling (they just don't persist), and the FAQ uses `details`/`summary`
- "Train with me" `mailto:` and `tel:` actions built from the same contact details shown on screen — no forms, no fake backend
- Five-question FAQ with `FAQPage` JSON-LD structured data in the head
- Semantic, keyboard-accessible controls with visible focus states, reduced-motion support, and responsive layouts down to 320px with no horizontal overflow

## Tech stack

- **Language:** TypeScript
- **Framework:** SvelteKit (Svelte 5) with `@sveltejs/adapter-static` — fully prerendered
- **Build tool:** Vite
- **Styling:** Hand-written CSS — design tokens in a global stylesheet plus scoped component styles
- **Linting:** ESLint (`eslint-plugin-svelte`, `typescript-eslint`)

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

Open the local URL printed by Vite.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── lib/
│   ├── assets/             # favicon.svg
│   ├── components/         # header, hero, route map, plan, sessions, reset, coach, FAQ, footer
│   ├── data/               # site.json + plan.json — all editable copy
│   ├── styles/             # global.css — design tokens and base styles
│   ├── format.ts           # centralized progress and duration wording
│   ├── plan.ts             # typed plan access, session ids, totals
│   ├── progress.svelte.ts  # localStorage-backed progress store
│   ├── site.ts             # typed site content and the mailto builder
│   └── types.ts            # shared content types
├── routes/
│   ├── +layout.svelte
│   ├── +layout.ts          # prerender = true
│   └── +page.svelte        # composes the page sections
static/
└── images/                 # coach photo
```

## Personalizing

### Content and business data

Edit `src/lib/data/site.json` for the coach and club names, credential, tagline, hero copy, privacy note, plan intro, email, email subject, phone, location, group-run line, bio paragraphs, social links, and the FAQ entries. Edit `src/lib/data/plan.json` for the nine weeks — each week holds `week`, `title`, a short `focus` chip, a `coachNote`, and three sessions with `title`, `workout`, and `minutes`; the warm-up sentence lives in `sessionFrame`. Session ids (`w1s1` …) derive from position via `src/lib/plan.ts`, so reordering weeks or sessions changes ids and effectively resets saved ticks; the `localStorage` key name lives in `src/lib/progress.svelte.ts`. Progress wording ("12 of 27 sessions done") is centralized in `src/lib/format.ts`.

### Branding and styles

Edit `src/lib/styles/global.css` — the coral/navy/off-white color tokens, the Sora Google Fonts import, radii, shadows, buttons, and shared utilities sit at the top. Section-specific rules live in each component's scoped `<style>` block in `src/lib/components/`. The trail-map geometry (start, nine milestones, finish) is the `ROUTE_POINTS` array in `src/lib/components/RouteMap.svelte`.

### Images

Local images live in `static/images/`. The coach photo is referenced in `src/lib/components/CoachSection.svelte`; replace `static/images/coach-stretching.jpg` with a landscape photo around 1600 px wide and update the `alt`, `width`, and `height` attributes. The favicon is `src/lib/assets/favicon.svg`. The current photo was sourced from Pexels contributor Andrea Piacquadio.

### Routes and features

This is a single prerendered route: `src/routes/+page.svelte` composes `SiteHeader`, `Hero` (with `RouteMap`), `PlanSection` (with `WeekBlock`, `SessionCard`, `ResetProgress`), `CoachSection`, `FaqSection`, and `SiteFooter` from `src/lib/components/`. Week anchors, header chips, and map milestones are all generated from `plan.json`, so adding or removing a week updates every view automatically. Prerendering is switched on in `src/routes/+layout.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `build/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/couch-to-5k-thumbnail.png`
- Full page: `preview/couch-to-5k-homepage.png`
