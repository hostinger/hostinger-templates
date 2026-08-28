# Podcast Home

A podcast home with a real player — chapter markers on a waveform timeline, a searchable transcript, and a static page for every episode — so listeners can jump straight to the bit they were told about.

## Overview

Podcast Home is a website for an independent show whose episodes deserve more than a bare embed. The home page opens on the latest episode, ready to play: a waveform timeline with chapter pips, a chapter list that jumps the audio to any timestamp, and a link straight into the transcript. Below it, the archive lists every episode with its own cover art and mini waveform.

Every episode gets its own statically generated page built from a markdown file — player, chapters, and a transcript excerpt that listeners can search. Matches are highlighted, counted, and the first one scrolls into view, so "listen to the bit about tape ninety" takes seconds to find. Transcripts are server-rendered, so they stay readable even without JavaScript.

The bundled audio files are short spoken demo clips generated with macOS text-to-speech — honest placeholders that make the player, chapters, and timestamps work out of the box until you replace them with real episodes.

## Features

- Audio player with play/pause, a scrubbable waveform timeline, a moving playhead, and current/total time — keyboard-seekable via a real range control
- Chapter markers as pips on the timeline plus a numbered chapter list; clicking either jumps the audio to that timestamp and starts playback, and the current chapter stays highlighted while the episode plays
- Searchable transcript on every episode page: highlights each match, announces the match count via a live region, and scrolls the first hit into view
- One statically generated page per episode (`/episodes/<slug>/`), each directly loadable on any static host, with newer/older episode navigation
- Home page that opens on the latest episode ready to play, plus an archive of every episode with deterministic mini waveforms and original SVG cover art (five variants keyed to the episode number)
- About and host sections, a five-question FAQ rendered from site config with `FAQPage` JSON-LD, and `mailto:` contact links built from the same email shown on screen
- Semantic controls with visible focus states, reduced-motion support, and responsive layouts down to 320px-wide screens

## Tech stack

- **Language:** TypeScript
- **Framework:** Next.js (App Router, React, static export)
- **Build tool:** Next.js
- **Styling:** Plain CSS — design tokens in one global stylesheet plus CSS Modules per component
- **Content:** Markdown episode files parsed with gray-matter, JSON site config
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

Open the local URL printed by Next.js.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
app/
├── episodes/[slug]/    # Episode page (one static route per markdown file)
├── globals.css         # Design tokens, reset, shared utilities
├── layout.tsx          # Header, footer, metadata
└── page.tsx            # Home: latest-episode player, archive, about, FAQ
components/             # Player, transcript search, cards, art, icons
content/
├── episodes/           # One markdown file per episode
└── site.json           # Show name, tagline, host, email, socials, FAQs
lib/                    # Episode loader, types, formatting, waveform maths
public/
└── audio/              # Episode audio files (demo clips included)
```

## Personalizing

### Content and business data

Edit `content/site.json` for the show name, tagline, about paragraphs, host name and bio, studio email, social links, and the FAQ list (which also feeds the `FAQPage` JSON-LD).

Each episode is one markdown file in `content/episodes/`; the file name becomes the URL slug. Frontmatter fields: `title`, `number` (episodes sort by this, newest first), `date` (`"YYYY-MM-DD"`), `duration` (whole seconds), `audio` (public path such as `/audio/my-episode.m4a`), `guest`, `description`, and `chapters` — a list of `title` + `start` (seconds from the beginning, each within the audio length). The body is the transcript: one paragraph per turn, written as `**Speaker:** what they said`.

The five files in `public/audio/` are short spoken demo clips generated with macOS text-to-speech. Replace them with your real episode audio (any `<audio>`-supported format such as `.m4a` or `.mp3`), then update each episode's `audio`, `duration`, and chapter `start` values to match the real recording.

### Branding and styles

Edit `app/globals.css` — the Google Fonts import (Bricolage Grotesque and Schibsted Grotesk) and every color token (`--bg`, `--violet-*`, `--lime`, `--ink*`, `--stroke*`) sit at the top of the file. Component and page styles live in colocated `*.module.css` files next to each component, and the player's waveform colors are the `--wave-rest` / `--wave-played` custom properties.

### Images

This template ships no photos. Cover art is original SVG drawn in `components/EpisodeArt.tsx` — five compositions chosen by `episode number % 5` — and waveforms are generated in `lib/waveform.ts`. Edit either to change the artwork, or swap `EpisodeArt` for real cover images if you have them (square art, at least 680 × 680 px, looks best). The favicon is `app/icon.svg`.

### Routes and features

`app/page.tsx` composes the home page; `app/episodes/[slug]/page.tsx` renders one page per markdown file via `generateStaticParams`. Header navigation lives in `NAV_LINKS` in `components/SiteHeader.tsx`, and the footer in `components/SiteFooter.tsx`. Player behavior (seek, chapter jumps, playhead) is `components/EpisodePlayer.tsx`; transcript search is `components/TranscriptSearch.tsx`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `out/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/podcast-home-thumbnail.png`
- Full page: `preview/podcast-home-homepage.png`
