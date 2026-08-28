# Trust Centre

A B2B trust and security page: compliance posture in plain words, a subprocessor table, a data-handling summary and a private disclosure form that is honest about having no mail backend.

## Overview

Trust Centre is a small server-rendered web app for a product that sells to businesses — the single page a vendor security review needs. It presents the company's compliance posture as text statements (SOC 2 Type II report under NDA, GDPR DPA available, ISO 27001 in progress) with honest wording and no fake badges, a generous subprocessor table with purpose and region for each vendor, a three-part data-handling summary (encryption, retention, access), a five-question FAQ and a visible security contact.

The centrepiece is the private disclosure form: reporter email (optional), category and description, validated both in the browser and on the server. Because the template ships with no mail service, submitting never pretends anything was sent — a dedicated response page states plainly that the report was not transmitted, then offers a prefilled `mailto:` link to the displayed security address and the full report text to copy. Unknown URLs get a proper 404 page.

The demo content is a fictional B2B SaaS, Harborline, a contract and vendor workflow platform — every claim on the page is worded so it stays honest for a template (no certifications asserted that the copy does not qualify).

## Features

- Compliance posture rendered as three text statements with bordered status chips — "report available under NDA", "DPA available", "certification in progress" — no logos, no false claims
- Subprocessor table (name, purpose, region) with a "last updated" stamp, collapsing into labelled stacked cards on small screens
- Data-handling summary cards for encryption, retention/deletion and production access, with original stroke icons
- Private disclosure form validated client-side (inline messages, focus management, `aria-invalid`) and server-side (authoritative checks, 422 re-render with an error summary and preserved values)
- Honest no-backend fallback: submitting renders a "your report has not been sent" page with a prefilled `mailto:` to the same security address shown on the page, the report as copyable text, a Clipboard-API copy button and a truncation note when the description exceeds mail-client-safe length
- Security email built from one data field and shown in the header, hero, form, fallback page and footer
- Five-question FAQ in accessible `<details>` disclosures plus `FAQPage` JSON-LD in the head
- Server-rendered 404 page for unknown routes; `GET /disclosure` redirects to the form section
- Semantic labelled controls, keyboard-reachable interactions, visible focus states and layouts verified down to 320px

## Tech stack

- **Language:** TypeScript
- **Framework:** Fastify 5 with `@fastify/view` (EJS), `@fastify/static` and `@fastify/formbody`
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

Open the local URL printed by the server (defaults to `http://localhost:4373`).

## Available scripts

- `npm run dev` — start the local development server with tsx watch
- `npm run build` — type-check and compile the server to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — run the compiled production server from `dist/`

The server reads the `PORT` environment variable and defaults to `4373`, so `PORT=4373 npm run preview` and `npm run preview` are equivalent.

## Project structure

```text
src/
├── data/          # site.json and trust.json — all editable content
├── types/         # shared content types
├── utils/         # content loading, disclosure validation, report/mailto building, dates, JSON-LD
├── views/         # EJS templates and partials
└── server.ts      # Fastify app: routes, static serving, 404, errors
public/
├── js/            # progressive-enhancement scripts (client validation, copy button)
├── styles/        # main.css with all design tokens
└── favicon.svg
```

This is a Node server app, not a static export. The compiled server in `dist/` resolves views from `src/views/`, content from `src/data/` and static assets from `public/` relative to the project root, so the build needs no copy step — deploy the whole project folder and run `node dist/server.js`.

## Personalizing

### Content and business data

Edit `src/data/site.json` for the company (name, legal name, product, one-line product description, headquarters), the page title/tagline/intro, the header navigation, the security contact (`securityContact.email` drives every mailto link and the prepared report's recipient), the footer links and note, the "last reviewed" date and the 404 copy. Edit `src/data/trust.json` for the three compliance posture statements, the subprocessor list (name, purpose, region, last-updated date), the data-handling summary, the whole disclosure flow copy (form labels, categories, validation messages, the honest fallback page, report labels) and the FAQ used for both the page and its JSON-LD. Validation rules (description length, email pattern, mailto truncation limit) live in `src/utils/disclosure.ts`.

### Branding and styles

Edit `public/styles/main.css`. All design tokens — the deep-navy and steel-blue palette, the Google Fonts `@import` (Libre Franklin), the system mono stack, content width, radii and section rhythm — sit in the `:root` block at the top; component and responsive rules follow in the same file. The shield brand mark is inline SVG in `src/views/partials/top.ejs`, the large hero shield motif in `src/views/index.ejs`, and the small data-handling icons in `src/views/partials/icon.ejs`.

### Images

This template uses no photography — all graphics are original inline SVG (shield mark, hero motif, stroke icons). The favicon is `public/favicon.svg`; replace it with your own square SVG and keep the `<link rel="icon">` in `src/views/partials/top.ejs`.

### Routes and features

HTTP routes live in `src/server.ts`: the home page (`/`), the disclosure flow (`POST /disclosure` renders the error page or the honest fallback page; `GET /disclosure` redirects to `/#disclosure`) and the 404 handler. Page markup lives in `src/views/` (`index.ejs`, `disclosure.ejs`, `disclosure-fallback.ejs`, `not-found.ejs` and `partials/`, including the shared form partial). The client-side validation and copy-button enhancements are `public/js/disclosure-form.js` and `public/js/copy-report.js`; both are optional layers over fully working server-rendered pages. To actually deliver reports by email instead of the mailto fallback, wire a mail provider into the `POST /disclosure` handler — the honest fallback exists precisely because none is configured.

### Environment variables

`PORT` — the port the Fastify server listens on, defaulting to `4373`. See `.env.example`. The server reads it straight from the environment (`PORT=8080 npm run preview`); no dotenv loader is involved.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`. `npm run preview` runs the compiled Node server (`node dist/server.js`) on port 4373 unless `PORT` is set — this is a server app and must stay running behind your host's Node process manager.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/trust-centre-thumbnail.png`
- Full page: `preview/trust-centre-homepage.png`
