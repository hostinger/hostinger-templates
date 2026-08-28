# relayctl Terminal

A polished, static developer-tool landing page for the fictional `relayctl` command-line interface.

## Overview

This template presents `relayctl` as a focused CLI for keeping service context, release checks, and deployment handoffs readable. It is designed for developer-tool teams that need a distinctive homepage without adding a backend, live terminal, or environment configuration.

The single-page journey moves from an animated command demonstration through install commands, workflow guidance, feature notes, output examples, and FAQs. All product claims and terminal output are clearly committed demo content.

## Features

- Typewriter-style hero command with instant rendering when reduced motion is preferred
- Keyboard-accessible npm, Homebrew, and curl installation tabs
- Clipboard controls with visible success and failure states
- Workflow, feature, and structured output examples
- Expandable FAQ content with matching `FAQPage` JSON-LD
- Responsive layouts verified for desktop, `390 × 844`, and `320px` widths

## Tech stack

- **Language:** TypeScript
- **Framework:** React 19
- **Build tool:** Vite
- **Styling:** Plain CSS with split foundation, section, and responsive stylesheets
- **Content:** Committed JSON with TypeScript domain types

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

Open the local URL printed by the development server.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
.
├── preview/
│   ├── terminal-homepage.png
│   └── terminal-thumbnail.png
├── src/
│   ├── components/
│   │   ├── FaqSection.tsx
│   │   ├── FieldManual.tsx
│   │   ├── HeroTerminal.tsx
│   │   ├── InstallTabs.tsx
│   │   ├── OutputExamples.tsx
│   │   └── SiteHeader.tsx
│   ├── content/site.json
│   ├── hooks/useTypewriter.ts
│   ├── icons/CopyIcon.tsx
│   ├── styles/
│   │   ├── foundation.css
│   │   ├── responsive.css
│   │   └── sections.css
│   ├── types/site.ts
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── LICENSE
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Personalizing

### Content and business data

Edit `src/content/site.json` to change product copy, links, install commands, terminal output, workflow steps, feature notes, examples, FAQs, and footer text. Shared content shapes live in `src/types/site.ts`.

### Branding and styles

Edit design tokens, typography, and base layout in `src/styles/foundation.css`. Section-specific layouts live in `src/styles/sections.css`, and mobile breakpoints are in `src/styles/responsive.css`.

### Images

This design does not require content photography or illustration. If local images are added, place them in `src/assets/images/`, import them from the relevant component, and choose dimensions appropriate to their rendered aspect ratio. Catalog screenshots live in `preview/`.

### Routes and features

`src/App.tsx` composes the home page and its sections. Navigation and major product content are configured in `src/content/site.json`; interactive install behavior is in `src/components/InstallTabs.tsx`, and hero motion is in `src/hooks/useTypewriter.ts`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist`.

## Screenshots

- Thumbnail: `preview/terminal-thumbnail.png`
- Full page: `preview/terminal-homepage.png`
