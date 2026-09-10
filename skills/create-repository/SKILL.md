---
name: create-nodejs-repository
description: Creates polished, production-ready Node.js template apps in the requested language and framework, registers them in templates.json, and captures consistent preview images. Defaults to React and TypeScript. Use whenever adding or rebuilding a template in this repository. Finish only after lint, build, audit, and a source security review find no issues or vulnerabilities.
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
4. **Language** — TypeScript is preferred and is the default when unspecified.
   If the user explicitly requests another language, use it.
5. **Framework** — React is preferred and is the default when unspecified. If
   the user explicitly requests another framework, use it.

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

For client-routed apps, use a maintained router. For file-routed frameworks, use
their native routing. Make every route work on direct load. Do not add empty
routes to make a project appear larger.

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

Create `<root>/templates/<template-id>/`, where the ID is unique lowercase
kebab-case.

Required baseline:

- React, TypeScript, and Vite when the user does not specify alternatives
- the explicitly requested language and framework when provided
- npm with committed `package-lock.json`
- explicit dependency ranges and a matching Node.js `engines` requirement
- an explicit reuse license
- ESLint flat configuration
- one intentional configuration file per tool
- one `tsconfig.json` for TypeScript projects
- one `vite.config.ts` for Vite projects
- `.gitignore` coverage for `.env`, `.env.*`, dependencies, build output, and
  framework caches

Required scripts:

```json
{
  "dev": "<framework dev command>",
  "build": "<type-check when supported> && <framework build command>",
  "lint": "eslint .",
  "preview": "<framework preview command>"
}
```

Install current packages through npm. Do not invent dependency versions.

## 5. Use clean architecture

For React/Vite projects, use this baseline and adapt only when the app genuinely
needs more:

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

- The framework's root app, layout, or page files compose routes and top-level
  sections.
- Page files coordinate features; they do not contain the whole application.
- Components are small, named, and reusable where reuse is real.
- Content, business details, navigation, and configuration use typed constants
  or committed structured content files appropriate to the language.
- Put user-owned copy and business data in one obvious content location. Keep
  calculations, functions, and operational rules in typed source modules.
- Do not duplicate editable copy across components, pages, and styles.
- Shared domain shapes live in a predictable types or models location when the
  language supports them.
- Shared SVG icons live in a predictable icons location; do not duplicate inline
  icon markup.
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
- keep text and locale-sensitive formatting centralized so localization can be
  added later; install an i18n library only when the brief requests localization

## 7. Build complete UX

Implement real content and working interactions. Include appropriate loading,
empty, success, validation, and error states when the product behavior needs
them.

Use semantic HTML, keyboard-accessible controls, useful alt text, visible focus
states, and labelled forms. Avoid fake controls and dead links.

Interactive claims must be honest. Static templates may use documented local
rules, but must not imply a live postcode, inventory, availability, payment, or
booking check. When a result cannot be verified locally, show an enquiry
fallback. Build `tel:` and `mailto:` links from the displayed contact details.
For calculators with URL-state requirements, restore valid values on load and
update the URL as inputs change. Print or screenshot summaries must remain
usable without hidden controls or surrounding page chrome.

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

Run these from `templates/<template-id>/` after the last code change:

```bash
npm install
npm run lint
npm run build
npm audit --audit-level=high
```

Then review the template source for issues and vulnerabilities. Do not rely
on a green audit alone. Check for:

- secrets, API keys, tokens, passwords, or committed `.env` files
- `eval`, `new Function`, or other dynamic code execution
- unsanitized HTML (`dangerouslySetInnerHTML`, unescaped template output)
- unsafe handling of URL, query, or form input
- leftover debug endpoints, dummy auth, or credentials in client code

Fix every lint, type, build, audit, and source finding before continuing. If a
vulnerability cannot be fixed, stop and report it; do not capture screenshots or
register the catalog entry.

