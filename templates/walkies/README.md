# Walkies

A dog walker website with a walk-area map and a slot-based booking flow: pick an area, a day, and a time slot, then confirm the walk.

## Overview

Walkies is a small-group dog walking service site. The landing page introduces the service, shows how booking works, features favourite walk areas, and answers common questions. The walk areas page lists every area next to an illustrated map with numbered pins, and lets visitors filter by off-lead or on-lead walks.

The booking page walks through four steps: choose a walk area, choose a date within the next 10 days, pick an available time slot, and enter owner and dog details. Each area runs only on certain days and has fixed slot times and a maximum group size. Spaces left per slot come from deterministic sample data, so the same area, day, and time always show the same availability.

Confirming a booking shows a reference number and marks the slot as yours. Bookings are held in memory in the browser tab and clear on reload. There is no backend, no payment, and nothing is sent anywhere — the summary also offers a pre-filled email enquiry link.

## Features

- Landing page with hero, quick stats, three-step how-it-works, featured walk areas, owner testimonials, FAQ, and a call-to-action band.
- Walk areas page with an illustrated map, numbered pins linked to area cards, and an all / off-lead / on-lead filter.
- Area cards with terrain badge, neighbourhood, walk days, duration, lead policy, group size, price, and a direct "Book this walk" link.
- Booking flow: area radios, a 10-day date strip that greys out days an area does not run, and time-slot tickets showing spaces left, full, or booked by you.
- Owner and dog details form with inline validation, accessible error messages, and a live booking summary.
- Confirmation view with a booking reference, focus moved to the heading for screen readers, and a "Book another walk" action.
- Deep links: `/book?area=<area-id>` preselects an area; `/areas` and `/book` load directly on static hosts.
- Self-hosted Fraunces and DM Sans variable fonts, an inline SVG dog illustration, and no external requests.

## Tech stack

- **Language:** TypeScript
- **Framework:** React 19
- **Routing:** React Router
- **Build tool:** Vite
- **Styling:** Hand-written CSS (design tokens, section styles, responsive rules)

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
walkies/
├── index.html
├── preview/
├── src/
│   ├── components/
│   │   ├── booking/
│   │   │   ├── AreaPicker.tsx
│   │   │   ├── BookingConfirmation.tsx
│   │   │   ├── BookingSummary.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── DetailsFields.tsx
│   │   │   └── SlotPicker.tsx
│   │   ├── AreaCard.tsx
│   │   ├── AreaFacts.tsx
│   │   ├── AreaMap.tsx
│   │   ├── FaqSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── LeadFilter.tsx
│   │   ├── SectionHeading.tsx
│   │   └── TerrainBadge.tsx
│   ├── constants/
│   │   ├── areas.ts
│   │   ├── booking.ts
│   │   ├── routes.ts
│   │   └── site.ts
│   ├── icons/
│   │   ├── AreaMapArt.tsx
│   │   ├── DogIllustration.tsx
│   │   └── index.tsx
│   ├── lib/
│   │   ├── areas.ts
│   │   ├── booking.ts
│   │   ├── format.ts
│   │   ├── hash.ts
│   │   └── schedule.ts
│   ├── pages/
│   │   ├── AreasPage.tsx
│   │   ├── BookingPage.tsx
│   │   └── HomePage.tsx
│   ├── styles/
│   │   ├── foundation.css
│   │   ├── responsive.css
│   │   └── sections.css
│   ├── types/
│   │   └── content.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── eslint.config.js
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Personalizing

### Content and business data

- `src/constants/site.ts` — brand name, contact email and phone, locale and currency, navigation, and all landing page copy (hero, stats, steps, testimonials, FAQ, call to action, footer).
- `src/constants/areas.ts` — the walk areas: name, neighbourhood, terrain, lead policy, summary, duration, price, group size, walker, highlights, walk days (0 = Sunday), slot times, and map pin position (percentages).
- `src/constants/booking.ts` — booking page copy, validation messages, the booking window (10 days from tomorrow), the reference prefix, and the notes length limit.

### Branding and styles

- `src/styles/foundation.css` — colour palette, terrain and map colours, fonts, radii, shadows, buttons, and chips (all CSS custom properties).
- `src/styles/sections.css` — per-section styles from header to footer, including the map, booking steps, and slot tickets.
- `src/styles/responsive.css` — breakpoints at 960px, 640px, and 380px.
- `src/main.tsx` — the self-hosted font imports; swap the `@fontsource-variable/*` packages to change typefaces.
- `index.html` — page title, meta description, theme colour, and the inline SVG favicon.

### Images

There are no raster images. The hero dog and the walk-area map are original inline SVG components in `src/icons/` (`DogIllustration.tsx`, `AreaMapArt.tsx`), and small UI icons live in `src/icons/index.tsx`. Edit or replace them there; the map art uses a 1000×700 viewBox, and pin positions in `src/constants/areas.ts` are percentages of that box.

### Routes and features

- Routes are defined in `src/constants/routes.ts` and wired in `src/App.tsx` (home, walk areas, booking). Unknown paths redirect home.
- `vite.config.ts` copies `index.html` into `dist/areas/` and `dist/book/` after the build, so direct visits work on static hosts. Add new routes to `STATIC_ROUTE_PATHS`.
- Slot availability is sample data from `src/lib/schedule.ts` (`getSampleBookedDogs`). Replace it with a real diary or booking API to take live bookings.
- Confirmed bookings live in `App.tsx` state; `src/lib/booking.ts` holds validation, the reference generator, and the email enquiry link.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/walkies-thumbnail.png`
- Full page: `preview/walkies-homepage.png`
