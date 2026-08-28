# Kado Objects Storefront

A static, editorial storefront for a small independent desk-accessories studio.

## Overview

Kado Objects presents a focused eight-piece catalogue for customers who value
well-made tools and uncluttered workspaces. The art direction combines the
precision of an industrial catalogue with the warmth of a Japanese stationery
shop.

Visitors can browse the collection, open a dedicated detail page for every
object, add items to a persistent local cart, adjust quantities, and prepare an
order enquiry. Configure a hosted checkout URL to send customers to an external
payment service; the template never collects account or card details itself.

## Features

- Eight editable products sourced from one typed JSON catalogue.
- Static homepage, cart, and pre-rendered product detail routes.
- Hydration-safe local cart with quantity controls, removal, totals, and persistence.
- Accessible live cart announcements, keyboard focus styles, and labelled controls.
- Honest email enquiry fallback when hosted checkout is not configured.
- Four-item FAQ with `FAQPage` JSON-LD and product structured data.
- Responsive layouts designed for desktop, 390px, and 320px viewports.

## Tech stack

- **Language:** TypeScript
- **Framework:** Next.js 16 App Router with React 19
- **Build tool:** Next.js static export
- **Styling:** Global CSS with custom properties and responsive media queries
- **Storage:** Browser `localStorage`

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
public/
└── images/                  Local catalogue and studio photography
src/
├── app/
│   ├── cart/                Cart route
│   ├── products/[slug]/     Static product detail routes
│   ├── globals.css          Design system and responsive styles
│   ├── layout.tsx           Shared storefront shell
│   └── page.tsx             Catalogue homepage
├── components/              Storefront UI and cart views
├── content/
│   ├── products.json        Product catalogue
│   └── site.json            Business, checkout, and FAQ configuration
├── context/                 Persistent cart state
├── hooks/                   Currency formatting
└── types/                   Shared commerce types
```

## Personalizing

### Content and business data

Edit `src/content/products.json` for products, prices, specifications, image
paths, and lead-time copy. Edit `src/content/site.json` for the studio name,
intro, location, currency, shipping note, email address, FAQ, and
`checkoutUrl`. Leave `checkoutUrl` empty to use the transparent order-enquiry
fallback.

### Branding and styles

Colors, typography, spacing, catalogue proportions, and responsive breakpoints
live in `src/app/globals.css`. Font families are loaded and assigned in
`src/app/layout.tsx`.

### Images

Local images live in `public/images/` and are referenced by path from
`src/content/products.json` or `src/app/page.tsx`. Portrait or square source
images of at least 1400px on the shortest side work best; adjust
`imagePosition` per product when its crop needs refinement.

Photography is sourced from Pexels: Esra Nurdoğan
([19112792](https://www.pexels.com/photo/19112792/)), RDNE Stock project
([7845307](https://www.pexels.com/photo/7845307/)), Jess Bailey Designs
([35242187](https://www.pexels.com/photo/35242187/)), Cup of Couple
([6956510](https://www.pexels.com/photo/6956510/)), Katerina Holmes
([5905710](https://www.pexels.com/photo/5905710/)), Skylar Kang
([6045231](https://www.pexels.com/photo/6045231/)), Yuanda “Darian” Shen
([34234073](https://www.pexels.com/photo/34234073/)), Kindel Media
([7054793](https://www.pexels.com/photo/7054793/)), and PNW Production
([8250976](https://www.pexels.com/photo/8250976/)).

### Routes and features

Route composition lives in `src/app/`. Product slugs in
`src/content/products.json` determine generated `/products/[slug]/` routes.
Shared navigation and footer content live in `src/components/Header.tsx` and
`src/components/Footer.tsx`. Cart behavior and its storage key live in
`src/context/CartContext.tsx`.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `out/`.

## Screenshots

- Thumbnail: `preview/storefront-thumbnail.png`
- Full page: `preview/storefront-homepage.png`
