# Design System

A tiny component playground for a team publishing components: flip the props,
watch the live preview change, and copy the exact snippet that reproduces it —
demo-branded as the fictional "Vitrine" kit.

## Overview

Design System is a small documentation site for a component kit. The homepage
introduces the system — live specimens rendered by the real components, the
team's working rules, and an index of everything the kit ships — and each of
the three components (Button, Input, Card) gets its own page with a live
playground, a prop reference table, and usage notes.

The playground is the core of the template. Every documented prop becomes a
real control — selects for unions, switches for booleans, text fields for
strings — and changing one updates the rendered specimen instantly. Below the
preview, the template snippet is regenerated on every change following one
deterministic rule: required props always appear, optional props appear only
when they differ from the component's default, and long tags wrap one
attribute per line. The copy button puts exactly that markup on the clipboard.

Each playground also remembers itself: the last configuration is stored in
`localStorage` per component, restored on the next visit, and forgotten again
by "Reset props". All copy, component metadata, and FAQ content live in two
data files, so a team can rebrand the whole site without touching a component.

## Features

- Three real, reusable kit components (`VButton`, `VInput`, `VCard`) built as
  plain Vue SFCs with typed props, hover/focus/disabled states, and honest
  accessibility (`aria-invalid`, labelled fields, keyboard operability)
- A live playground per component: labelled selects, switches, and text
  controls generated from typed prop metadata, updating the preview instantly
- Deterministic snippet generation — the code block under the preview always
  matches the current configuration exactly, omitting props at their defaults
- One-click copy with a "Copied" confirmation and a polite screen-reader
  announcement
- Per-device persistence: each playground's last configuration survives
  reloads via `localStorage`, and "Reset props" restores the documented start
- Prop reference tables (name, type, default, description) and usage notes
  sourced from the same metadata that drives the controls
- Homepage with live component specimens, system principles, a component
  index, and an FAQ rendered with `FAQPage` JSON-LD structured data
- Client-side routing with direct-load support on static hosts (the build
  emits a `404.html` fallback) and an honest not-found page for unknown routes

## Tech stack

- **Language:** TypeScript
- **Framework:** Vue 3 (`<script setup>`, vue-router)
- **Build tool:** Vite
- **Styling:** Plain CSS with design tokens (no framework)
- **Linting:** ESLint (flat config with `eslint-plugin-vue`)

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
- `npm run build` — type-check with `vue-tsc`, build to `dist/`, and copy
  `dist/index.html` to `dist/404.html` as the SPA fallback for static hosts
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── components/
│   ├── playground/   # stage, prop controls, snippet panel, prop table
│   └── ui/           # the documented kit: VButton, VInput, VCard + registry
├── data/             # site.json (copy) and components.ts (prop metadata)
├── router/
├── styles/           # foundation (tokens), layout, playground
├── types/
├── utils/            # snippet generation, localStorage persistence
├── views/            # HomeView, ComponentView, NotFoundView
├── App.vue
└── main.ts
```

## Personalizing

### Content and business data

- `src/data/site.json` — the system name, tagline, version, package name,
  hero copy, principles, FAQ entries, every UI label, and the footer text.
- `src/data/components.ts` — the documented components: name, tag, summary,
  intro, usage notes, and each prop's type, control kind (`select`, `toggle`,
  `text`), options, default, playground starting value, and description.
- `index.html` — the page `<title>` and meta description.

### Branding and styles

- `src/styles/foundation.css` — every design token (canvas, ink, accent, and
  state colors, radii, shadow, container width) plus the Google Fonts import
  (Familjen Grotesk and Martian Mono) and shared primitives.
- `src/styles/layout.css` — header, hero, principles, component index, FAQ,
  and footer sections.
- `src/styles/playground.css` — the component pages: stage, controls,
  snippet panel, prop table, and pager.
- Each kit component's own styles live in its SFC under
  `src/components/ui/` — they only consume tokens from `foundation.css`.

### Images

This template uses no photography. The only image asset is the original SVG
favicon at `public/favicon.svg`; the header wordmark glyph is pure CSS. Both
follow the token palette, so swap their colors when you rebrand.

### Routes and features

- `src/router/index.ts` — routes: `/`, `/components/:id`, and a catch-all
  not-found view.
- Adding a component: document it in `src/data/components.ts`, build the SFC
  in `src/components/ui/`, and register it in `src/components/ui/index.ts` —
  the route, playground, prop table, index card, and nav entry all follow
  from the data.
- Snippet formatting rules live in `src/utils/snippet.ts`; the `localStorage`
  key and validation for saved configurations live in
  `src/utils/playgroundState.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`, including a `404.html` copy of
`index.html`. Because this is a client-routed SPA, direct links such as
`/components/button` only work when the static host serves that fallback:
hosts like GitHub Pages use `404.html` automatically, while others need a
rewrite of unknown paths to `index.html`. To test the built site with such a
fallback locally, run `npx serve dist --single`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/design-system-thumbnail.png`
- Full page: `preview/design-system-homepage.png`
