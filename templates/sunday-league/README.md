# Sunday League

An amateur football club noticeboard: the league table, results and fixtures, and the next match pinned at the top counting down to kick-off.

## Overview

Sunday League is a single-page noticeboard for an amateur football club whose "website person" is really the club secretary. Instead of a CMS, everything on the page — the table, the fixtures, the club copy, the FAQs — lives in two committed JSON files that the secretary edits after each final whistle.

The board pins the next match at the top as a matchday poster: both club crests, home and away tags, venue, and a scoreboard-style countdown ticking to kick-off. "Next" is never hardcoded — it is computed from fixture kick-off times against the clock, so the poster rolls over to the following fixture by itself. Played fixtures move into the results list with won/drew/lost chips, a fixture past kick-off without a recorded score shows "Result to follow", and once every fixture has been played the poster degrades gracefully to a "Season complete" card.

Below the poster sit a real HTML league table with the club's row highlighted, the results and upcoming fixtures, an about-the-club strip, and a five-question FAQ that is also published as FAQPage JSON-LD for search engines. Contact goes through plain `mailto:` links built from the same secretary details shown on the page.

## Features

- Pinned next-match poster computed from fixture kick-off times — never hardcoded — with a live days/hours/minutes/seconds countdown in scoreboard digits
- Graceful degradation: when every fixture has kicked off, the poster becomes a "Season complete — next season's fixtures soon" card with a contact action
- Semantic league table (`<table>` with `caption`, column and row headers) showing played/won/drawn/lost/goals/points, zebra rows, a highlighted club row, and computed goal difference
- Results list with won/drew/lost chips and scores, "Result to follow" for played-but-unrecorded fixtures, and an upcoming list with kick-off times, venues, and home/away tags
- All copy and season data in two committed JSON files (`src/data/club.json`, `src/data/season.json`) typed by TypeScript interfaces — the secretary updates a file, not a CMS, and the page says so honestly
- Five-question club FAQ rendered from data and injected as schema.org FAQPage JSON-LD
- `mailto:` contact actions in the header, poster fallback, about strip, and footer, all built from the displayed secretary details
- Six original SVG club crests, keyboard-accessible controls with visible focus states, reduced-motion support, and responsive layouts down to 320px (the table scrolls inside its panel, never the page)

## Tech stack

- **Language:** TypeScript
- **Framework:** Angular 22 (standalone components, signals, zoneless change detection)
- **Build tool:** Angular CLI (`@angular/build` esbuild application builder)
- **Styling:** Plain hand-written CSS with centralized design tokens
- **Linting:** ESLint with angular-eslint (flat config)

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

Open the local URL printed by the Angular CLI.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── app/
│   ├── components/     # club-header, next-match, match-countdown, league-table,
│   │                   # fixture-list, about-club, faq-section, club-footer
│   ├── models/         # content.ts — types for the data files
│   ├── services/       # season-board.ts (clock + fixture logic), faq-jsonld.ts
│   ├── utils/          # countdown.ts, standings.ts
│   ├── app.config.ts
│   ├── app.css
│   ├── app.html
│   └── app.ts
├── data/
│   ├── club.json       # club identity, copy, secretary contact, FAQs
│   └── season.json     # league table rows and fixtures
├── index.html
├── main.ts
└── styles.css          # fonts, design tokens, shared layout and helpers
public/
├── crests/             # six original SVG club crests
├── images/             # about-strip photo
└── favicon.svg
```

`src/app/app.html` composes the page from small standalone components. All editable content lives in `src/data/`, typed by `src/app/models/content.ts` and loaded through `src/app/content.ts`.

## Personalizing

### Content and business data

Edit `src/data/club.json` for the club name, league and division, ground and address, colours note, training and kick-off notes, the about paragraph, the honest "how this board works" note, the secretary's name and email (every `mailto:` link is built from it), and the FAQs. Edit `src/data/season.json` for the season label, the "updated" date shown on the board, the six table rows (`played`, `won`, `drawn`, `lost`, `goalsFor`, `goalsAgainst`, `points` — rows render in array order, so keep the file sorted; goal difference is computed), and the fixtures. Each fixture holds `matchday`, `opponent` (must match a table team name so its crest resolves), `homeAway`, `kickoff` (local ground time, `YYYY-MM-DDTHH:mm:ss`), `venue`, and `result` — leave `result` as `null` until the game is played, then record `{ "goalsFor": x, "goalsAgainst": y }` from the club's point of view. The next match is always computed from kick-off times, so updating this file is the whole workflow.

### Branding and styles

Edit `src/styles.css`. The Google Fonts import (Oswald and Inter) and every design token — pitch greens, chalk, gold, win/draw/loss colors, fonts, radius, shadow — sit at the top; shared layout, panel, button, and accessibility helpers follow. Section-specific rules live in the CSS file next to each component in `src/app/components/`.

### Images

Club crests are original SVGs in `public/crests/`, referenced by path from `src/data/club.json` and `src/data/season.json`; edit the SVG colors and shapes or drop in your own files (a 64 × 72 viewBox keeps proportions). The favicon is `public/favicon.svg`. The about-strip photo is `public/images/matchday.jpg`, referenced in `src/app/components/about-club.html`; replace it with a landscape image around 1600px wide and update the `alt`, `width`, and `height` attributes. The current photo was sourced from Pexels contributor Omar Ramadan.

### Routes and features

This is a single static route composed in `src/app/app.html` from the components in `src/app/components/` — reorder sections there. Next-fixture and played/upcoming partitioning live in `src/app/services/season-board.ts` (a one-second clock signal), countdown math in `src/app/utils/countdown.ts`, and the FAQPage JSON-LD injection in `src/app/services/faq-jsonld.ts`. The document title is set from the club data in `src/app/app.ts`; static metadata lives in `src/index.html`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/sunday-league/browser/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/sunday-league-thumbnail.png`
- Full page: `preview/sunday-league-homepage.png`
