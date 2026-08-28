---
name: create-nodejs-repository
description: Creates polished, production-ready React and TypeScript template apps, registers them in templates.json, and captures consistent preview images. Use whenever adding or rebuilding a template in this repository.
---

# Create a Node.js template repository

Build one complete template at a time. Read and enforce [RULES.md](RULES.md)
before changing files.

## 1. Required intake

Before creating files, editing `templates.json`, installing dependencies, or
choosing a design, ask the user for all five fields:

1. **Name** — product or template name.
2. **Description** — purpose, users, and required behavior.
3. **Tech stack** — libraries, services, storage, auth, or other constraints.
4. **Language** — explicitly confirm TypeScript. TypeScript is mandatory; if the
   user requests another language, clarify that application code will still use
   TypeScript.
5. **Framework** — React is the default; confirm the requested framework before
   starting.

Do not infer missing required fields from a vague prompt. Ask one compact set of
questions. Also ask whether the user wants a single-page or multi-page app when
the description does not make navigation scope clear.

After answers arrive, summarize the agreed brief in five short bullets and
start implementation without requesting another approval.

## 2. Decide application scope

Use a single page when one focused journey can be understood without navigation.
Use multiple pages when the product has distinct journeys, substantial content,
or separate user goals.

Good multi-page candidates include:

- marketplaces with browse, detail, and account views
- service businesses with service-detail or location pages
- dashboards with separate operational areas
- editorial, documentation, portfolio, and directory products

For multi-page React apps, use a maintained router and make every route work on
direct load. Do not add empty routes to make a project appear larger.

## 3. Define a unique visual direction

Before coding, establish:

- topic-specific art direction
- palette and typography
- layout rhythm and information hierarchy
- imagery approach
- signature visual detail
- desktop and mobile interaction model

Every template must look intentionally designed for its subject. Do not reuse
the same hero structure, card grid, gradient, illustration, typography pairing,
or palette from another project. Avoid generic starter-dashboard and centered
hero aesthetics.

Use relevant Pexels photography when images improve the result. Download images
into `src/assets/images/`; never hotlink. Keep provider names and source URLs out
of application code. Record source details only in the README if required.

## 4. Scaffold cleanly

Create `<root>/<template-id>/`, where the ID is unique lowercase kebab-case.

Required baseline:

- React
- TypeScript for all application code
- Vite
- npm with committed `package-lock.json`
- ESLint flat configuration
- one `tsconfig.json`
- one `vite.config.ts`

Required scripts:

```json
{
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

Install current packages through npm. Do not invent dependency versions.

## 5. Use clean architecture

Use this baseline and adapt only when the app genuinely needs more:

```text
src/
├── assets/
│   └── images/
├── components/
├── constants/
├── icons/
├── pages/          # Required for multi-page apps
├── styles/
├── types/
├── App.tsx
└── main.tsx
```

Architecture requirements:

- `App.tsx` composes routes or top-level sections.
- Page files coordinate features; they do not contain the whole application.
- Components are small, named, and reusable where reuse is real.
- Content, business details, navigation, and configuration use typed constants.
- Shared domain shapes live in `types/`.
- SVG icons live in `icons/`; do not duplicate inline icon markup.
- Styles are split by foundation, section/component, and responsive concerns.
- State lives in the smallest component that owns it.
- Avoid premature abstractions, wrapper components with no value, and deeply
  nested prop plumbing.

## 6. Make it vibecoder-friendly

A future user must be able to personalize the template without tracing the
entire app:

- centralize editable copy, links, contact details, lists, and feature flags
- use clear file and symbol names
- keep design tokens and responsive breakpoints easy to find
- keep local images in one predictable directory
- provide `.env.example` when environment variables exist
- avoid unexplained magic values and unnecessary infrastructure
- make common customizations possible without changing component logic

## 7. Build complete UX

Implement real content and working interactions. Include appropriate loading,
empty, success, validation, and error states when the product behavior needs
them.

Use semantic HTML, keyboard-accessible controls, useful alt text, visible focus
states, and labelled forms. Avoid fake controls and dead links.

Mobile is a first-class layout:

- verify at `390 × 844`
- verify at `320px` width
- prevent horizontal overflow and clipping
- preserve hierarchy without merely shrinking desktop
- keep form controls and touch targets comfortable

## 8. Write README in the fixed format

Create the project README using [README_TEMPLATE.md](README_TEMPLATE.md).
Preserve its top-level headings, heading order, and section purpose exactly.
Replace placeholders and remove instructional comments, but do not invent a
different structure.

The `Personalizing` section is mandatory and must identify exact files for:

- copy and business data
- colors, typography, and layout
- images
- routes and major features
- environment variables, when applicable

## 9. Verify before screenshots

Run:

```bash
npm install
npm run lint
npm run build
```

Then verify primary journeys in a browser on desktop and mobile. Check direct
route loading for multi-page apps. Fix TypeScript, ESLint, build, console,
overflow, clipping, missing-image, and interaction failures before continuing.

## 10. Capture consistent images

Create `<template-id>/preview/` only after final verification.

Use the same `1440 × 900` landscape viewport for every template:

1. Save the viewport thumbnail to
   `preview/<template-id>-thumbnail.png` at `1440 × 900`.
2. Save the whole page to `preview/<template-id>-homepage.png` using
   `fullPage: true`.
3. For multi-page apps, use the strongest representative route for the catalog
   images. Extra route screenshots are allowed but not required.
4. Inspect saved files for stale UI, missing fonts, clipping, excess blank
   space, and failed images.

## 11. Register rich catalog metadata

Add one object to the root `templates.json`. Follow
[TEMPLATE_SCHEMA.md](TEMPLATE_SCHEMA.md) exactly.

Write specific, useful metadata:

- explain what users can build, not generic marketing claims
- write `description` as at least three substantial paragraphs separated by
  `\n\n`: audience and problem, core journey and features, then personalization
  and technical strengths
- describe meaningful features and interactions
- include accurate categories, use cases, frameworks, runtime, and search terms
- record both image paths and actual dimensions
- keep strict JSON with no comments or trailing commas

Do not add dropped fields: `repository`, `kind`, `databases`, `license`,
`audienceLevel`, or `status`.

## 12. Final cleanup

Remove:

- unused scaffold assets and components
- duplicate or generated Vite configs
- duplicate TypeScript configs
- `*.tsbuildinfo`
- build output
- obsolete lint tooling
- unused dependencies
- temporary downloads

Ensure `.gitignore` covers `node_modules`, `dist`, `.env*`, and
`*.tsbuildinfo`.

Finish only after:

- install passes
- lint passes
- build passes
- desktop and mobile checks pass
- screenshots exist and were inspected
- README follows the fixed structure
- `templates.json` is valid and rich
- project tree contains only intentional files
