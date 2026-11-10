# Template catalog schema

`templates.json` contains one root object with a `templates` array, a
`retired` array and an optional `upstream` array. Every finished project
contributes one entry to `templates`. `schema/templates.schema.json` is the machine-readable version
of this file, and every PR is validated against it.

```json
{
  "templates": [],
  "upstream": [],
  "retired": [{ "id": "old-template-id", "retiredAt": "2026-11-04" }]
}
```

`retired` lists ids whose hostinger.com landing page was published and then
removed. hostinger.com redirects `/applications/<id>` to `/applications` for
them. Keep it sorted by `id`. See
[LANDING_PAGE_SCHEMA.md](../write-landing-page/LANDING_PAGE_SCHEMA.md) for when
to add an entry.

## Required shape

```json
{
  "id": "lowercase-kebab-case",
  "name": "Human-readable name",
  "summary": "One concise catalog-card sentence.",
  "description": "One sentence explaining the product, audience, and problem it solves. One more sentence covering the core journey or standout capability.",
  "bucket": "Supplied bucket",
  "categories": ["Display category", "Optional second display category"],
  "whoItsFor": "Specific intended user",
  "demoUrl": "https://lowercase-kebab-case.hostingertemplates.com",
  "classification": {
    "categories": [
      "specific-category"
    ],
    "useCases": [
      "specific-use-case"
    ],
    "frameworks": [
      "requested-framework",
      "build-tool-when-applicable"
    ]
  },
  "features": [
    {
      "id": "lowercase-kebab-case",
      "name": "Feature name",
      "description": "Concrete user-visible behavior."
    }
  ],
  "technology": {
    "languages": [
      "TypeScript"
    ],
    "frameworks": [
      "Requested framework"
    ],
    "styling": [
      "Actual styling approach"
    ],
    "data": [
      "Actual persistence or content strategy"
    ],
    "deployment": [
      "Actual build and hosting model"
    ]
  },
  "compatibility": {
    "runtimes": [
      {
        "name": "Node.js",
        "versions": [
          "20+"
        ]
      }
    ]
  },
  "deploy": {
    "buildCommand": "build",
    "outputDirectory": ".output/public",
    "entryFile": ""
  },
  "routes": ["/", "/pricing"],
  "media": {
    "thumbnail": {
      "path": "templates/<id>/preview/<id>-thumbnail.png",
      "url": "https://github.com/hostinger/hostinger-templates/blob/main/templates/<id>/preview/<id>-thumbnail.png?raw=true",
      "source": "viewport",
      "width": 1440,
      "height": 900,
      "aspectRatio": "16:10",
      "variants": [
        { "width": 480, "path": "templates/<id>/preview/<id>-thumbnail-480.webp" },
        { "width": 960, "path": "templates/<id>/preview/<id>-thumbnail-960.webp" }
      ]
    },
    "preview": {
      "path": "templates/<id>/preview/<id>-homepage.png",
      "url": "https://github.com/hostinger/hostinger-templates/blob/main/templates/<id>/preview/<id>-homepage.png?raw=true",
      "source": "fullPage",
      "width": 1440,
      "height": 2800
    }
  },
  "searchTerms": [
    "audience phrase",
    "product type",
    "core task",
    "framework"
  ]
}
```

## Content rules

- `id` matches the `templates/<id>/` project directory exactly.
- `summary` is short enough for a card and does not repeat the name.
- `description` is at most two normal-length sentences: who the template is
  for and what it does.
- `bucket` and `whoItsFor` preserve the supplied brief; `categories` lists the hPanel gallery display categories (SaaS, Business, Documentation, Event, Portfolio, Marketing, Fitness, E-commerce, Hospitality, Blog, Calculator, Dashboard) — a template may appear in several.
- `demoUrl` is `https://<id>.hostingertemplates.com`. The `Deploy template
  demos` workflow publishes it when the PR adding the template is merged; if
  that run fails, fix and rerun it rather than leaving the URL dead.
- `categories` support browsing; use stable lowercase kebab-case terms.
- `useCases` describe outcomes, not implementation details. Every entry is a
  single lowercase word (for example `booking`, `pricing`, `rsvp`).
- `frameworks` lists only frameworks and build tools actually used.
- `technology.frameworks` entries are bare framework names only (for example
  `Astro`, `React`, `Nuxt`) — no versions, qualifiers, or prose.
- `features` contains at most 4 meaningful user-facing capabilities verified against
  the implementation.
- Feature IDs are unique within the entry.
- `technology` reflects `package.json`, source structure, and build config. Do
  not list libraries, persistence, services, or deployment behavior that are
  not present.
