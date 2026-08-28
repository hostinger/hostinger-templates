# Class Timetable

A weekly yoga and pilates studio timetable that highlights the next class with a live countdown and hands booking off to your scheduling link.

## Overview

Class Timetable is a single-page website for a yoga or pilates studio whose schedule repeats every week. Instead of a PDF nobody updates, the page opens with "Next class starts in" and a countdown ticking to the second, then lays the whole week out as one airy grid — Monday to Sunday on desktop, stacked day groups on mobile.

The next upcoming class is computed in the visitor's browser from the recurring weekday-and-time rows, so it is correct at any moment: after today's last class it rolls to tomorrow morning, and it looks ahead across the week when a day has no classes. The glowing card carries a "next" pill with its own compact countdown, today's column is flagged, and a class that is currently running shows an "in session" chip with its end time.

Booking is a handoff, not a fake backend. When `bookingUrl` is set in the site data, the header button, the main call to action, and every class row open the owner's scheduling link; when it is empty, the same buttons gracefully fall back to `tel:` and then `mailto:` links built from the contact details shown on the page. The timetable reads as a documented weekly schedule — never a live availability feed.

## Features

- Live "Next class starts in" countdown (days, hours, minutes, seconds) computed client-side from recurring weekday + time rows — no hardcoded dates
- Next-class highlight in the grid: a gently glowing card with a floating "next · 3h 12m" pill that rolls to the following class the moment one starts
- "In session" state: a running class gets a pulsing chip and the banner notes when it ends; the today column is flagged automatically
- Weekly grid of 12 classes across 7 days with start time, duration, level chip (Gentle / All levels / Strong), optional instructor, and a one-line focus
- Booking handoff on every class row and CTA: scheduling link when `bookingUrl` is set, `tel:`/`mailto:` fallback when it is empty
- Committed JSON content: `src/data/timetable.json` for classes, `src/data/site.json` for studio details, navigation, socials, and FAQ copy
- Five-question FAQ rendered as an accessible accordion with `FAQPage` JSON-LD structured data
- Semantic HTML, keyboard-visible focus states, reduced-motion support, and layouts verified down to a 320px viewport

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro
- **Build tool:** Astro
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
├── types/
└── utils/
public/
└── images/
```

`src/pages/index.astro` composes the page from focused components in `src/components/` and owns the client script that drives the countdown and highlights. Editable content lives in committed JSON files in `src/data/`, typed by `src/types/content.ts`. All schedule math (next occurrence, live class, week grouping) sits in `src/utils/schedule.ts`, with display formatting in `src/utils/format.ts` and the booking handoff in `src/utils/booking.ts`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the studio name, tagline, city, address, phone, email, `bookingUrl`, intro copy, schedule note, studio notes, navigation anchors, social links, and the FAQ questions and answers. Set `bookingUrl` to your scheduler (Calendly, Momence, a booking page — any URL) and every booking button opens it; set it to `""` and the buttons become call links, or email links when `phoneHref` is also empty.

Edit `src/data/timetable.json` for the classes. Each row holds a unique `id`, `name`, `weekday` (`Monday` through `Sunday`), `startTime` (24-hour `"HH:MM"`), `durationMinutes`, `level` (`Gentle`, `All levels`, or `Strong`), an optional `instructor`, and a one-line `focus`. Rows can be in any order — the grid sorts each day by start time, and days without classes show as rest days. Times are interpreted in the visitor's device timezone, which is what a local studio audience expects.

### Branding and styles

Edit `src/styles/global.css`. The color tokens (sage, sand, terracotta, off-white paper), the Google Fonts import (Albert Sans and Lora), spacing, and the responsive breakpoints all sit at the top of the file; section rules follow in the same file.

### Images

Local images live in `public/images/` and are referenced in `src/components/StudioSection.astro`. Replace `studio-practice.jpg` with a landscape photo around 1600 × 1067 and `studio-mats.jpg` with a portrait detail shot around 1600 × 2400, keeping the `width`, `height`, and `alt` attributes accurate. The favicon is `public/favicon.svg`. The current photos are from Pexels contributors Elina Fairytale (practice room) and MART PRODUCTION (rolled mats).

### Routes and features

This is a single static route: `src/pages/index.astro`. Section order is composed there from `NextClassBanner`, `TimetableGrid`, `StudioSection`, and `FaqSection` in `src/components/`. The countdown and highlight behavior lives in the `<script>` block of `src/pages/index.astro`, backed by the pure functions in `src/utils/schedule.ts` — adjust those if you need different rollover rules.

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

- Thumbnail: `preview/class-timetable-thumbnail.png`
- Full page: `preview/class-timetable-homepage.png`
