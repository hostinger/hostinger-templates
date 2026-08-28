# Reception Seating Plan

A one-page Svelte planner for assigning event guests to tables, sharing the arrangement by URL, and printing a clean floor plan.

## Overview

Reception Seating Plan gives hosts a focused workspace for arranging twelve sample guests across two tables. Guests can be dragged to seats on desktop or selected and assigned with clicks or taps, so the same workflow remains usable with a keyboard or on a phone.

Assignments update the page URL immediately. A shared link restores the same seating arrangement, while the print view removes controls and converts the blueprint palette to an ink-on-white plan.

## Features

- Assign guests by drag and drop or by selecting a guest and activating a seat.
- Move seated guests, return them to the manifest, or clear the full plan.
- See empty seats and live free-seat counts for both table shapes.
- Restore assignments from compact URL state and copy a shareable link.
- Print a simplified seating plan with controls and guidance removed.
- Read three built-in questions and answers covering assignment, sharing, and printing.

## Tech stack

- **Language:** TypeScript
- **Framework:** Svelte 5
- **Build tool:** Vite
- **Styling:** Component-scoped CSS plus global responsive and print styles

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
public/
└── favicon.svg
preview/
├── seating-plan-homepage.png
└── seating-plan-thumbnail.png
src/
├── components/
├── content/
├── lib/
├── styles/
├── types/
├── App.svelte
├── main.ts
└── vite-env.d.ts
eslint.config.js
index.html
package.json
svelte.config.js
tsconfig.json
vite.config.ts
```

## Personalizing

### Content and business data

Edit interface copy and the title block in `src/content/copy.ts`, guest names in `src/content/guests.ts`, and table names, shapes, and seat counts in `src/content/tables.ts`.

### Branding and styles

Edit palette, typography, grid background, global sizing, and mobile tokens in `src/styles/global.css`. Component layout styles live beside their markup in `src/components/*.svelte`, and printable colors and visibility rules live in `src/styles/print.css`.

### Images

The interface does not require content photography. Replace `public/favicon.svg` for custom branding; catalog captures live in `preview/seating-plan-thumbnail.png` and `preview/seating-plan-homepage.png`.

### Routes and features

This is a single-page app composed in `src/App.svelte`. Configure guest and table data in `src/content/`, assignment behavior in `src/lib/plan.svelte.ts`, URL serialization in `src/lib/urlState.ts`, and seat geometry in `src/lib/geometry.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/seating-plan-thumbnail.png`
- Full page: `preview/seating-plan-homepage.png`
