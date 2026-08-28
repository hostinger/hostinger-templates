# {{PROJECT_NAME}}

{{ONE_SENTENCE_DESCRIPTION}}

## Overview

Explain what the project does, who it is for, and the primary user journey in
two or three short paragraphs.

## Features

- List concrete user-facing capabilities.
- Mention meaningful interactions and routes.
- Avoid generic claims such as “modern” or “easy to use.”

## Tech stack

- **Language:** TypeScript
- **Framework:** {{FRAMEWORK}}
- **Build tool:** Vite
- **Styling:** {{STYLING_APPROACH}}
- Add only technologies actually used.

## Getting started

### Prerequisites

- Node.js {{NODE_VERSION}}
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
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
src/
├── assets/
├── components/
├── constants/
├── icons/
├── pages/
├── styles/
├── types/
├── App.tsx
└── main.tsx
```

Describe any intentional differences from this baseline. Omit directories that
do not exist.

## Personalizing

### Content and business data

Name exact files containing editable copy, links, contact details, lists, and
configuration.

### Branding and styles

Name exact files containing colors, typography, spacing, layout, and responsive
rules.

### Images

Explain where local images live, where they are imported, and recommended image
dimensions or aspect ratios.

### Routes and features

Explain where pages, routes, navigation, and major feature configuration live.

### Environment variables

List required variables and point to `.env.example`. If none are required,
state: “This project does not require environment variables.”

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/{{PROJECT_ID}}-thumbnail.png`
- Full page: `preview/{{PROJECT_ID}}-homepage.png`
