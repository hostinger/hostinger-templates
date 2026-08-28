# Careers

A careers board where every role page says what you'd actually do — with combinable team, location, and remote filters, live counts, and applications over prefilled email.

## Overview

Careers is a hiring page for a small team that wants candidates to know what the job really is. The board lists every open role as a big friendly card with a colored team tag, the work setup (fully remote, hybrid, or on-site), the location, and a real salary range in mono type. Three filter groups — team, location, and work setup — are plain checkboxes that combine instantly on the client, every option shows a live count of matching roles, and when nothing matches the empty state says so honestly instead of pretending more roles are hiding somewhere.

Each role links to its own prerendered page at `/roles/<slug>` that leads with "What you'd actually do" — four to six plain-language bullets — followed by "What you won't be doing" and the exact hiring steps for that role, including what the paid exercises pay. The apply button is a `mailto:` built from the same address displayed on the page, prefilled with the role title, so applications go straight to a human inbox with no fake applicant-tracking system in between.

The whole site ships as static HTML: React Router runs in framework mode with `ssr: false` and every route prerendered, so the board and all four role pages direct-load from any static file host and the role content is readable before JavaScript runs.

## Features

- Filterable board: team, location, and work-setup checkboxes that combine (OR within a group, AND across groups) with instant client-side results
- Live counts everywhere — the results line ("Showing 2 of 4 open roles") and a faceted count on every filter chip update as other filters change
- Honest empty state when no roles match, with one-click "Clear all filters" and an "Email us anyway" mailto
- One prerendered page per role at `/roles/<slug>` that leads with plain-language "What you'd actually do" bullets, then "What you won't be doing" and per-role hiring steps
- Apply and question CTAs are `mailto:` links built from the email displayed on the page, prefilled with the role title (e.g. "Application — Product Designer")
- Per-team chip hues declared in the data file (six accessible presets), plus an original SVG "team of shapes" illustration and a per-team shape figure on each role page
- Five-question hiring FAQ rendered from JSON with `FAQPage` JSON-LD structured data
- Fully static output (`ssr: false` + prerendered routes) servable from any static host; role content is present in the HTML without JavaScript
- Semantic fieldsets and real checkboxes, keyboard-accessible filters, visible focus rings, a skip link, reduced-motion fallbacks, and layouts verified down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** React 19 with React Router 8 (framework mode, `ssr: false` + prerendered routes)
- **Build tool:** Vite (via `@react-router/dev`)
- **Styling:** Plain hand-written CSS with centralized design tokens
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
├── data/
├── icons/
├── routes/
├── styles/
├── types/
├── utils/
├── root.tsx
└── routes.ts
public/
└── favicon.svg
```

`src/routes.ts` maps `/` to `src/routes/board.tsx` (hero, filterable board, FAQ) and `/roles/:slug` to `src/routes/role.tsx`. Editable content lives in committed JSON files in `src/data/`, typed and validated by `src/types/content.ts` and `src/utils/content.ts`; the pure filter logic and the mailto builders live in `src/utils/`. `react-router.config.ts` points the app directory at `src/`, disables SSR, and generates the prerender list (the board plus one path per role) from `roles.json`.

## Personalizing

### Content and business data

Edit `src/data/roles.json` for the board itself: `teams` (each team's `name` and chip `hue` — one of `periwinkle`, `teal`, `coral`, `magenta`, `sky`, `slate`) and `roles`. Each role holds `slug` (becomes the `/roles/<slug>` URL), `title`, `team`, `location`, `remotePolicy` (`"remote"`, `"hybrid"`, or `"on-site"` — anything else fails the build with a clear error), `salaryRange` (a display string, or `null` to hide it), `oneLiner`, `whatYoudDo` (4–6 plain bullets), `whatYouWont` (2–3 bullets), and `howWeHire` steps (`title` + `detail`). Filter options, chip counts, and the prerender list are all derived from this file — adding a role is one JSON entry plus a rebuild.

Edit `src/data/site.json` for everything else: company name, product line, values line, contact `email` (every mailto on the site is built from it), city, nav labels, hero copy, the four facts, board labels and empty-state copy, the human-readable work-setup labels, all role-page copy (section titles, apply note, about blurb, bottom CTA), the FAQ list, footer links, and the footer note.

### Branding and styles

Edit `src/styles/global.css`. The Google Fonts `@import` (Gabarito) and every design token — colors (periwinkle primary, coral accent, the six chip hues), the system-mono stack used for salaries and counts, shell width, shadows — sit at the top of the file. Section styles follow in page order (header, hero, board, FAQ, role page, footer) with responsive rules at the bottom.

### Images

There is no photography — all artwork is original inline SVG. The hero "team of shapes" illustration is `src/components/ShapeCrew.tsx`, the per-team figure on role pages is `src/components/ShapeBuddy.tsx` (tinted via the `hue` in `roles.json`), the logo mark and arrow icon live in `src/icons/`, and the favicon is `public/favicon.svg`.

### Routes and features

Routes are declared in `src/routes.ts`; the prerender list in `react-router.config.ts` is generated from `roles.json`, so new roles are prerendered automatically. Filtering is pure, typed logic in `src/utils/filters.ts` (selection matching, toggling, faceted counts), the mailto builders are in `src/utils/apply.ts`, and content loading/validation is in `src/utils/content.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `build/`; the deployable static site is `build/client/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/careers-thumbnail.png`
- Full page: `preview/careers-homepage.png`
