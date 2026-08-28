# Movement Library

A physiotherapy exercise library where patients filter movements by body part,
build a small home plan, and print it as a clean take-home card.

## Overview

Movement Library is a single-page site for a physiotherapy practice. It
presents the clinic's ten most-prescribed movements exactly as they are coached
in the treatment room — each with body-part tags, sets and reps or hold times,
short numbered steps, and an honest caution note. No video platform, accounts,
or booking system is required.

Patients filter the library by the body part they are working on, add the
movements from their last session to a plan tray, and print the plan as a
black-and-white patient card with a practice header, the date, a write-in name
line, and Mon–Sun tick boxes. The plan is saved in the browser, so it is still
there when the patient returns — even after losing the paper copy.

The page is honest by design: a visible note explains that the library is
general guidance rather than a personalised prescription, and the contact
actions are plain `tel:` and `mailto:` links built from the displayed practice
details.

## Features

- Body-part filter chips (Neck, Shoulder, Back, Hip, Knee, Ankle) with live
  exercise counts and a "Showing X of 10 movements" status line
- Ten seeded movements, each on a chart-style card with an original SVG
  line-figure illustration, a kinesiology-tape dosage strip, numbered steps,
  and a "Take care" caution
- Add-to-plan and remove controls with `aria-pressed` states; the plan
  persists in `localStorage` across reloads and return visits
- A plan tray that docks to the bottom of the viewport once it has movements,
  with per-item remove, clear, and print actions
- A dedicated print stylesheet: printing hides the app and outputs only the
  patient card — practice name and date header, "Prepared for" write-in line,
  per-movement figures, doses, steps, cautions, and weekly tick boxes, all
  readable in black and white
- FAQ accordion sourced from site data with FAQPage JSON-LD structured data
- Click-to-call and click-to-email actions built from the same contact data
  shown on screen
- Keyboard-accessible controls, visible focus states, and polite live regions
  for filter and plan updates

## Tech stack

- **Language:** TypeScript
- **Framework:** React
- **Build tool:** Vite
- **Styling:** Layered plain CSS with design tokens
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

Open the local URL printed by Vite.

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
├── styles/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

Components contain focused page sections. All patient-facing copy and practice
details live in `src/data/`, plan persistence and formatting helpers live in
`src/utils/`, and the illustrations are React SVG components in `src/icons/`.

## Personalizing

### Content and business data

- `src/data/site.json` — practice name, physiotherapist name, phone, email,
  address, hero copy, the guidance disclaimer, plan-tray and print-card labels,
  and the FAQ entries.
- `src/data/exercises.json` — the movements: name, `figure` (which
  illustration to use), `bodyParts` tags, dosage, steps, and caution note. The
  allowed body parts are defined once in `src/types/content.ts`.
- `index.html` — page `<title>` and meta description.

### Branding and styles

- `src/styles/foundation.css` — color tokens, Google Fonts import, typography,
  and the chart-paper grid texture.
- `src/styles/layout.css` — header, hero, FAQ, and footer sections.
- `src/styles/library.css` — filter chips, exercise cards, plan tray, and
  responsive rules.
- `src/styles/print.css` — the printed patient card.

### Images

This template uses no photography. Each movement is illustrated by an original
SVG line figure in `src/icons/figures.tsx`, keyed by the exercise's `figure`
value (drawn on a `120 × 120` viewBox; unknown keys fall back to a neutral
standing figure). UI icons live in `src/icons/index.tsx`, and the favicon is
`public/favicon.svg`.

### Routes and features

This template uses one page. `src/App.tsx` owns the plan state and composes
the sections in `src/components/`. Plan persistence (the `localStorage` key
and validation) lives in `src/utils/plan.ts`, and the date shown on the
printed card is formatted in `src/utils/format.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/movement-library-thumbnail.png`
- Full page: `preview/movement-library-homepage.png`
