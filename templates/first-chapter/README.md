# First Chapter

An author site that lets someone read chapter one of your book in a real in-browser reader, then follow a buy link — no store to configure on day one.

## Overview

First Chapter is a single-screen site for a self-published author whose whole job is conversion by reading: a visitor lands on the dust jacket, opens the built-in reader, finishes chapter one, and is handed to the shop that actually sells the book. Nothing is sold or collected on the site itself, so there is no checkout, no account system, and nothing to keep online except a static page.

The landing view is set like a book object — an original CSS/SVG clothbound cover generated from your own title and imprint, the blurb, praise quotes, an author bio with a working email link, and a five-question FAQ. The reader view presents the complete first chapter in a serif column of about 64 characters per line, with a drop cap, scene-break ornaments, a brass progress rule, adjustable text size, and an estimated time remaining.

Reading position and text size are saved in the visitor's own browser, so closing the tab and coming back later reopens the chapter at the same paragraph — and the landing page greets returning readers with a "Continue chapter one" button and a progress chip. The chapter ends in an honest handoff card: buy the paperback at your configured shop URL, or write to the author.

## Features

- Full chapter-one reader at `#read`: a 64ch serif reading column (Crimson Pro) with drop cap, epigraph styling, and `* * *` scene-break ornaments rendered from plain Markdown
- Sticky reader chrome with a brass progress rule, live percent read, and "about N min left" computed from the actual word count
- A− / A+ text size control with four steps; changing size keeps the current paragraph anchored in view
- Reading position and text size persist in `localStorage` and survive reload; the landing hero switches to "Continue chapter one" with a percent-read chip
- Honest buy handoff: the hero, footer, and end-of-chapter card all link to the shop URL from `src/data/site.json` — the button copy is configurable and the site clearly states it sells nothing itself
- Author contact as a `mailto:` link built from the same email shown on the page
- Praise quotes, author bio with SVG monogram medallion, and a FAQ that also emits `FAQPage` JSON-LD structured data
- Original SVG/CSS book-cover composition (spire, waterline, ripples) drawn from your title, imprint, and author name — no cover image file required
- Semantic HTML, keyboard-operable controls with visible focus states, reduced-motion support, and responsive layouts down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** Svelte 5 (plain single-page app, no SvelteKit)
- **Build tool:** Vite
- **Styling:** Plain hand-written CSS with centralized design tokens
- **Markdown:** `marked`, parsing `src/content/book.md` into the bundle at build time
- **Linting:** ESLint (flat config with `eslint-plugin-svelte` and `typescript-eslint`)

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

Open the local URL printed by Vite.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check with `svelte-check` and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── components/
│   ├── AuthorSection.svelte
│   ├── BlurbSection.svelte
│   ├── BookCover.svelte
│   ├── FaqSection.svelte
│   ├── Hero.svelte
│   ├── Landing.svelte
│   ├── PraiseSection.svelte
│   ├── Reader.svelte
│   ├── SiteFooter.svelte
│   └── SiteHeader.svelte
├── content/
│   └── book.md
├── data/
│   └── site.json
├── lib/
│   ├── chapter.ts
│   ├── faqSchema.ts
│   ├── reader.ts
│   ├── site.ts
│   └── types.ts
├── styles/
│   └── global.css
├── App.svelte
└── main.ts
public/
└── favicon.svg
```

`src/App.svelte` switches between the landing view and the reader view based on the `#read` URL hash. Components compose the page; all logic (Markdown parsing, reading position, text size) lives in typed modules under `src/lib/`.

## Personalizing

### Content and business data

Your chapter lives in `src/content/book.md`. Replace it with your own opening chapter: the first `#` heading becomes the chapter title shown in the article, a leading `>` blockquote renders as an epigraph, `***` lines become scene-break ornaments, and `*text*` renders italic. Word count and reading time are recomputed automatically.

Everything else you would edit is in `src/data/site.json`: book metadata (`book` — title, author, tagline, genre, page count, imprint, year; the SVG cover redraws itself from these), navigation labels (`nav`), hero copy (`hero`), the blurb (`blurb`), praise quotes (`praise`), author bio and email (`author`), the buy handoff (`buy` — `url` is your shop link and `label` is the button text, e.g. "Buy on Bookshop"), reader chrome labels (`reader`), FAQ entries (`faq`, also used for the `FAQPage` JSON-LD), and footer lines (`footer`). The shapes are typed in `src/lib/types.ts`. The browser tab title and meta description live in `index.html`.

### Branding and styles

Edit `src/styles/global.css`. The Google Fonts `@import` (Crimson Pro and Work Sans) and all design tokens — page ivory, forest-green ink, brass accent, the `--reader-measure` reading width (keep it between 60ch and 70ch) — sit in the `:root` block at the top. Section, cover, reader, and responsive rules follow in the same file. Reader text-size steps are `TEXT_SIZES` in `src/lib/reader.ts`.

### Images

There are no raster images. The book cover is an original SVG/CSS composition in `src/components/BookCover.svelte`; edit its `<svg>` to change the artwork, or restyle the board in the cover section of `src/styles/global.css`. The favicon is `public/favicon.svg`.

### Routes and features

This is a single page with two hash-routed views: the landing (`/`) and the reader (`/#read`), switched in `src/App.svelte`. Landing section order is composed in `src/components/Landing.svelte`. Reader behavior — progress, block-level position saving, restore-on-reload, and text sizing — lives in `src/components/Reader.svelte` with its pure helpers in `src/lib/reader.ts` and Markdown handling in `src/lib/chapter.ts`. Structured data comes from `src/lib/faqSchema.ts`.

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

- Thumbnail: `preview/first-chapter-thumbnail.png`
- Full page: `preview/first-chapter-homepage.png`
