# Northstar Cloud Status

A static public status noticeboard with 90-day service history and narrative incident reports.

## Overview

Northstar Cloud Status is a single-page public record for a fictional cloud platform. It gives customers a fast, accessible view of the overall condition, three core services, and recent resolved incidents.

All service history is committed with the project. The page clearly identifies its publication date and does not claim live monitoring, making it a safe starting point for teams that want to add their own verified status workflow later.

## Features

- Overall service condition and publication timestamp at the top of the page
- Three service tapes with 90 committed daily readings each
- Calculated 90-day uptime summaries, visual marks, tooltips, a legend, and expandable text equivalents
- Two dated incident stories with narrative timeline updates
- Email subscription call to action using a transparent `mailto:` link
- Four-item FAQ section with `FAQPage` JSON-LD
- Responsive layouts tuned for desktop, 390px, and 320px widths

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro 7
- **Build tool:** Astro static build
- **Styling:** Plain CSS with design tokens and responsive stylesheets
- **Linting:** ESLint flat configuration with eslint-plugin-astro

## Getting started

### Prerequisites

- Node.js 22.12 or newer
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
status/
├── preview/
│   ├── status-homepage.png
│   └── status-thumbnail.png
├── src/
│   ├── components/
│   │   ├── FaqList.astro
│   │   ├── IncidentClipping.astro
│   │   ├── ServiceRow.astro
│   │   └── UptimeTape.astro
│   ├── content/
│   │   ├── site.ts
│   │   └── status.json
│   ├── icons/
│   │   └── NorthstarMark.astro
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   ├── foundation.css
│   │   ├── responsive.css
│   │   └── sections.css
│   └── types/
│       └── status.ts
├── astro.config.ts
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

## Personalizing

### Content and business data

Edit `src/content/status.json` for the snapshot date and the 90 daily readings for each service. Edit `src/content/site.ts` for organization copy, email address, incidents, FAQ entries, and notice text.

### Branding and styles

Edit `src/styles/foundation.css` for colors, typography, spacing tokens, and base type rules. Section layouts live in `src/styles/sections.css`; mobile breakpoints and layout adaptations live in `src/styles/responsive.css`.

### Images

The interface uses CSS-drawn contour lines and `src/icons/NorthstarMark.astro`, so no content images are required. If local imagery is added, keep it in `src/assets/images/` and import it from the component that renders it.

### Routes and features

`src/pages/index.astro` composes the only route and controls section order and metadata. Components in `src/components/` own uptime tapes, service rows, incident reports, and FAQ disclosure behavior.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/status-thumbnail.png`
- Full page: `preview/status-homepage.png`
