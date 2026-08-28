# Will It Survive?

A plant shop quiz that turns three honest questions about your flat — light, watering habits, pets — into the short list of plants that will actually live there.

## Overview

Will It Survive? is a single-page site for a small plant shop that would rather sell you one plant that lives than three that die. The page opens straight into the quiz: how bright the spot is, what your watering track record honestly looks like, and whether anything in the house nibbles leaves. Every answer updates the page address, so results are shareable links.

Matching runs on the same care tags printed on every plant card. A complete set of answers returns two to four "survivors" with plain-spoken reasoning ("Genuinely copes with low light", "Forgives missed waterings"). Combinations nothing on the bench fully fits never dead-end: the nearest plants appear as flagged "close calls" with the catch spelled out, and pet owners are never shown a plant that isn't pet-safe — not even as a fallback.

Below the quiz sits the whole bench — eight plants with original illustrations, prices, personality lines, and honest tag chips — plus an FAQ and visit details. Every "Reserve one" button is a pre-filled email built from the shop address shown on the page; the copy is explicit that results are guidance from care tags, not a live stock check.

## Features

- Three-question quiz built from real fieldsets and radio inputs with big friendly icon cards, fully keyboard operable with visible focus states
- Shareable URL state: answers encode into `?light=low&care=forgetful&pets=yes`, valid parameters restore selections and results on load, and the URL stays synchronized as answers change (plus a copy-link button)
- Honest matching: 2–4 survivors with tag-derived reasoning lines; zero-match combinations fall back to nearest matches flagged "Close call" with per-plant caveats and a straight-talk note
- Pet-safety guarantee: with pets in the house, non-pet-safe plants are excluded from results entirely, including fallbacks
- Eight-plant tagged catalogue — light, watering, and pet-safety chips on every card, including an unvarnished "Keep from pets" flag
- "Reserve one" mailto links pre-filled with the plant and botanical name, built from the displayed shop email
- Eight original SVG potted-plant illustrations in one consistent style, with a fallback sprout drawing for plants you add yourself
- Five-question FAQ rendered from JSON with matching `FAQPage` JSON-LD structured data
- Responsive from 1440px down to 320px with no horizontal overflow, and reduced-motion support

## Tech stack

- **Language:** TypeScript (vanilla, no UI framework)
- **Framework:** None — small typed modules and template rendering
- **Build tool:** Parcel 2
- **Styling:** Hand-written CSS with centralized design tokens
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

Open the local URL printed by Parcel.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
index.html
favicon.svg
src/
├── components/
├── data/
├── icons/
├── illustrations/
├── styles/
├── types/
├── utils/
├── content.ts
└── main.ts
```

`index.html` holds the section shells; `src/main.ts` composes the page from renderers in `src/components/`. All editable copy lives in committed JSON files in `src/data/`, typed by `src/types/content.ts` and loaded through `src/content.ts`. Quiz matching, reasoning, URL state, and the mailto builder are small pure functions in `src/utils/`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the shop name, city, tagline, email, address, currency symbol, opening hours, navigation, social links, every section's headings and notes, the reserve-email subject/body templates (`{plant}`, `{botanical}`, and `{shop}` placeholders), and the FAQ entries. Edit `src/data/plants.json` for the plants — each entry holds `id`, `name`, `botanical`, `price`, `light` (any of `low`/`medium`/`bright`), `water` (any of `forgetful`/`regular`/`attentive`), `petSafe`, and a one-line `personality`. Edit `src/data/quiz.json` for question wording, answer-card labels and icons, the reasoning and caveat lines, and the catalogue tag labels. Result-count rules (`MIN_EXACT_MATCHES`, `FALLBACK_TOTAL`, `MAX_MATCHES`) are constants in `src/utils/matching.ts`.

### Branding and styles

Edit `src/styles/base.css` — all color tokens, font variables, radii, shadows, buttons, and chips sit at the top. Section layouts live in `src/styles/sections.css`, breakpoints in `src/styles/responsive.css`, and the Google Fonts import (Fredoka and Atkinson Hyperlegible) on the first line of `src/styles/main.css`.

### Images

There are no photographs — artwork is inline SVG. The eight potted-plant illustrations live in `src/illustrations/plants.ts`, keyed by plant `id` (a plant id without a drawing gets the fallback sprout, so new plants work immediately). Quiz answer icons live in `src/icons/icons.ts`, keyed by the `icon` names used in `src/data/quiz.json`. The favicon is `favicon.svg` at the project root.

### Routes and features

This is a single static route. Section order comes from the shells in `index.html`; `src/main.ts` mounts each renderer from `src/components/` (header, quiz, results, catalogue, faq, visit, footer) and wires answer changes to `src/utils/urlState.ts` and `src/utils/matching.ts`. The URL parameter names are defined in `src/utils/urlState.ts`.

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

- Thumbnail: `preview/will-it-survive-thumbnail.png`
- Full page: `preview/will-it-survive-homepage.png`
