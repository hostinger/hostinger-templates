# The Big Day

A garden wedding invitation with a personal story, day schedule, travel guidance, FAQs, and an honest email-based RSVP.

## Overview

The Big Day is a single-page wedding website for couples who want to share the important details in one warm, easy-to-follow invitation. Guests can move naturally from the couple’s story to the schedule, accommodation suggestions, practical answers, and RSVP.

All names, dates, copy, links, schedule entries, hotels, FAQs, and RSVP settings live in one central JSON file. The site builds to static files, needs no database, and clearly distinguishes between a prepared email response and an unconfigured local demo.

## Features

- Editorial invitation layout with locally stored wedding photography and botanical details
- One-day event schedule presented on a torn-paper ribbon
- Travel notes, map link, and two hotel recommendations
- Accessible RSVP with required name and attendance, conditional plus-one name, dietary needs, and message fields
- Client-side validation, visible focus states, error messages, and honest success states
- Optional prefilled `mailto:` RSVP configured from the central wedding content
- Five expandable FAQs with matching `FAQPage` JSON-LD
- Static SvelteKit output ready for CDN or file hosting

## Tech stack

- **Language:** TypeScript
- **Framework:** SvelteKit 2 with Svelte 5
- **Build tool:** Vite
- **Adapter:** `@sveltejs/adapter-static`
- **Styling:** Hand-authored responsive CSS with custom properties
- **Overrides:** `cookie@^0.7.0` — `@sveltejs/kit` still pins `cookie@^0.6.0`. Remove the override when Kit raises that range.

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
src/
├── app.html
├── lib/
│   ├── assets/images/
│   ├── components/
│   ├── data/
│   │   ├── wedding.json
│   │   └── wedding.ts
│   ├── styles/global.css
│   └── types/wedding.ts
└── routes/
    ├── +layout.svelte
    ├── +layout.ts
    └── +page.svelte
```

## Personalizing

### Content and business data

Edit `src/lib/data/wedding.json` to change names, date, venue, navigation, story, schedule, hotels, FAQs, and footer copy. Set `rsvp.email` in that file to the address that should receive replies. When it is empty, the form confirms only on screen and explicitly states that nothing was sent.

### Branding and styles

Edit `src/lib/styles/global.css`. Color tokens, font stacks, layout widths, spacing, and responsive rules begin at the top of that file.

### Images

Local images live in `src/lib/assets/images/` and are imported by `Hero.svelte` and `StorySection.svelte`. Replace them with similarly cropped JPEG or WebP images: a portrait-orientation couple photo and a 4:5 venue image, ideally at least 1200 pixels wide.

Current image sources:

- Couple in garden: [Pexels photo 1024960](https://www.pexels.com/photo/man-and-woman-wearing-wedding-dress-and-suit-standing-beside-tree-1024960/)
- Garden wedding table: [Pexels photo 169190](https://www.pexels.com/photo/clear-long-stem-wine-glass-on-brown-table-169190/)

### Routes and features

`src/routes/+page.svelte` composes the one-page route. Major sections live in `src/lib/components/`; RSVP behavior and validation live in `src/lib/components/RsvpForm.svelte`. Static prerendering is enabled in `src/routes/+layout.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `build/`.

## Screenshots

- Thumbnail: `preview/the-big-day-thumbnail.png`
- Full page: `preview/the-big-day-homepage.png`