Then verify primary journeys in a browser on desktop and mobile. Check every
multi-page route by loading its built preview URL directly, not only through
client-side navigation. Add a static-host fallback or prerendered route when the
chosen router requires it. Fix language diagnostics, ESLint, build, console,
overflow, clipping, missing-image, and interaction failures before continuing.

## 10. Capture consistent images

Create `templates/<template-id>/preview/` only after final verification.

Use the same `1440 × 900` landscape viewport for every template:

1. Start the verified local dev or preview server.
2. From `templates/<template-id>/`, capture the viewport thumbnail:

   ```bash
   npx --yes playwright@latest screenshot \
     --browser chromium \
     --viewport-size "1440,900" \
     "http://127.0.0.1:<port>/" \
     "preview/<template-id>-thumbnail.png"
   ```

3. Capture the whole homepage:

   ```bash
   npx --yes playwright@latest screenshot \
     --browser chromium \
     --viewport-size "1440,900" \
     --full-page \
     "http://127.0.0.1:<port>/" \
     "preview/<template-id>-homepage.png"
   ```

4. If Chromium is missing, run
   `npx --yes playwright@latest install chromium`, then retry.
5. Confirm the thumbnail is exactly `1440 × 900` and record the full-page
   image's actual dimensions. On macOS:

   ```bash
   sips -g pixelWidth -g pixelHeight \
     "preview/<template-id>-thumbnail.png" \
     "preview/<template-id>-homepage.png"
   ```

6. For multi-page apps, use the strongest representative route for the catalog
   images. Extra route screenshots are allowed but not required.
7. Inspect both saved files visually for stale UI, missing fonts, clipping,
   broken images, excess blank
   space, and failed images.

## 11. Register rich catalog metadata

Add one object to the root `templates.json`. Follow
[TEMPLATE_SCHEMA.md](TEMPLATE_SCHEMA.md) exactly.

Write specific, useful metadata:

- explain what users can build, not generic marketing claims
- write `description` as at most two normal-length sentences: who the template
  is for and what it does
- keep every `classification.useCases` entry a single lowercase word
  (for example `booking`, not `booking-enquiries`)
- describe meaningful features and interactions
- list at most 4 user-visible features verified in the implementation
- record the actual language, frameworks, styling, data strategy, and deployment
  model under `technology`; keep `technology.frameworks` entries bare framework
  names only (for example `Astro`, `React`) — no versions, qualifiers, or prose
- include accurate categories, use cases, frameworks, runtime, and search terms
- record both image paths and actual dimensions
- generate `<name>-thumbnail-480.webp` and `<name>-thumbnail-960.webp` next to
  the thumbnail PNG (`cwebp -q 82 -m 6 -af -resize <width> 0`) and register
  them under `media.thumbnail.variants`
- add GitHub raw-view URLs for both images and verify each URL returns an image
  after the commit is pushed
- keep strict JSON with no comments or trailing commas

Do not add dropped fields: `repository`, `kind`, `databases`, `license`,
`audienceLevel`, or `status`.

## 12. Final cleanup

Remove:

- unused scaffold assets and components
- duplicate or generated framework and build-tool configs
- duplicate language configs
- `*.tsbuildinfo`
- build output
- obsolete lint tooling
- unused dependencies
- temporary downloads

Ensure `.gitignore` covers `node_modules`, the framework's build and cache
directories, `.env*`, and generated language artifacts such as
`*.tsbuildinfo`.

Finish only after:

- install passes
- lint passes
- build passes
- `npm audit --audit-level=high` passes
- source review found no issues or vulnerabilities
- desktop and mobile checks pass
- screenshots exist and were inspected
- README follows the fixed structure
- `templates.json` is valid and rich
- project tree contains only intentional files

## 13. Hand off and offer publishing

After all checks pass, tell the user the template is complete and summarize the
verification results, including lint, build, audit, and the source security
review. Ask whether they want the changes committed and pushed.
Do not commit or push until the user explicitly confirms.
