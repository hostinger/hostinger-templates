# Client Gallery

A private wedding delivery gallery where clients star their favourite photographs and export the list, so the edit conversation with the photographer starts itself.

## Overview

Client Gallery is the page a photographer sends after the wedding: one album, twelve numbered frames, presented like prints on a dark gallery wall. The album header carries the couple's names, the event date and venue, the delivery note, and a quiet photographer credit — the photos are the colour, the chrome stays out of the way.

Clients move through the masonry grid and star the frames they love. Favourites are saved in the browser on that device, so choosing can happen over several evenings — close the page, come back, the selection is waiting. A sticky tray keeps the running count visible ("7 of 12 favourited") the whole way down the page.

When the list feels right, one press of "Export list" downloads a small CSV naming every starred photograph — photo number, filename, and caption. The client attaches it to their reply, and the photographer knows exactly which frames to take into editing, album design, or print.

## Features

- Masonry delivery gallery with proof-sheet presentation: numbered frames, captions, and the exact filename on every photograph
- Star toggle on each photo — real buttons with `aria-pressed`, keyboard reachable, with visible gold focus states
- Favourites persist per device in `localStorage`, keyed by the album id, and survive reloads; stale entries are dropped if the album changes
- Sticky selection tray with a live favourite count announced via `role="status"`, a clear action, and the export action
- One-click CSV export (photo number, filename, caption) generated client-side as a Blob download — no server, nothing uploaded
- Album masthead with couple's names, event date, venue, photograph count, delivery date, and photographer credit line
- Four-question FAQ (how favourites work, how to send the list back, usage rights) with `FAQPage` JSON-LD structured data
- Committed JSON content: `src/data/album.json` is the single source of truth for every word and photo on the page
- Responsive from 1440px down to 320px with no horizontal overflow, plus reduced-motion support

## Tech stack

- **Language:** TypeScript
- **Framework:** React 19
- **Build tool:** Vite
- **Styling:** Plain hand-written CSS with centralized design tokens
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

Open the local URL printed by the development server.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── App.tsx
├── main.tsx
├── components/
├── data/
├── icons/
├── styles/
├── types/
└── utils/
public/
└── images/
```

`src/App.tsx` composes the page from focused components in `src/components/` and owns the favourites state. Editable content lives in `src/data/album.json`, typed by `src/types/content.ts`. Favourites persistence and the CSV export are typed utilities in `src/utils/`.

## Personalizing

### Content and business data

Edit `src/data/album.json` for everything written on the page: the album `id` (it keys the favourites saved on each device and names the exported CSV — changing it resets saved selections), `eyebrow`, couple `title`, `eventDate`, `venue`, `photographerCredit`, `studio`, `deliveredLabel`, the `intro` and `howTo` paragraphs, and the `usageNote` shown in the footer. Each entry in `photos` holds `filename` (a file inside `public/images/`, and the identifier exported to the photographer), `alt`, an optional `caption`, and the image's pixel `width` and `height` (used to reserve layout space). FAQ questions and answers live in the `faqs` array and also feed the `FAQPage` JSON-LD emitted from `src/App.tsx`.

### Branding and styles

Edit `src/styles/global.css`. The Google Fonts import (Libre Caslon Text and Karla) and all design tokens — charcoal surfaces, ivory text tones, the single gold accent, hairlines, fonts, page width, and grid gap — sit in the `:root` block at the top. Component rules (header, gallery, star buttons, selection tray, FAQ, footer) and the responsive breakpoints (1024px, 760px, 640px, 360px) follow in the same file.

### Images

Photographs live in `public/images/` and are served from `/images/<filename>`; each is referenced only through its `filename` in `src/data/album.json`. Use JPEGs around 1600px on the long edge and mix portrait and landscape frames — the masonry grid uses the `width` and `height` you record per photo, so update those values when you swap an image. The favicon is `public/favicon.svg`. The sample photographs were sourced from Pexels contributors Ayşenur, Git Stephen Gitau, Alexander Mass, Valeria Boltneva, Agung Pandit Wiguna, Masood Aslami, Мария, cottonbro studio, ELIZAVETA CHAYKO, Asad Photo Maldives, and Edward Eyer.

### Routes and features

This is a single static route, `src/App.tsx`, which composes `AlbumHeader`, `GalleryGrid`, `FaqSection`, `PageFooter`, and the sticky `SelectionTray` from `src/components/`. Favourite persistence (the `localStorage` key prefix and load/save/toggle rules) lives in `src/utils/favourites.ts`; the CSV format and Blob download live in `src/utils/exportFavourites.ts`. Shared SVG icons are in `src/icons/`.

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

- Thumbnail: `preview/client-gallery-thumbnail.png`
- Full page: `preview/client-gallery-homepage.png`
