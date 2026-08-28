# Supper Club

A one-night supper club invitation site with a live seats-remaining place card, a countdown to doors, a menu that reveals course by course, and an honest email RSVP.

## Overview

Supper Club is a single-page Astro site for a pop-up or private dining night — one date, one long table, no ticketing platform. It answers the only questions a guest has: when is it, how many seats are left, what will we eat, and how do I get a chair.

The page reads like a candlelit invitation. A place-card counter shows seats remaining out of the cap (with a low-seats urgency state and a sold-out waitlist switch) above a live countdown computed from the configured event date. The tasting menu keeps its secrets the way it does at the table: guests uncover the four courses one at a time, in order. RSVPs are honest — the form composes a ready-to-send email to the host and says exactly what happened; nothing pretends a server received anything.

If the configured date has passed, the page degrades gracefully: the countdown gives way to a "this dinner has passed" notice and the form becomes a join-the-list-for-the-next-one form.

## Features

- Live countdown to doors, computed from the committed event date, ticking every second
- Place-card seat counter — seats remaining of the seat cap, a pulsing low-seats urgency state, and an automatic waitlist mode when seats hit zero
- Four-course menu revealed one course at a time, in strict order, with an "uncover the whole menu" shortcut; keyboard accessible and fully readable without JavaScript
- Honest RSVP/waitlist form (name, email, seats, dietary notes) with inline validation that composes a prefilled `mailto:` to the host and confirms locally that nothing is sent until the guest presses send
- Graceful past-date state: countdown and urgency copy swap to "join the list for the next one" and the email subject changes accordingly
- Event particulars: date and seating times, venue-reveal policy, price per seat with inclusions, and table size
- Five-question FAQ rendered with `FAQPage` JSON-LD structured data
- Semantic HTML, labelled inputs, visible focus states, and no horizontal overflow down to 320px-wide screens

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro (static output)
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
│   ├── Footer.astro
│   ├── Header.astro
│   ├── MenuReveal.astro
│   ├── RsvpForm.astro
│   └── SeatsCard.astro
├── data/
│   ├── event.json
│   └── site.json
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── styles/
│   └── global.css
└── types/
    └── content.ts
public/
├── favicon.svg
└── images/
```

The single route lives in `src/pages/index.astro`. Shared framing is in `src/layouts/`, the interactive pieces in `src/components/`, and all editable content in committed JSON under `src/data/` typed by `src/types/content.ts`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the club name, monogram, tagline, host name, contact email and phone, socials, and the venue-reveal policy. Edit `src/data/event.json` for everything about the night: dinner number, theme, ISO date with UTC offset (this single field drives the countdown, the past-date state, and the displayed date), IANA timezone, doors/seating times, venue line, price per seat, currency, inclusions, seat cap, seats remaining, and the four courses (numeral, title, name, description, pairing). Update `seatsRemaining` as requests are confirmed — set it to `0` to switch the page into waitlist mode. FAQ questions and answers live in the `faqs` array of `src/data/site.json`. The host letter lives in `src/pages/index.astro`.

### Branding and styles

Edit `src/styles/global.css`. All design tokens (aubergine/gold/ivory palette, paper card colors, and the Cormorant Garamond + Jost font stacks) sit in the `:root` block at the top; section styles and responsive breakpoints (940px, 720px, 400px) follow in the same file. The Google Fonts `@import` is on line 1.

### Images

Local photos live in `public/images/` and are referenced from `src/styles/global.css` (hero backdrop) and `src/pages/index.astro` (the kitchen figure). Portrait crops around 1600×2100 work best for both slots. Current photos were sourced from Pexels contributors Lena Dorofeeva and Cole Yap.

### Routes and features

This is a single-page site: `src/pages/index.astro` composes every section and the anchor navigation comes from `src/data/site.json`. The countdown and seat states live in `src/components/SeatsCard.astro`, the course-by-course reveal in `src/components/MenuReveal.astro`, and the RSVP/waitlist/next-dinner email composition in `src/components/RsvpForm.astro`.

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

- Thumbnail: `preview/supper-club-thumbnail.png`
- Full page: `preview/supper-club-homepage.png`
