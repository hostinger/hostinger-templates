# Callout

A polished service-business website for an independent plumber or electrician.

## Overview

Callout presents the fictional Copper & Co. Plumbing brand through a distinctive
one-page experience. It is designed for a one-van tradesperson who needs a clear,
credible online presence without complicated administration.

Visitors can understand available services, see emergency hours, check whether
their street is covered, and call the business from prominent mobile-friendly
actions.

## Features

- Responsive service-business landing page
- Live emergency availability treatment
- Interactive street and postcode coverage form
- Click-to-call actions throughout
- Service, working-hours, coverage, and work-gallery sections
- Accessible navigation, labels, status messages, and semantic structure
- Original pipe, wrench, and neighbourhood-map illustrations
- Mobile, tablet, and desktop layouts

## Tech stack

- **Language:** TypeScript
- **Framework:** React
- **Build tool:** Vite
- **Styling:** Layered plain CSS
- **Linting:** ESLint

## Getting started

### Prerequisites

- Node.js 20 or newer
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
│   └── images/
├── components/
├── constants/
├── icons/
├── styles/
├── types/
├── App.tsx
└── main.tsx
```

Components contain focused page sections. Business content stays separate from
rendering, while foundation, gallery, desktop, and responsive styles are
composed through `src/styles/index.css`.

## Personalizing

### Content and business data

Edit `src/constants/business.ts` to replace the brand name, phone number,
service area, navigation, services, hours, and form messages.

### Branding and styles

Edit `src/styles/foundation.css` for colors and typography,
`src/styles.css` for core section layouts, and
`src/styles/responsive.css` for mobile behavior.

### Images

Replace files in `src/assets/images/` while keeping their imports in
`src/components/WorkGallery.tsx`. Similar landscape and portrait crops preserve
the current layout. Current photos were sourced from Pexels:

- Pipe installation — Anıl Karakaya
- Boiler servicing — Heiko Ruth

### Routes and features

This template uses one page. `src/App.tsx` controls section order;
`src/components/` contains each feature and interaction.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## Screenshots

- Thumbnail: `preview/callout-thumbnail.png`
- Full page: `preview/callout-homepage.png`
