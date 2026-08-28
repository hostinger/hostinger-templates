# API Reference

A server-rendered API reference with a try-it panel that assembles the exact curl command from your inputs — ready to copy, never sent from the page.

## Overview

API Reference is a small NestJS web app for documenting an HTTP API. The home page carries the product pitch, the endpoint index with color-coded method badges, the authentication story, and a FAQ; each endpoint gets its own server-rendered page at `/endpoints/<slug>` with parameter reference tables, a realistic response example, and a request builder.

The request builder is the point: it assembles a syntax-highlighted curl command from the endpoint definition and the form — correct method, auth header, URL-encoded query string, and a pretty-printed JSON body with shell quoting handled (single quotes, embedded quotes, the lot). The copy button copies exactly what is shown, and the form state syncs into the page URL as you type, so a filled example is a shareable link that restores the same state on load. The panel is honest by design: it never calls the API — no keys are asked for and no request ever leaves the page.

The seeded content documents Hooklane, a fictional webhook delivery API with four endpoints (GET, POST, PUT, DELETE). Swap in your own API by editing two JSON files; the pages, forms, and curl commands are all derived from them. This is a Node server app, not a static export — it stays running behind a Node process manager in production.

## Features

- Endpoint index grouped by resource, with method badges color-coded per verb (GET emerald, POST sky, PUT amber, DELETE red)
- One server-rendered page per endpoint at `/endpoints/<slug>`, each loading directly; unknown slugs and paths get a terminal-styled 404 listing the real endpoints
- Request builder on every endpoint page: labelled inputs per parameter (text, numeric, and selects for enums/booleans) live-update a syntax-highlighted curl block
- Correct-by-construction commands: path params URI-encoded, query params as readable `-G --data-urlencode` lines (percent-encoded into the URL when the endpoint also sends a body), JSON body typed per parameter (strings, integers, booleans, comma-separated arrays), all shell escaping handled
- Copy button copies exactly the visible command text, with a clipboard fallback and an `aria-live` confirmation
- Form state syncs into the URL query as you type (`?status=failed&limit=25`), and a shared link restores the same filled state — server-side too, so it works before JavaScript loads
- The panel never sends the request: no fetch to the API, no key input, and a visible note saying so
- No-JavaScript fallback: the builder form submits as a plain GET and the server re-renders the command
- Five-question FAQ rendered from JSON with `FAQPage` JSON-LD on the home page
- Contact links (`mailto:`) built from the same displayed site data
- Dark code-editor design with terminal-styled code blocks, semantic HTML, keyboard-accessible controls, visible focus states, and layouts verified down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** NestJS 12 (Express platform) with server-rendered Handlebars (`hbs`) views
- **Build tool:** Nest CLI (`nest build`, tsc under the hood)
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

Open the local URL printed by the server (defaults to `http://localhost:4375`).

## Available scripts

- `npm run dev` — start the NestJS dev server in watch mode
- `npm run build` — compile the server to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — run the compiled production server from `dist/`

The server reads the `PORT` environment variable and defaults to `4375`, so `PORT=4375 npm run preview` and `npm run preview` are equivalent.

## Project structure

```text
src/
├── data/                # site.json and endpoints.json — all editable content
├── types/               # shared content types
├── utils/               # curl assembly, URL state, view models, JSON-LD
├── views/               # Handlebars pages and partials
├── app.controller.ts    # routes: /, /endpoints/:slug
├── app.module.ts        # module wiring and the global 404 filter
├── content.service.ts   # loads the committed JSON content
├── main.ts              # bootstrap: hbs views, static assets, PORT
├── not-found.filter.ts  # renders the styled 404 page
└── paths.ts             # project-root resolution for views/data/assets
public/
├── js/try-it.js         # request builder + copy button enhancement
├── styles/main.css      # every design token and style rule
└── favicon.svg
```

This is a Node server app, not a static export. The compiled server in `dist/` resolves views from `src/views/`, content from `src/data/` and static assets from `public/` relative to the project root, so the build needs no copy step — deploy the whole project folder and run `node dist/main.js`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the API name, tagline, hero heading and intro, base URL, version label, the auth header (`headerName`, `scheme`, `tokenPlaceholder` — keep it a shell variable, never a real key), section copy, navigation, footer links, the support contact (the `mailto:` link is built from `contact.email`), and the FAQ list. Edit `src/data/endpoints.json` for the endpoints themselves: each entry holds `slug`, `method`, `path` (with `{placeholders}` for path params), `group`, `summary`, `description`, a `params` array (`name`, `in`: `path`/`query`/`body`, `type`: `string`/`integer`/`boolean`/`array`, `required`, `description`, `example`, optional `enum`), a `responseDescription`, and a `responseExample` JSON value. Pages, forms, and curl commands are all derived from these two files.

### Branding and styles

Edit `public/styles/main.css`. All design tokens — the near-black palette, panel and terminal surfaces, the violet brand accent, per-method colors, the syntax-highlight palette, and the Google Fonts `@import` (Red Hat Display and Red Hat Mono) — sit in the `:root` block at the top; component and responsive rules follow in the same file. The header's syntax-spectrum hairline lives in the `.site-header::after` rule.

### Images

This template uses original SVG only. The favicon is `public/favicon.svg`, and the header logo is an inline SVG in `src/views/partials/top.hbs` — edit both together to rebrand the mark. There are no photos to replace.

### Routes and features

HTTP routes live in `src/app.controller.ts`: the home page (`/`) and the endpoint pages (`/endpoints/:slug`, validated against `endpoints.json`; unknown slugs 404 through `src/not-found.filter.ts`). Page markup lives in `src/views/` (`index.hbs`, `endpoint.hbs`, `not-found.hbs`, and `partials/`). The curl command is assembled by typed pure functions in `src/utils/curl.ts`; the browser mirror that live-updates the block, syncs the URL, and powers the copy buttons is `public/js/try-it.js` — change the two together. URL-state rules live in `src/utils/params.ts`.

### Environment variables

`PORT` — the port the server listens on, defaulting to `4375`. See `.env.example`. The server reads it straight from the environment (`PORT=8080 npm run preview`); no dotenv loader is involved.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`. `npm run preview` runs the compiled Node server (`node dist/main.js`) on port 4375 unless `PORT` is set — this is a server app and must stay running behind your host's Node process manager.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/api-reference-thumbnail.png`
- Full page: `preview/api-reference-homepage.png`
