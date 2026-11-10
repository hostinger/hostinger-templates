---
name: evaluate-repository
description: Checks whether a public GitHub repository can run as a Node.js app on Hostinger web hosting before it is considered as a template, statically and optionally with a real deploy to the preview account. Use when asked whether a repository (or the most popular repositories for a topic) could become a Node.js template, or to refresh the candidates issue.
---

# Evaluate a repository as a Node.js template

VPS templates can run almost anything in Docker. Node.js web hosting can't:
it installs with npm, yarn or pnpm on Node.js 18–24, builds, then serves the
output or runs one Node.js process on `PORT`, with MySQL as the only
database. Before a popular repository is turned into a template, check that
it is a web app that fits.

## 1. Static check (safe for any repository)

```bash
GITHUB_TOKEN=$(gh auth token) node .github/scripts/evaluate-repos.mjs owner/repo owner/monorepo:apps/web
GITHUB_TOKEN=$(gh auth token) node .github/scripts/evaluate-repos.mjs --discover --query 'topic:nextjs topic:template stars:>500'
```

It reads repository metadata and files through the GitHub API and never
clones or runs code. `.github/scripts/repo-evaluation/rules.mjs` decides:

- **Not a web app** (rejected): agent skills collections, MCP servers, AI
  agents and computer-use tools, CLIs, libraries, Electron/Tauri desktop
  apps, mobile apps, browser and editor extensions, link lists.
- **Doesn't fit the platform** (rejected): no `package.json`, Bun or Deno
  only, `engines.node` outside 18–24, PostgreSQL, MongoDB, Redis or brokers
  (dependencies, Prisma provider or docker-compose services), headless
  browsers and native system access, monorepos without an app directory.
- **Can't be vendored** (rejected): archived, no push for a year, or no OSI
  license. Copyleft licenses need legal review.
- **Needs review**: secrets in `.env.example`, SQLite, workspaces, no
  lockfile, an unknown framework that starts with `npm start`, or a
  repository over 50 MB.

Frameworks recognised are the ones hPanel's Node.js deploy settings offer
(`DEPLOY_FRAMEWORK_KEYS`): Next.js, Nuxt, SvelteKit, Astro, React Router,
Angular, Gatsby, NestJS, Fastify, Hono, Express, Nitro, Create React App, Vue
CLI, Parcel and Vite.

## 2. Real deploy (preview account)

Run **Repository deployability** from the Actions tab with `deploy` ticked,
or `deploy-candidates.mjs` locally with the preview account's token. Each
repository that passed is archived at the evaluated commit with
`git archive` (nothing from it runs on the runner), inspected like PR
artifacts, deployed to `scan-<owner>-<repo>.<preview domain>`, smoke-checked
(see `skills/deploy-templates`) and deleted again. Hostinger's build log
analysis is included for failures; reproduce on Node.js 22 before trusting
it.

The weekly run (Mondays) discovers popular repositories and keeps the open
**Node.js template candidates** issue up to date. It never deploys on its
own.

## 3. Turning a candidate into a template

A repository that deploys still needs a human decision. Upstream templates
aren't copied into this repository: they get an `upstream` entry in
`templates.json` that pins a commit of the original repository (see
[Upstream templates](../create-repository/TEMPLATE_SCHEMA.md#upstream-templates)).
Before adding one:

- Evaluate it at the exact ref: `node .github/scripts/evaluate-repos.mjs owner/repo@<tag-or-commit>`.
  Prefer `track: releases` when the project publishes releases.
- Build that commit locally. The static rules can't see a broken build: in
  November 2026 fuwari's `main` passed every rule and failed `astro build`
  after a Tailwind patch bump, so it is pinned one commit earlier.
- Audit production dependencies (`npm audit --omit=dev` or
  `pnpm audit --prod`). A server-rendered template with high or critical
  advisories in its runtime is not offered. For static output only the build
  runs them; note them in the PR.
- Check the content: a template, not someone's personal site, with nothing
  a buyer would have to remove first (real names, photos, employers).
- Capture the catalog screenshots from that local build, with reduced motion
  and the page scrolled once so reveal-on-scroll sections render.
