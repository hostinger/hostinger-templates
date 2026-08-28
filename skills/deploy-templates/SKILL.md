---
name: deploy-nodejs-templates
description: Deploys static templates from this repository to separate Hostinger temporary-domain websites, verifies each live deployment, and updates templates.json demoUrl values. Use when publishing, deploying, or refreshing template demos on Hostinger.
---

# Deploy template demos to Hostinger

Deploy each template as a separate website. Never place multiple templates under
paths of one domain.

## 1. Inventory the work

1. Read `templates.json`.
2. List directories under `templates/` that contain `package.json`.
3. Match each directory to exactly one catalog entry by `id`.
4. Determine whether the request covers all templates, only missing
   `demoUrl` values, or named templates.
5. Preserve existing catalog metadata. Deployment changes only `demoUrl`
   unless the user separately requests metadata edits.

Stop if IDs are missing or duplicated.

## 2. Select the hosting plan

Use Hostinger Hosting connector tools.

For a new demo collection:

1. List active hosting orders.
2. Keep Cloud plans.
3. Query websites separately for every candidate order using `order_id` and
   inspect the response `meta.total`. A broad website listing can be paginated
   and is not proof that a plan is empty.
4. Choose an empty Cloud plan. If several are empty, prefer the newest unless
   the user gives another preference.

For additional or refreshed demos, reuse the plan that contains the existing
catalog demo domains. Resolve it by filtering the website list by a known
domain; do not assume a stale order ID.

## 3. Build and archive

For every selected template, run from its directory:

```bash
npm ci
npm run lint
npm run build
```

Do not deploy a failed build.

Archive the contents of the build output, not the containing directory. For
the usual `dist/` output:

```bash
archive="<template-id>_$(date +%Y%m%d_%H%M%S).zip"
(cd dist && zip -qr "../$archive" .)
```

The archive root must contain `index.html`.

## 4. Create one temporary website per template

1. Generate one unique Hostinger free subdomain per template.
2. Create the first website with the selected order ID.
3. If the plan is unused, query available datacenters and pass the first
   recommended `datacenter_code` when creating that first website.
4. Wait until the website appears as enabled in the website list.
5. Create remaining websites on the same order without a datacenter code.
6. Wait until every generated domain appears as enabled before uploading.

Keep a clear template-to-domain mapping throughout.

## 5. Deploy static output

Use the static website deployment tool with:

- the generated domain
- the template archive path
- archive removal enabled

Upload deployments sequentially. Concurrent credential requests can fail with:

```text
Failed to fetch upload credentials: Request failed with status code 500
```

Treat this as transient after recent website creation. Wait briefly, confirm the
website exists, then retry that deployment once sequentially.

## 6. Verify live websites

Wait for accepted deployments to finish, then verify each HTTPS URL returns the
expected template content.

For multi-page templates, also request at least one non-home direct URL. Do not
mark deployment complete when only the homepage works.

If a live page is stale or unavailable, wait briefly and retry once. Report a
persistent failure without writing its `demoUrl`.

## 7. Update the catalog

Set each successfully verified catalog entry:

```json
"demoUrl": "https://generated-domain.hostingersite.com"
```

Then verify:

- `templates.json` parses as JSON
- every template directory has one catalog entry
- every deployed entry has a non-null `demoUrl`
- IDs remain unique
- `git diff --check` passes

Do not rewrite descriptions, features, ordering, or other metadata while adding
deployment URLs.

## 8. Clean up and hand off

Remove generated build directories and any local archives. Keep source files,
lockfiles, previews, and deployed websites.

Report:

- hosting plan used
- template names and clickable live URLs
- build and live verification results
- catalog update status

Do not commit or push unless the user explicitly asks.
