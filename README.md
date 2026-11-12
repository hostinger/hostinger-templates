# Node.js repositories

Collection of runnable Node.js projects. Every project lives under
`templates/`: the ones we build and maintain, and vendored templates, which
are copies of popular public repositories at a pinned commit (see
[Upstream templates](#upstream-templates)):

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
- `source`, only on vendored templates: where the code was copied from (see
  [Upstream templates](#upstream-templates))

The root object also has a `retired` array: ids whose
hostinger.com landing page was removed. `schema/templates.schema.json` validates the whole file on
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
- `validate` also checks every vendored template the PR adds, re-pins or
  edits (`.github/scripts/check-vendored.mjs`): the ref points at the commit,
  the license matches GitHub's, the deployability rules pass at the commit,
  `templates/<id>/` is the upstream tree at the commit with its LICENSE, and
  `dependabot.yml` keeps Dependabot off the folder.

Run the same checks locally:

```bash
cd .github/scripts && npm ci && cd ../..
node .github/scripts/validate-catalog.mjs
node .github/scripts/lint-landing-copy.mjs --base origin/main
```

## Hostinger builds for PRs

GitHub's runners build templates with Node.js 24, but Hostinger builds and
runs them with Node.js 22 under its own runtime, firewall and file
permissions. `template-pr-deploy.yml` therefore deploys every PR's changed
templates to a separate preview hosting account, at
`https://pr-<PR>-<id>.<preview domain>`. It runs the same smoke check as the
demos and posts the `hostinger-build` commit status, along with a sticky PR
comment that has the build time, each route's status, the preview link, and
on failure the build log and Hostinger's analysis.

PR code is untrusted, so the deploy runs from `main` after `Template gate`
and never gives the PR the token:

- The PR's `preview` job only packages each template it built and uploads it
  as an artifact.
- The trusted job recomputes the PR and its changed templates from the head
  SHA through the API. It refuses fork PRs and PRs that also change
  `.github/`, and waits for the `AI Security Scanner` status, which skips
  drafts until they are ready for review.
- It inspects each archive's file list without extracting it (no `..`, no
  absolute paths, no symlinks) and takes the build settings from the head's
  `templates.json`, not from the artifact.
- PRs with no template change get `hostinger-build` = success at once.

Previews are deleted when their PR closes, and a daily sweep deletes the rest
(`template-pr-cleanup.yml`). `hostinger-build-override.yml` lets an org admin
mark the check as passed with a reason when the deploy can't run.

Setup (repository admin):

1. A hosting account used only for previews, on a plan that runs Node.js
   apps, with its own domain. Never use the account that serves
   `hostingertemplates.com`.
2. Protect the preview domain: in its `public_html/.htaccess`, send
   `X-Robots-Tag: noindex` and require HTTP basic auth. Static previews live
   in subdirectories of it and inherit the rules.
3. An environment `template-pr-check` (deployment branches: `main`) with the
   secrets `PREVIEW_HOSTINGER_API_TOKEN` and `PREVIEW_BASIC_AUTH`
   (`user:password`, used by the smoke check) and the variable
   `PREVIEW_PARENT_DOMAIN`. If Dependabot PRs can't read the token, add it as
   a Dependabot secret too.
4. An environment `template-pr-check-override` that requires an org admin's
   approval.
5. The repository variable `PREVIEW_DEPLOYS_ENABLED` = `true`.
   The AI Security Scanner currently skips public repositories
   (`scan_public_repos=False`) and reports this repository as "Not scanned",
   so previews stay off until the security team scans it. The alternative is
   for the team to accept same-repo PRs without a scan by setting
   `PREVIEW_ALLOW_UNSCANNED` = `true`. Only people and bots with write access
   can open those PRs, and fork PRs are never deployed.
6. Once it has proven stable, make `hostinger-build` a required check.

## Popular repositories as templates

`Repository deployability` (`.github/workflows/repo-deployability.yml`)
checks whether public GitHub repositories can run as Node.js apps on Hostinger
web hosting. It rejects agent skills, agents, desktop apps, extensions, CLIs
and libraries, and anything that needs services or runtimes the platform
doesn't offer. Optionally it deploys the ones that pass to the preview
account. The weekly run keeps the **Node.js template candidates** issue up
to date. See [`skills/evaluate-repository/`](skills/evaluate-repository/SKILL.md).

## Upstream templates

Some templates are popular public repositories we offer as they are. They
are vendored: `templates/<id>/` holds a copy of the upstream repository at a
pinned commit, and the catalog entry has a `source` block recording where it
came from (repository, `track: releases` or `branch`, `ref`, full `commit`,
SPDX `license`, optional `directory` and `exclude`). Customers get the copy
in this repository, never the upstream repository directly, so an upstream
push can't change what they deploy without review.

- The copy is byte-identical to the upstream tree at `commit` (same paths,
  blob SHAs and modes), minus `.github/` and the paths in `source.exclude`,
  plus our `preview/` folder with the catalog screenshots. We don't edit
  upstream code; fixes come from upstream. The upstream LICENSE stays at the
  copy's root.
- `check-vendored.mjs` (Template gate `validate`) fetches the upstream
  commit and fails when the copy differs, lists the paths that differ, and
  also checks the pin, license, LICENSE file and rules (see
  [Pull request checks](#pull-request-checks)).
- Vendored templates build, deploy and get PR previews and demos through
  `templates/<id>/` like any other template. The `preview` job gives them
  narrow exceptions: install by the lockfile upstream ships (npm, or
  pnpm/yarn through corepack), skip lint when upstream has no lint script,
  and serve static output or run the Next.js start script when there is no
  preview script.
- Audit policy: vendored templates are audited with their own package
  manager. When the deploy output is static files, high and critical
  production advisories are warnings, because they only run at build time.
  A server-rendered one fails on any high or critical production advisory.
- Dependabot doesn't open PRs for vendored folders: `dependabot.yml` lists
  them in an npm entry that ignores every dependency, so their updates come
  only from upstream syncs. The file is generated from `templates.json`
  (`node .github/scripts/dependabot-config.mjs --write`). `validate-catalog`
  fails when it is out of date, and `check-vendored` when a vendored folder
  isn't excluded.
- `Upstream sync` (`.github/workflows/upstream-sync.yml`) runs every Monday.
  When a template has a newer release or branch commit that passes the pin
  checks, `.github/scripts/upstream-sync.mjs` builds one commit that updates
  `templates/<id>/` and the pin, signed by GitHub, and opens or refreshes the
  PR `upstream-sync/<id>`. Its Template gate and Hostinger preview prove the
  new commit; merging it redeploys the demo. A commit that fails stays
  unmerged and the old copy keeps working. The bot never merges, and stops
  when a sync would upload more than 400 files: import those by hand.
  `node .github/scripts/upstream-sync.mjs check` and
  `push <id> --dry-run` show what it would do without writing to GitHub.

To add one, or to import a sync too large for the bot:

1. Evaluate the repository at the commit you want
   (`node .github/scripts/evaluate-repos.mjs owner/repo@<ref>`) and build it
   locally to capture the screenshots from that commit.
2. Copy the tree with git, not by copying files, so `.gitignore` and
   upstream `.gitattributes` can't change content:

   ```bash
   git fetch --no-tags --depth=1 https://github.com/<owner>/<repo>.git <commit>
   # re-import only: drop the old copy but keep preview/
   git rm -r -q templates/<id> ':!templates/<id>/preview'
   # <commit>:<directory> when source.directory is set
   git read-tree --prefix=templates/<id>/ -u <commit>
   git rm -r -q templates/<id>/.github
   ```

   Remove `source.exclude` paths the same way, then add `preview/`.
3. Add or update the entry with its `source`, regenerate `dependabot.yml`,
   and run `node .github/scripts/check-vendored.mjs --all`. The rules are in
   [TEMPLATE_SCHEMA.md](skills/create-repository/TEMPLATE_SCHEMA.md#upstream-templates).

## Demo deployments

Merging a PR that adds a template (a new `templates/<id>/package.json`)
publishes it to `https://<id>.hostingertemplates.com` through the
`Deploy template demos` workflow. PRs that only change existing templates,
such as Dependabot security groups and dependency bumps, do not deploy.
Vendored templates redeploy on any change, since an upstream sync is the
only way their code changes.
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
  Copy needs the Web Hosting code owner (`@hostinger/wh-devs`) in
  `.github/CODEOWNERS`.
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
