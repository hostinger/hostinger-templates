# Quickstart

A one-page, server-rendered quickstart site for an open-source tool: install tabs per package manager, copy-to-clipboard commands, and the "in five minutes you'll have" result shown up front.

## Overview

Quickstart is the page you link from a README so a first-time user gets from "what is this?" to a working install in five minutes. It leads with the payoff: a boxed "In five minutes you'll have" panel sits beside the headline, pairing a typographic terminal illustration with a checklist of concrete outcomes, so visitors see what they end up with before they scroll.

Below that, the page walks the whole adoption journey: an install section with one tab per package manager (npm, Homebrew, curl), a five-step quickstart where every step is one command plus a one-sentence explanation, and a short FAQ that answers the questions people ask before trying a tool. Every command block carries a copy button that copies exactly the visible text — the `$` prompt is drawn with CSS, so it can never end up on the clipboard.

The seeded content is a believable fictional open-source CLI, **Mynah** — a record-and-replay proxy for HTTP APIs — with internally consistent commands, flags and version numbers, so the shape of a finished page is visible before a single edit. This is a Node server app (Hono rendering HTML on the server), not a static export.

## Features

- Install tabs for npm, Homebrew and curl: proper `role="tablist"` semantics with arrow-key, Home and End navigation and roving tabindex — and without JavaScript they degrade to stacked, labelled command blocks that read fine on their own
- A copy button on every command that copies the code element's exact text content; the CSS-drawn `$` prompt is excluded by construction, and a polite live region announces the copy
- The "In five minutes you'll have" result panel rendered up front in the hero, with a terminal-output illustration built from typographic line data in `site.json`
- A five-step quickstart, each step one command with a token-colored terminal block and a one-sentence explanation
- A hero install command sourced from the same install-method data as the tabs, so no command is written twice
- Five-question FAQ as native `<details>` disclosures, emitted as `FAQPage` JSON-LD from the same JSON entries
- Header, hero and footer GitHub/docs links resolved from one place in the site data (`$repo`, `$docs`, `$issues` tokens)
- A themed 404 page ("no tape for this route") for unknown paths, served with a real 404 status
- Semantic HTML, keyboard-reachable controls, visible focus states and layouts verified down to 320 px with no horizontal overflow

## Tech stack

- **Language:** TypeScript
- **Framework:** Hono 4 on @hono/node-server, server-rendering HTML with hono/jsx
- **Build tool:** tsc (TypeScript compiler); tsx for the dev server
- **Styling:** Plain hand-written CSS with centralized design tokens
- **Linting:** ESLint (flat config with typescript-eslint)

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

Open the local URL printed by the server (defaults to `http://localhost:4376`).

## Available scripts

- `npm run dev` — start the local development server with tsx watch
- `npm run build` — type-check and compile the server to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — run the compiled production server from `dist/`

The server reads the `PORT` environment variable and defaults to `4376`, so `PORT=4376 npm run preview` and `npm run preview` are equivalent.

## Project structure

```text
src/
├── components/    # hono/jsx components: layout, header, hero, result panel,
│                  # install tabs, quickstart steps, FAQ, footer, 404
├── data/          # site.json — every piece of editable copy
├── types/         # shared content types for site.json
├── utils/         # content loading, link-token resolution, FAQ JSON-LD
└── server.tsx     # Hono app: home route, static assets, 404
public/
├── js/            # enhance.js — install tabs + copy-button enhancement
├── styles/        # main.css with all design tokens
└── favicon.svg
```

This is a Node server app, not a static export. The compiled server in `dist/` resolves content from `src/data/` and static assets from `public/` relative to the project root, so the build needs no copy step — deploy the whole project folder and run `node dist/server.js`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for everything a project owner would change: the tool's name, binary, version, one-liner, repository and docs URLs, navigation, hero copy, the result panel (checklist items and the terminal illustration lines), the install methods (tab label, command and note per package manager), the five quickstart steps, the FAQ entries (also emitted as `FAQPage` JSON-LD), footer copy and the 404 page. External links are written once — `$repo`, `$docs` and `$issues` tokens in nav/footer entries resolve against `project.repoUrl` and `project.docsUrl` (see `src/utils/content.ts`). Command strings are plain data; copy buttons always copy them exactly as displayed. Content types live in `src/types/content.ts`.

### Branding and styles

Edit `public/styles/main.css`. All design tokens — the white base, the single electric blue→cyan gradient accent, the near-black terminal palette and the Google Fonts `@import` (Plus Jakarta Sans and IBM Plex Mono) — sit in the `:root` block at the top; component and responsive rules follow in the same file. The command token colors (`.tok-*`) are also tokens there, and the tokenizer that classifies command words lives in `src/components/CommandBlock.tsx`.

### Images

This template uses no photography — the visuals are original SVG and typographic terminal illustrations. The logo mark is an inline SVG in `src/components/Header.tsx`, the favicon is `public/favicon.svg`, and the terminal illustrations are styled text driven by the `terminal.lines` arrays in `src/data/site.json`.

### Routes and features

HTTP routes live in `src/server.tsx`: the home page (`/`), static assets served with `@hono/node-server/serve-static`, and a catch-all 404. Page markup is composed in `src/components/HomePage.tsx` and `src/components/NotFoundPage.tsx` from the section components in the same directory. The install-tab and copy-button behavior is `public/js/enhance.js` — an optional enhancement layer over fully working server-rendered markup.

### Environment variables

`PORT` — the port the Hono server listens on, defaulting to `4376`. See `.env.example`. The server reads it straight from the environment (`PORT=8080 npm run preview`); no dotenv loader is involved.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`. `npm run preview` runs the compiled Node server (`node dist/server.js`) on port 4376 unless `PORT` is set — this is a server app and must stay running behind your host's Node process manager.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/quickstart-thumbnail.png`
- Full page: `preview/quickstart-homepage.png`