- Runtime versions match `package.json` and README requirements.
- `deploy` is REQUIRED whenever the framework's build output differs from the
  hosting platform defaults (static frameworks default to `dist` with no entry
  file; the pipeline runs `node <entryFile>` when one is set, otherwise serves
  `outputDirectory` statically). `deploy.appType` may name a different hosting
  framework preset when the detected one mishandles the template's output —
  static Next.js exports MUST set `"appType": "vite"` (the next pipeline cannot
  serve `output: 'export'` builds: "No output directory found after build").
  Static Next.js uses `out`, SvelteKit `build`,
  static React Router `build/client`, Angular `dist/<project>/browser`; server
  templates set `entryFile` to the compiled server and must listen on
  `process.env.PORT`. `entryFile` is resolved RELATIVE to `outputDirectory`
  (NestJS: `dist` + `main.js`, matching the platform default — omit the deploy
  block; Express/Fastify/Hono keep `outputDirectory` empty so `dist/server.js`
  resolves from the repo root). Never repeat the output directory inside the
  entry path. Nuxt templates MUST build as SSR
  (`nuxt build`, no static nitro preset, no deploy block): the hosting API
  requires an entry file for the nuxt app type, and the detected defaults
  (`.output` + `.output/server/index.mjs`) then work as-is.
- Media paths are relative to the collection root and point to existing files.
- `thumbnail.variants` lists the pre-resized WebP renditions (480 and 960 wide,
  generated with `cwebp -q 82 -m 6 -af -resize <width> 0`); hPanel serves them
  via `srcset`, so both files are required.
- Media URLs use the GitHub `blob/main/...?...raw=true` form and must return the
  image successfully after publishing.
- Preview height records the actual full-page image height; do not copy the
  example value blindly.
- `searchTerms` contains useful synonyms not already obvious from the name.
- `routes` is optional and lists the paths the Hostinger smoke check
  requests after a deploy. Every path starts with `/`. List each top-level
  route of a multi-page app; it defaults to `["/"]`. Write each path the way
  the server answers it without a redirect: static subpages served from
  `<route>/index.html` need the trailing slash (`/areas/`), because Hostinger
  redirects `/areas` to `/areas/` and the smoke check treats redirects as
  failures.
- `id` is permanent. Never reuse an id that appears in `retired`.
- `deploy.nodeVersion` (18, 20, 22 or 24) overrides the Node.js version the
  hosting API detects from the archive. Set it only when the project requires
  a newer version than the detected one (for example `engines.node: ">=24"`).
- Use `null` for an unknown optional scalar and `[]` only when a list genuinely
  has no values.

## Forbidden fields

Do not add:

- `repository`
- `kind`
- `databases`
- `license`
- `audienceLevel`
- `status`

`repository` and `license` are forbidden at the top level only. Upstream
entries record them inside `source` (see below).

## Upstream templates

An `upstream` entry is a popular public repository we deploy as it is, from
the original project, instead of a copy in `templates/`. It has every field of
a `templates` entry plus `source`, and its preview images live in
`upstream/<id>/preview/` (`templates/<id>/` must not exist):

```json
"source": {
  "type": "upstream",
  "repository": "arthelokyo/astrowind",
  "track": "releases",
  "ref": "v1.0.0-beta.65",
  "commit": "8d0090f933b71439c02956f7e8d30d41de804832",
  "license": "MIT"
}
```

- `repository` is the GitHub `owner/repo`. `directory` (optional) is the app's
  folder inside it, for monorepos.
- `track: "releases"` follows the newest non-prerelease GitHub release, and
  `ref` is its tag. Use it when the project publishes releases. Otherwise use
  `track: "branch"` with the branch name as `ref`. Add `"prereleases": true`
  when the project only publishes prereleases (GitHub then has no latest
  release); the newest non-draft release is followed instead.
- `commit` is the full SHA we deploy. Demos, PR previews and purchases all
  deploy this commit, never the moving branch or tag, so an upstream push
  can't change what customers get without review.
- `license` is the SPDX id GitHub reports for the repository. Only permissive
  licenses are allowed (MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause,
  0BSD, Unlicense); the deployed code keeps its own LICENSE file.
- The Template gate re-runs the deployability rules
  (`skills/evaluate-repository`) at `commit` and checks that `ref` resolves to
  it (for releases) or contains it (for branches). The
  weekly `upstream-pins` workflow opens a PR when a newer release or branch
  commit passes the same rules; the PR's Hostinger preview proves it builds.
- Media and copy describe the upstream project at `commit`. Write them from
  the repository, not from its marketing site, and capture the screenshots
  from a build of that commit.
- Nothing reads `upstream` yet: hPanel and hostinger.com list only
  `templates`, so an upstream landing page must stay a draft until they do.
