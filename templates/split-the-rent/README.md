# Split the Rent

A rent-split calculator for flatmates with unequal rooms — fair shares by size, window and en-suite, with the maths visible and a shareable link.

## Overview

Split the Rent settles the classic flat-share argument: the loft with the en-suite should not cost the same as the box room with no window. You type the total monthly rent and describe each room (name, size in m², window quality, en-suite or not), and the app splits the rent proportionally to a weighted score per room.

The whole working-out is printed on a "fairness receipt": each room's base share from floor area, the window and en-suite multipliers, the weighted share, and the rounding step. Shares are rounded with the largest-remainder method, so they always add up to the rent to the penny.

Everything updates live as you type, and the entire scenario is encoded into the URL — press "Copy share link" and anyone who opens the link sees exactly the same split. There is no backend and nothing is stored anywhere.

## Features

- Total rent input plus 2–6 editable room cards (name, size in m², window quality picker, en-suite toggle) with add/remove controls.
- Weighted fair-split algorithm: size × window multiplier × en-suite multiplier, with all weights tunable in one constants file.
- Step-by-step "fairness receipt" per room: base share from size %, window adjustment, en-suite adjustment, weighted share, rounding delta, and final amount.
- Largest-remainder rounding so per-room amounts always sum exactly to the rent, with the guarantee explained on the receipt.
- Full URL state: rent and rooms encode into the query string (updated via `replaceState` while typing) and restore on load; invalid parameters fall back to the demo scenario.
- "Copy share link" button with copied confirmation and a clipboard-unavailable fallback.
- Three how-it-works Q&As explaining the weighting, the rounding, and sharing.
- Accessible form controls: fieldsets with legends, labelled inputs, keyboard-operable radio chips, and visible focus states.

## Tech stack

- **Language:** TypeScript
- **Framework:** React 19
- **Build tool:** Vite
- **Styling:** Hand-written CSS (design tokens, section styles, responsive rules)

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
split-the-rent/
├── index.html
├── preview/
├── src/
│   ├── components/
│   │   ├── BreakdownPanel.tsx
│   │   ├── FaqSection.tsx
│   │   ├── RentInput.tsx
│   │   ├── RoomCard.tsx
│   │   └── ShareBar.tsx
│   ├── constants/
│   │   ├── copy.ts
│   │   ├── seed.ts
│   │   └── weights.ts
│   ├── icons/
│   │   ├── HouseDoodle.tsx
│   │   ├── KeysDoodle.tsx
│   │   └── PlantDoodle.tsx
│   ├── lib/
│   │   ├── format.ts
│   │   ├── split.ts
│   │   └── urlState.ts
│   ├── styles/
│   │   ├── foundation.css
│   │   ├── responsive.css
│   │   └── sections.css
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── eslint.config.js
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Personalizing

### Content and business data

- `src/constants/copy.ts` — every label, heading, hint, Q&A, and footer line, plus the currency locale and code (change `GBP`/`en-GB` here to switch currency).
- `src/constants/seed.ts` — the demo scenario shown on first load and the defaults for newly added rooms.
- `src/constants/weights.ts` — the fairness maths: window multipliers, the en-suite multiplier, window labels, and the 2–6 room limits.

### Branding and styles

- `src/styles/foundation.css` — colour palette, card border/shadow language, fonts, and spacing tokens (all CSS custom properties).
- `src/styles/sections.css` — per-section styles from hero to footer.
- `src/styles/responsive.css` — breakpoints at 960px, 640px, and 360px.
- `index.html` — the Google Fonts link for Bricolage Grotesque and the inline SVG favicon.

### Images

There are no raster images. The doodle illustrations are original inline SVG components in `src/icons/` (`HouseDoodle.tsx`, `KeysDoodle.tsx`, `PlantDoodle.tsx`); edit or replace them there. They render at 48–64px, so keep replacements on a square 64×64 viewBox.

### Routes and features

This is a single-page app with no router — `src/App.tsx` composes all sections and owns the scenario state. The split algorithm lives in `src/lib/split.ts`, URL encoding/decoding in `src/lib/urlState.ts`, and money/percent formatting in `src/lib/format.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/split-the-rent-thumbnail.png`
- Full page: `preview/split-the-rent-homepage.png`
