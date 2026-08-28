# Groom Room

A breed-led dog grooming website with clear guide prices, appointment times, and booking handoff.

## Overview

Groom Room is a warm, editorial multi-page website for an independent dog groomer. It helps owners answer the practical questions that usually delay an enquiry: how much their dog’s groom costs, how long it takes, and what the finished cut looks like.

Visitors choose from six popular breeds to instantly update the recommended cut, photo, price, duration, and pre-filled booking enquiry. Dedicated service and visit pages explain the full menu, quoting approach, location, and opening hours.

## Features

- Interactive six-breed price and duration picker
- Breed-specific cut guidance and locally stored photography
- Four optional grooming add-ons
- Full service menu and transparent quote guidance
- Visit page with address, opening hours, phone, and email actions
- Four-question FAQ with `FAQPage` JSON-LD
- Accessible controls, focus states, semantic structure, and responsive layouts
- Direct-load static routes for `/`, `/services`, and `/visit`

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro
- **Build tool:** Astro
- **Styling:** Plain responsive CSS with centralized design tokens
- **Linting:** ESLint

## Getting started

### Prerequisites

- Node.js 20.19 or newer
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL printed by Astro.

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
├── layouts/
├── pages/
├── styles/
└── types/
public/
└── images/
```

Astro page files provide static routes. Shared framing lives in `src/layouts/`, focused UI in `src/components/`, and editable content in committed JSON files.

## Personalizing

### Content and business data

Edit `src/data/site.json` for brand copy, contact details, hours, navigation, and booking links. Edit `src/data/breeds.json` for breed names, cuts, prices, durations, descriptions, and image paths. Service and FAQ copy lives in `src/pages/services.astro` and `src/pages/index.astro`.

### Branding and styles

Edit `src/styles/global.css`. Design tokens are at the top of the file; section layouts and responsive rules follow in the same file.

### Images

Replace local files in `public/images/` and keep the matching paths in `src/data/breeds.json` and the page image references. Portrait or near-square crops at least 1200px wide work best. Current photos were sourced from Pexels contributors Goochie Poochie Grooming, Gustavo Fring, Tima Miroshnichenko, Helena Lopes, and Lum3n.

### Routes and features

Routes live in `src/pages/`. `src/pages/index.astro` controls homepage sections and FAQ content; `src/components/BreedPicker.astro` owns the picker interaction. Add or remove navigation links in `src/data/site.json`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/groom-room-thumbnail.png`
- Full page: `preview/groom-room-homepage.png`
