# Model

An AI product landing page with a transparent, browser-only support-ticket classifier.

## Overview

Model is a single-page product site for teams evaluating automated support triage. Visitors can paste a request or choose a bundled example, then immediately see its category, urgency, confidence, evidence, recommended action, and response draft.

The demo uses deterministic keyword rules committed with the project. It requires no account, API key, backend, or network request, and clearly labels its output as a local product demonstration rather than a production machine-learning result.

## Features

- Browser-only ticket classification with four categories and three urgency levels
- Three clickable ticket examples plus custom textarea input
- Immediate results with detected signals, next action, and draft reply
- Responsive SVG confidence calibration plot
- Accessible live result region, keyboard controls, labels, and focus states
- Email waitlist link and four-question FAQ with `FAQPage` JSON-LD
- Responsive layouts tuned for desktop, 390px, and 320px widths

## Tech stack

- **Language:** TypeScript
- **Framework:** Next.js 16 App Router
- **Build tool:** Next.js static export
- **Styling:** Plain CSS with design tokens and responsive stylesheets
- **Linting:** ESLint flat configuration

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
model/
├── preview/
│   ├── model-homepage.png
│   └── model-thumbnail.png
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── CalibrationPlot.tsx
│   │   ├── Header.tsx
│   │   ├── MethodAndFaq.tsx
│   │   └── TicketEvaluator.tsx
│   ├── content/
│   │   └── site.ts
│   ├── lib/
│   │   └── classifyTicket.ts
│   ├── styles/
│   │   ├── foundation.css
│   │   ├── responsive.css
│   │   └── sections.css
│   └── types/
│       └── model.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Personalizing

### Content and business data

Edit `src/content/site.ts` for page copy, example tickets, waitlist email, metadata, and FAQ entries. Edit `src/lib/classifyTicket.ts` for categories, keyword rules, urgency rules, actions, confidence calculation, and response drafting.

### Branding and styles

Edit `src/styles/foundation.css` for colors, typography, spacing tokens, and base rules. Section layouts live in `src/styles/sections.css`; mobile breakpoints and narrow-layout adaptations live in `src/styles/responsive.css`.

### Images

The interface uses an inline responsive SVG chart and CSS-drawn details, so no content images are required. If local imagery is added, keep it in `public/images/`; wide technical diagrams around a 3:2 aspect ratio work best.

### Routes and features

`src/app/page.tsx` composes the only route and controls section order and structured data. Components in `src/components/` own the header, interactive evaluation, calibration plot, methodology, FAQ, and waitlist sections.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `out/`.

## Screenshots

- Thumbnail: `preview/model-thumbnail.png`
- Full page: `preview/model-homepage.png`
