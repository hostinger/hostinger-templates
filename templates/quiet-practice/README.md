# Quiet Practice

A calm website for a therapist or counsellor, with a gentle four-question "is this right for me?" check that routes visitors to the matching service page instead of a wall of text.

## Overview

Quiet Practice is a multi-page site for a solo therapy or counselling practice. It answers the question every prospective client actually has — "which of these services is for me?" — with a two-minute self-check: four soft questions, one at a time, that end by landing the visitor on the service page that fits what they described. The result is a real, shareable URL, not a generic contact form.

The site ships with three services — individual therapy, couples counselling, and teen counselling — each with its own statically generated page covering who it is for, how sessions work, fees, and what the first session is like. Every service page is reachable through normal links (homepage index, header, footer), loads directly on its own URL, and cross-links to the other two services.

The self-check is honestly framed as a signpost, not a clinical assessment: a disclaimer sits under the check, an email fallback is offered when nothing fits, and the booking handoff is real — a booking link when `bookingUrl` is configured, or warm click-to-call and email actions built from the displayed contact details when it is not.

## Features

- Four-question self-check, one large-type question at a time with progress dots, a back button, and answer routing that lands on the matching service page at a real URL (`/services/couples-counselling`, for example)
- Weighted routing logic in a typed utility (`app/utils/selfCheck.ts`): each answer adds points to one or more services, the highest total wins, and ties resolve to whichever service led earliest
- Three statically generated service pages with "this might fit if" signals, approach, first-session notes, a sticky session-details card, and cross-links to the other two services
- Honest booking handoff: primary call-to-action switches between a configured `bookingUrl` and click-to-call, with `tel:` and `mailto:` links always built from the same contact data shown on screen
- Homepage service index rows with per-service accent tones, fees formatted centrally, and full keyboard access
- Four-question FAQ rendered from data with `FAQPage` JSON-LD structured data in the head
- Gentle disclaimer plus a crisis-line note in the footer, and a `noscript` fallback pointing no-JavaScript visitors to the service list
- Reduced-motion support, visible focus states, skip link, semantic landmarks, and layouts verified down to 320 px wide

## Tech stack

- **Language:** TypeScript
- **Framework:** Nuxt 4 (Vue 3), server-rendered
- **Build tool:** Nuxt / Vite
- **Styling:** Plain hand-written CSS with centralized design tokens
- **Linting:** ESLint (`@nuxt/eslint` flat config)

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

Open the local URL printed by Nuxt.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
app/
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── ArtMark.vue
│   ├── ArtRipples.vue
│   ├── ContactPanel.vue
│   ├── FaqSection.vue
│   ├── PathSteps.vue
│   ├── SelfCheckPanel.vue
│   ├── ServiceIndex.vue
│   ├── SiteFooter.vue
│   └── SiteHeader.vue
├── data/
│   ├── content.ts
│   ├── self-check.json
│   ├── services.json
│   └── site.json
├── pages/
│   ├── index.vue
│   └── services/
│       └── [slug].vue
├── types/
│   └── content.ts
├── utils/
│   ├── contact.ts
│   ├── format.ts
│   └── selfCheck.ts
└── app.vue
public/
├── favicon.svg
└── robots.txt
```

`app/pages/index.vue` composes the homepage from the components in `app/components/`; `app/pages/services/[slug].vue` renders one page per entry in `app/data/services.json`. All editable copy lives in the JSON files in `app/data/`, typed by `app/types/content.ts` and exposed through `app/data/content.ts`.

## Personalizing

### Content and business data

Everything a practice owner needs to edit lives in three JSON files:

- `app/data/site.json` — practice name, descriptor, therapist name, credentials and licence line, phone (`phoneDisplay` + `phoneCountryCode`), email, `bookingUrl` and `bookingLabel`, address, hours, hero copy, section headings, the three "how it starts" steps, FAQ questions and answers, service-page labels, disclaimer, crisis note, and navigation links. Set `bookingUrl` to your scheduling link (Cal.com, SimplePractice, etc.) to make it the primary call-to-action everywhere; leave it `""` to fall back to click-to-call.
- `app/data/services.json` — the services. Each entry holds `slug` (the URL), `name`, `shortName`, `tone` (accent color: `dusk`, `lavender`, or `sand`), `forWhen`, `summary`, `signals`, `approach` paragraphs, `session` details (`length`, `feeAmount`, `feeCurrency`, `frequency`, `format`), and `firstSession`. Adding or removing an entry automatically updates the homepage index, footer, cross-links, and the prerendered routes.
- `app/data/self-check.json` — the check's copy and the four questions. Every option carries `weights`, a map of service slug to points; the highest total wins and ties go to the service that led earliest. Keep weight keys in sync with the slugs in `services.json`.

Routing/scoring logic lives in `app/utils/selfCheck.ts`, contact-link builders in `app/utils/contact.ts`, and fee formatting (locale and currency display) in `app/utils/format.ts`.

### Branding and styles

Edit `app/assets/css/main.css`. The Google Fonts import (Source Serif 4 and IBM Plex Sans) and all design tokens — palette, service accent tones, typography, focus ring — sit at the top of the file; section styles and the responsive rules (960 px, 640 px, 400 px breakpoints) follow in the same file.

### Images

There are no photographs — the artwork is original inline SVG. The soft ripple illustration is `app/components/ArtRipples.vue` and the small circular mark used in the header, footer, and service cards is `app/components/ArtMark.vue`; both read their colors from the CSS tokens. The favicon is `public/favicon.svg`. If you add photos, put them in `public/images/` and reference them as `/images/<name>` (landscape images around 1600 px wide work well).

### Routes and features

- `/` — `app/pages/index.vue`: hero, self-check, service index, steps, FAQ, contact panel, in that order.
- `/services/<slug>` — `app/pages/services/[slug].vue`: one page per service in `app/data/services.json`.
- Prerendered routes are derived from `services.json` in `nuxt.config.ts`, so every service page is generated as static HTML and loads directly.
- Header and footer navigation links live in the `navigation` array of `app/data/site.json`.
- The self-check behavior (question stepping, back button, final navigation) is in `app/components/SelfCheckPanel.vue`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` writes a Nuxt SSR app to `.output`. `npm run preview` runs the Nitro server at `.output/server/index.mjs`. This is a server-rendered app, not a static export.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/quiet-practice-thumbnail.png`
- Full page: `preview/quiet-practice-homepage.png`
