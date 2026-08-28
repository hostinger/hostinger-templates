# Registry

A gift list where claiming an item locks it on that device, so two guests don't buy the same thing.

## Overview

Registry is a single-page gift list for weddings, housewarmings, baby showers, or any occasion where guests bring presents. It ships as a fictional wedding registry for "Amelia & Tom": guests browse twelve gifts styled as hanging gift tags, claim the one they want to buy, and the claim is stored in the browser so the same device cannot claim it twice.

The list stays a surprise for the hosts — no names are ever asked for or shown. The page is deliberately honest about how it works: claims live in `localStorage` on the guest's own device, and the copy and FAQ state plainly that there is no account and no live sync between devices. Three gifts ship pre-claimed as seeded examples so the claimed state is visible immediately.

There is no backend and no environment configuration. The production build is a static `dist/` folder that can be hosted anywhere.

## Features

- Twelve gifts across kitchen, home, garden, and experience categories, defined in one committed JSON file.
- "Claim this gift" button per item; claims persist in `localStorage` and survive page reloads.
- Gifts claimed on the current device show a "release it" undo link; seed-claimed gifts always display as claimed.
- Live summary count ("9 of 12 gifts still available") announced via `aria-live`.
- Clear visual distinction between available tags (cream, outlined claim button) and claimed tags (blush wash, dashed border, check stamp).
- Optional per-gift suggestion link (`shopUrl`) that opens in a new tab.
- Five-question FAQ using native keyboard-accessible `<details>` disclosures, plus matching FAQPage JSON-LD structured data injected into the page head.
- Honest device-only messaging in the intro, summary note, FAQ, and footer — no implied multi-device sync.

## Tech stack

- **Language:** TypeScript
- **Framework:** Vue 3 (`<script setup>` single-file components)
- **Build tool:** Vite with `vue-tsc` type-checking
- **Styling:** Hand-written CSS custom properties split into foundation, section, and responsive layers; Fraunces and Karla from Google Fonts; original inline SVG motifs

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
│   ├── motifs/            # Original SVG ornaments (bow, ribbon, sprig)
│   ├── ClaimSummary.vue   # Heading, availability count, device note
│   ├── FaqSection.vue     # FAQ disclosures
│   ├── GiftCard.vue       # One gift tag with claim/release controls
│   ├── GiftList.vue       # Grid of gift tags
│   ├── RegistryHeader.vue # Couple names, date, intro
│   └── SiteFooter.vue     # Sign-off and honesty note
├── composables/
│   └── useClaims.ts       # localStorage claim state and counts
├── content/
│   ├── gifts.json         # The twelve gifts
│   └── site.ts            # All page copy, couple details, FAQ
├── styles/
│   ├── foundation.css     # Design tokens, reset, typography
│   ├── sections.css       # Header, list, cards, FAQ, footer
│   └── responsive.css     # Breakpoint and reduced-motion rules
├── types/
│   └── index.ts           # Gift, FAQ, and site content types
├── App.vue                # Composes the page sections
└── main.ts                # App bootstrap and FAQ JSON-LD injection
```

## Personalizing

### Content and business data

- `src/content/gifts.json` — every gift: `id`, `title`, `note`, `priceLabel`, `category`, optional `shopUrl`, and optional `seedClaimed` to pre-mark a gift as taken. The two placeholder `shopUrl` values point at `example.com`; replace them with real shop links or remove them.
- `src/content/site.ts` — couple names, event line, intro paragraph, device-only note, FAQ questions and answers, and footer copy.
- `index.html` — page `<title>`, meta description, and favicon.

### Branding and styles

- `src/styles/foundation.css` — all colors, fonts, spacing, and page-width tokens in `:root`.
- `src/styles/sections.css` — per-section layout and the gift-tag card styling.
- `src/styles/responsive.css` — breakpoints at 920px, 620px, and 360px plus reduced-motion rules.
- `index.html` — swap the Google Fonts link if you change the typefaces in `foundation.css`.

### Images

This template uses no photography. The decorative artwork is three original SVG components in `src/components/motifs/` (bow, ribbon, sprig) that inherit their color from CSS; edit or replace those files to change the ornaments. The favicon is an inline SVG data URI in `index.html`.

### Routes and features

This is a single-page app with no router; `src/App.vue` composes the sections in order. The claim behavior (storage key, claiming, releasing, availability count) lives in `src/composables/useClaims.ts`. The FAQ JSON-LD is generated in `src/main.ts` from the same FAQ content in `src/content/site.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/registry-thumbnail.png`
- Full page: `preview/registry-homepage.png`
