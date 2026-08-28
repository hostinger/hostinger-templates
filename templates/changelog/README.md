# Changelog

A product changelog where entries are markdown files: filter features and fixes instantly, and returning visitors see a marker for everything that shipped since their last visit.

## Overview

Changelog is a two-level static site for a shipping product — a SaaS, a dev tool, an app — that wants its release notes to read like a product page instead of a commit log. The index lays every release on a vertical timeline with a date rail, a monospace version chip, and colored Feature / Fix / Improvement tags, and each entry also gets its own permalink page with previous/next navigation.

Two behaviors make it feel alive without a backend. Filter chips narrow the timeline to features or fixes instantly, with a live "Showing X of Y releases" count and no page reload. And the browser's localStorage remembers when a visitor last opened the page: on their next visit, newer releases get a New badge and an indigo "New since your last visit" divider separates them from what they have already seen. The first visit shows no marker — the timestamp is saved quietly and the marker appears once there is genuinely something new.

Entries are plain markdown files with four frontmatter fields (title, date, version, tags), rendered through an Astro content collection with syntax-highlighted code blocks. The seed content documents five releases of Relaycast, a fictional webhook-delivery platform — replace the markdown files and one JSON file and the changelog is yours.

## Features

- Vertical release timeline with a date rail, version chips, and per-entry tag chips (emerald Feature, amber Fix, indigo Improvement)
- Instant tag filter — All / Features / Fixes chips with counts, a live results line, and no reload
- "New since your last visit" marker: releases newer than the localStorage timestamp get a New badge, a highlighted timeline node, and a labeled divider showing the last-visit date; a banner in the hero counts them
- One permalink page per entry at `/releases/<slug>/`, statically prerendered, with newer/older release navigation cards
- Markdown entry bodies with Shiki-highlighted code blocks (`bash`, `ts`, `json`, `http` in the seed content)
- RSS feed at `/rss.xml` listing every release with version, date, and tags
- Four-question FAQ accordion with `FAQPage` JSON-LD structured data
- Semantic HTML, keyboard-visible focus states, reduced-motion support, and layouts verified down to a 320px viewport

## Tech stack

- **Language:** TypeScript
- **Framework:** Astro (static output, content collections)
- **Build tool:** Astro
- **Styling:** Plain hand-written CSS with design tokens in one stylesheet
- **Linting:** ESLint (flat config with `eslint-plugin-astro` and `typescript-eslint`)
- **Feed:** `@astrojs/rss`

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
├── content/
│   └── changelog/
├── data/
├── layouts/
├── pages/
│   └── releases/
├── styles/
├── types/
├── utils/
└── content.config.ts
public/
```

`src/pages/index.astro` composes the page from components in `src/components/` and owns the client script for the filter and the last-visit marker. Release notes live as markdown in `src/content/changelog/`, validated by the collection schema in `src/content.config.ts`. Product copy sits in `src/data/site.json`, typed by `src/types/content.ts`. The pure logic — filtering, last-visit storage, sorting, date formatting — lives in `src/utils/`.

## Personalizing

### Content and business data

Add, edit, or delete release notes in `src/content/changelog/*.md`. Each file needs four frontmatter fields — `title`, `date` (`YYYY-MM-DD`), `version`, and `tags` (any of `feature`, `fix`, `improvement`) — followed by a markdown body; fenced code blocks are syntax-highlighted automatically. The file name becomes the URL slug, and the timeline sorts by `date`, so file order never matters.

Edit `src/data/site.json` for the product name, legal name, tagline, hero intro, navigation, social links, the FAQ intro, and the FAQ questions and answers shown on the index (and used for the `FAQPage` JSON-LD).

### Branding and styles

Edit `src/styles/global.css`. Every color (zinc neutrals, indigo brand, emerald Feature, amber Fix), both font stacks, radii, and shadows are CSS custom properties in the `:root` block at the top; the Google Fonts `@import` (Hanken Grotesk and Fira Code) is the first line. The code-block color theme is `shikiConfig.theme` in `astro.config.ts`, and the logo is the small SVG in `src/components/BrandMark.astro`. The decorative delivery-log terminal beside the hero is `src/components/HeroPanel.astro` — edit its rows to match your product, or remove it (and its usage in `Hero.astro`) for a plain typographic hero.

### Images

The design is typographic — no photos are required. The only image asset is the favicon at `public/favicon.svg`; put any images you add in `public/` and reference them from markdown or components with root-relative paths.

### Routes and features

Routes live in `src/pages/`: the timeline at `/` (`index.astro`), one prerendered page per entry at `/releases/<slug>/` (`releases/[slug].astro`), and the feed at `/rss.xml` (`rss.xml.ts`). The filter and last-visit behavior is the `<script>` block in `index.astro`, backed by `src/utils/filter.ts` and `src/utils/lastVisit.ts` — the localStorage key is `LAST_VISIT_STORAGE_KEY` in the latter. Set your real domain in `site` in `astro.config.ts` so RSS links resolve to your host.

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

- Thumbnail: `preview/changelog-thumbnail.png`
- Full page: `preview/changelog-homepage.png`
