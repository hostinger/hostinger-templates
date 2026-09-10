---
name: deploy-nodejs-templates
description: Deploys static and server-backed Node.js templates from this repository as subdomains of hostingertemplates.com, verifies each live deployment, and updates templates.json demoUrl values. Use when publishing, deploying, or refreshing template demos on Hostinger.
---

# Deploy template demos to Hostinger

Public demos in this repository use
`https://<template-id>.hostingertemplates.com`. Each template is a subdomain of
the `hostingertemplates.com` website. Do not generate `*.hostingersite.com`
temporary domains.

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

Determine the deployment type from the production build:

- **Static:** the configured output directory contains `index.html` and can run
  without a Node.js process.
- **Server-backed Node.js:** production starts from a Node.js entry file, such
  as an Express server compiled to `dist/server.js`.

For static templates, archive the contents of the build output, not the
containing directory. For the usual `dist/` output:

```bash
archive="<template-id>_$(date +%Y%m%d_%H%M%S).zip"
(cd dist && zip -qr "../$archive" .)
```

The archive root must contain `index.html`.

For server-backed Node.js templates, archive application source instead. Exclude
`node_modules`, previews, local archives, and generated build output. Ensure
`package.json` identifies the built production entry with `main` when automatic
detection would otherwise choose the wrong file:

```json
{
  "main": "dist/server.js"
}
```

## 4. Create one public subdomain per template

Reuse the existing `hostingertemplates.com` website on the selected plan. If it
is missing, create that addon website first and wait until it is enabled.

For each template:

1. Create a subdomain of `hostingertemplates.com` whose prefix and directory are
   the template ID.
2. Wait until `<template-id>.hostingertemplates.com` appears as an enabled
   subdomain before uploading.

Create or delete websites and subdomains one at a time. Concurrent Hostinger
mutations can fail with unfinished-action rate limits.

Keep a clear template-to-domain mapping throughout.

## 5. Deploy output

For static output, use the static website deployment tool with:

- domain `https://<template-id>.hostingertemplates.com` (the subdomain, not the
  parent site)
- the template archive path
- archive removal enabled

Upload deployments sequentially. Concurrent credential requests can fail with:

```text
Failed to fetch upload credentials: Request failed with status code 500
```

Treat this as transient after recent website creation. Wait briefly, confirm the
website exists, then retry that deployment once sequentially.

For server-backed Node.js templates, use the JavaScript application deployment
tool with the source archive and archive removal enabled. Confirm its resolved
settings use the intended build script, Node version, application type, and
entry file. Poll the deployment until it reaches `completed`; if it fails, read
the deployment logs, fix the exact cause, rebuild, and redeploy before attaching
the catalog URL.

## 6. Verify live websites

Wait for accepted deployments to finish, then verify
`https://<template-id>.hostingertemplates.com` returns the expected template
content over HTTPS with HTTP 200.

For multi-page templates, also request at least one non-home direct URL. Do not
mark deployment complete when only the homepage works.

New aliases may briefly show Hostinger's browser-check page while DNS, CDN, and
TLS provisioning settle. Confirm the alias exists, wait briefly, and retry once.
Report a persistent failure without writing its `demoUrl`.

## 7. Update the catalog

Set each successfully verified catalog entry to its public custom subdomain:

```json
"demoUrl": "https://<template-id>.hostingertemplates.com"
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
- template names and clickable public URLs
- build and live verification results
- catalog update status

Do not commit or push unless the user explicitly asks.
