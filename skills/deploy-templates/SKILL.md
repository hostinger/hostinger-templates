---
name: deploy-nodejs-templates
description: Deploys static and server-backed Node.js templates from this repository to separate Hostinger websites, attaches public template-ID subdomains, verifies each live deployment, and updates templates.json demoUrl values. Use when publishing, deploying, or refreshing template demos on Hostinger.
---

# Deploy template demos to Hostinger

Deploy each template as a separate website. Never place multiple templates under
paths of one domain. Public demos in this repository use
`https://<template-id>.kieciausias-domenas.xyz`; Hostinger temporary domains
remain the hosting origins.

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

## 4. Create one temporary website per template

1. Generate one unique Hostinger free subdomain per template.
2. Create the first website with the selected order ID.
3. If the plan is unused, query available datacenters and pass the first
   recommended `datacenter_code` when creating that first website.
4. Wait until the website appears as enabled in the website list.
5. Create remaining websites on the same order without a datacenter code.
6. Wait until every generated domain appears as enabled before uploading.

Keep a clear template-to-domain mapping throughout.

## 4a. Attach the public demo subdomain

For each created Hostinger website:

1. Add a CNAME record to the `kieciausias-domenas.xyz` DNS zone:
   - name: the exact template ID
   - target: the generated `*.hostingersite.com` origin, with a trailing dot
   - TTL: 300
2. Add `<template-id>.kieciausias-domenas.xyz` as a parked or alias domain on
   that template's Hostinger website.
3. Preserve the generated temporary domain as the website origin. Do not delete
   it or replace the website.
4. Confirm the parked-domain listing maps the public subdomain to the correct
   origin before live verification.

Use `overwrite = true` only for the exact template-ID CNAME records being
managed. Do not overwrite apex, mail, verification, or unrelated DNS records.

## 5. Deploy output

For static output, use the static website deployment tool with:

- the generated domain
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

Wait for accepted deployments to finish, then verify both the temporary origin
and `https://<template-id>.kieciausias-domenas.xyz` return the expected template
content. The public subdomain must return HTTP 200 over HTTPS.

For multi-page templates, also request at least one non-home direct URL. Do not
mark deployment complete when only the homepage works.

New aliases may briefly show Hostinger's browser-check page while DNS, CDN, and
TLS provisioning settle. Confirm the alias exists, wait briefly, and retry once.
Report a persistent failure without writing its `demoUrl`.

## 7. Update the catalog

Set each successfully verified catalog entry to its public custom subdomain:

```json
"demoUrl": "https://<template-id>.kieciausias-domenas.xyz"
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
- template names, clickable public URLs, and their temporary origins
- build and live verification results
- catalog update status

Do not commit or push unless the user explicitly asks.
