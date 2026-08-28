# Today's Menu

A café and deli menu that follows the clock: breakfast, lunch, and evening reorder by the visitor's local time, with sold-out dishes greyed out.

## Overview

Today's Menu is a one-page website for a café or deli whose offer changes through the day. Instead of a static menu, the page acts as the daily board: a live clock card and a sun-marker day strip show what is being served right now, and the three daypart sections reorder themselves so the current service always leads.

Visitors land on the masthead, see "Serving lunch — until 4 pm" (or the correct opening message at any hour), and read the board exactly as the kitchen sees it. Dishes carry dietary tags, and anything that has run out stays visible but struck through with a Sold out chip until the next morning's run. Opening hours highlight today, and prominent click-to-call and email actions replace any ordering system.

## Features

- Daypart sections (Breakfast, Lunch, Evening) reorder by the visitor's local time, with the current service first
- "Serving now · until …" badge on the active daypart, plus "From …" and "Back tomorrow …" states on the others
- Live clock card with the date, current time, and a serving status line that updates every 30 seconds
- Day-strip timeline with a sun marker positioned at the current time and a background band that shifts by daypart
- Correct behavior at any hour, including "kitchen opens at 7 am" and "closed for the night" states
- Exactly-marked sold-out dishes: struck-through name and price, muted text, and a Sold out chip that stays legible
- Dietary tag chips (V, VE, GF, N) with a legend and screen-reader expansions
- Opening-hours strip with the current weekday highlighted and a "Today" chip
- Click-to-call buttons in the header and find-us band, plus a mailto link — no fake ordering backend
- Four-question FAQ rendered with `FAQPage` JSON-LD structured data
- Semantic HTML, visible focus states, accessible `<time>` labels, and responsive layouts down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro
- **Build tool:** Astro
- **Styling:** Plain responsive CSS with centralized design tokens
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

`src/pages/index.astro` composes the page. The day clock and menu behaviors live in `src/components/DayBoard.astro` and `src/components/MenuBoard.astro`, shared time helpers in `src/utils/menu.ts`, and all editable content in committed JSON files under `src/data/`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the café name, intro copy, phone, email, address, weekly opening hours, navigation links, and social links. Edit `src/data/menu.json` for the three daypart windows (id, label, start and end times, tagline) and every dish (name, description, price, daypart, dietary tags, and the `soldOut` flag — flip it to grey a dish out). FAQ questions and answers live in the `faqs` array of `src/data/site.json`. Café story and the find-us copy live in `src/pages/index.astro`.

### Branding and styles

Edit `src/styles/global.css`. Color tokens, the two font families, and the layout gutter are defined in `:root` at the top; the daypart gradient variants are on `.day-board[data-daypart='…']`; section styles and the responsive rules (1040px, 760px, and 420px breakpoints) follow in the same file.

### Images

Local photos live in `public/images/` and are referenced from `src/pages/index.astro`. The room photo displays at a 3:4 portrait crop and the counter photo at a near-square crop; images around 1000px wide work well. The favicon is `public/favicon.svg`. Current photos were sourced from Pexels contributors Brett Sayles and Marta Dzedyshko.

### Routes and features

This is a single static route served by `src/pages/index.astro`, with anchor navigation defined in `src/data/site.json`. The time-based reordering, serving badges, and clock all read the daypart windows from `src/data/menu.json` — change `start` and `end` there to reschedule the whole page. The hours highlight logic sits in `src/components/HoursStrip.astro`, and shared parsing and formatting helpers in `src/utils/menu.ts`.

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

- Thumbnail: `preview/todays-menu-thumbnail.png`
- Full page: `preview/todays-menu-homepage.png`
