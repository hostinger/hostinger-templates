# Node.js repositories

Collection of runnable Node.js projects. Every project lives under
`templates/`:

```text
hostinger-templates/
├── templates/
│   └── <repository-id>/
├── skills/
├── versions/catalog.json
└── templates.json
```

## Repository catalog

`templates.json` is the source of truth for projects in this collection. Its
`templates` array lists every finished project. Add one entry when a project
is created.

Each entry can contain these fields:

- `id` and `name`
- `summary` and `description`
- `bucket`, `categories`, and `whoItsFor`
- `demoUrl`
- `classification`: categories, use cases, and frameworks
- `features`: at most 4 verified feature IDs, names, and descriptions
- `technology`: languages, frameworks, styling, data strategy, and deployment
- `compatibility`: runtimes and supported versions
- `media`: thumbnail and preview metadata
- `searchTerms`
- `deploy` (when the build output differs from the hosting defaults) and
  `routes` (paths the smoke check requests, default `/`)

The root object also has a `retired` array: ids whose hostinger.com landing
page was removed. `schema/templates.schema.json` validates the whole file on
every PR.

Project paths use `templates/<id>/`, where the directory name matches the
catalog `id`.

## Adding a project

Follow `skills/create-repository/SKILL.md`. It defines the creation workflow;
`skills/create-repository/RULES.md` defines constraints every project must
follow.

## Pull request checks

`Template gate` (`.github/workflows/template-gate.yml`) runs on every PR. Its
final `template-gate` job is the one to require in the ruleset; it passes when
every other job passed or didn't apply:

- `validate`: `templates.json` and `landing-pages/*.json` against
  `schema/*.schema.json`, then the copy lint
  (`.github/scripts/lint-landing-copy.mjs`): the landing-page copy rules, the
  index, `retired`, unpublishing without retiring, and id collisions with
  VPS applications on hostinger.com.
- `preview (<id>)`: install, lint, build, audit, health check and screenshot
  comparison for each changed template.

Run the same checks locally:

```bash
cd .github/scripts && npm ci && cd ../..
node .github/scripts/validate-catalog.mjs
node .github/scripts/lint-landing-copy.mjs --base origin/main
```

## Demo deployments

Merging a PR that adds a template (a new `templates/<id>/package.json`)
publishes it to `https://<id>.hostingertemplates.com` through the
`Deploy template demos` workflow. PRs that only change existing templates,
such as Dependabot security groups and dependency bumps, do not deploy.
To redeploy existing demos, run the workflow from the Actions tab with their
template IDs.

The workflow needs a Hostinger API token for the account that owns
`hostingertemplates.com`, stored as the `HOSTINGER_API_TOKEN` secret of the
`template-demos` environment (deployment branches: `main` only).
`skills/deploy-templates/SKILL.md` covers redeploys, failed runs, and the
manual fallback.

## Landing pages on hostinger.com

A template can have a sales page at
`https://www.hostinger.com/applications/<id>` with a description, features,
a pricing table and checkout. Its copy lives in `landing-pages/<id>.json`,
listed in `landing-pages/index.json`.
[`skills/write-landing-page/`](skills/write-landing-page/SKILL.md) covers the
format and the workflow.

- Code PRs never change `landing-pages/**`, and copy PRs change nothing else
  (except a `retired` entry when unpublishing). Code needs one approval.
  Copy needs the marketing/SEO code owner in `.github/CODEOWNERS`.
- A page is published when its file has `"enabled": true` and the template
  has a working demo. On merge, `catalog-published.yml` checks the demos and
  sends a `node-templates-updated` event to `hostinger/hwebsites-frontend`,
  which rebuilds `/applications` from the catalog.
- To unpublish, set `"enabled": false` and add the id to `retired` in the
  same PR. The id then redirects to `/applications`.

`catalog-published.yml` mints a HostingerBot token (`HOSTINGERBOT_APP_ID`,
`HOSTINGERBOT_PRIVATE_KEY`) scoped to `hwebsites-frontend`. Set the optional
`TEMPLATES_SLACK_WEBHOOK_URL` secret to get enabled pages with a broken demo
in Slack; without it they're reported as workflow warnings.

## Bumping dependencies

Templates stay standalone (own `package.json` and lockfile). Shared pins live
in `versions/catalog.json`. To move a package across every template on the
same major:

```bash
npm run bump -- nuxt 4.5.1
```

Different majors are skipped unless you pass `--major`. Use `--dry-run` to
preview. Update `templates.json` compatibility and README prerequisites by
hand when `engines` change. Dependabot still opens grouped security PRs;
this command is for catalog-led bumps Dependabot will not fan out (same
advisory, other directories).

Dependabot alerts were raised only when a push to `main` changed the
dependency graph, so advisories published between pushes went unnoticed.
`.github/workflows/dependency-graph-refresh.yml` submits the npm lockfile
dependencies for `templates/` every day at 04:47 UTC, so new advisories turn
into alerts and security PRs without a push. It also runs on every push to
`main` that changes a lockfile: the submitted snapshot takes precedence over
GitHub's own lockfile parse, so without a fresh snapshot, alerts fixed by a
merge would stay open until the next daily run.

## Translations

Template summaries, descriptions and category labels are shown in hPanel in English, straight from `templates.json` — there is no translation pipeline for the v1 release.
