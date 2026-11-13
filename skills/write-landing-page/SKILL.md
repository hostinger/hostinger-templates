---
name: write-template-landing-page
description: Drafts or updates the hostinger.com/applications/<id> sales-page copy for a template in landing-pages/<id>.json and opens a copy-only PR for the Web Hosting code owner. Use when a template needs a landing page, its copy needs changes, or a page must be published, unpublished or retired.
---

# Write a template landing page

Read [LANDING_PAGE_SCHEMA.md](LANDING_PAGE_SCHEMA.md) first. It defines every
field and rule the lint enforces.

## 1. Gather facts

Read the template's catalog entry in `templates.json`, its
`templates/<id>/README.md`, and its live demo at `demoUrl`. Write only about
behaviour you can see in the code or the demo. Note what the template uses
sample data for, so the copy doesn't promise live bookings, payments or
inventory.

## 2. Draft the copy

Create or edit `landing-pages/<id>.json`:

- `heroTitle`: what the visitor builds, in their words ("Plumber and
  electrician website template"), not the template's brand name alone.
- `heroDescription`: who it is for and the outcome, in one sentence.
- `about`: 80–150 words. Who it's for, the main journeys, what the owner
  edits to make it theirs (point to the template's Personalizing section in
  plain words, not paths), and that it deploys from GitHub on Hostinger
  Node.js hosting.
- `features`: 4–8 user-visible capabilities. Start from the catalog
  `features`, then add ones the demo shows.
- `metaTitle` and `metaDescription`: search intent first, brand last.
- `short` and `long`: listing copy.
- Keep `enabled` as it is. A new file starts with `"enabled": false`.

Add the id to `landing-pages/index.json`, sorted.

## 3. Check

```bash
cd .github/scripts && npm ci && cd ../..
node .github/scripts/validate-catalog.mjs
node .github/scripts/lint-landing-copy.mjs --base origin/main
```

Fix every error. Treat warnings on drafts as the list of what's missing
before the page can be enabled.

## 4. Open a copy-only PR

A copy PR changes only `landing-pages/**`. A code PR never changes
`landing-pages/**`. Code needs one engineering approval; copy needs the
Web Hosting code owner's approval, which `CODEOWNERS` requests
automatically.

- Title: `Copy: <template name> landing page`.
- Body: the demo link, what changed, and anything the reviewer should
  verify (claims, keywords, the `kbUrl`).

## Publishing, unpublishing and retiring

- Publish: the code owner sets `"enabled": true` once the copy is approved.
- Unpublish: set `"enabled": false` and add
  `{ "id": "<id>", "retiredAt": "<today>" }` to `retired` in `templates.json`
  in the same PR (that's the one file outside `landing-pages/` a copy PR may
  touch). hostinger.com redirects the page to `/applications`.
- Re-publish a retired page: remove its `retired` entry and set
  `"enabled": true` in one PR.
