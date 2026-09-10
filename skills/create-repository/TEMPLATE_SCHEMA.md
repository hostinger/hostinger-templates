# Template catalog schema

`templates.json` contains one root object with a `templates` array. Every
finished project contributes one entry.

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
  "demoUrl": null,
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
- `demoUrl` stays `null` until a real public deployment exists.
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
  `outputDirectory` statically). Static Next.js uses `out`, SvelteKit `build`,
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
