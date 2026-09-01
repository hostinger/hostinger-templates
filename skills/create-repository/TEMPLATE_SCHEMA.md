# Template catalog schema

`templates.json` contains one root object with a `templates` array. Every
finished project contributes one entry.

## Required shape

```json
{
  "id": "lowercase-kebab-case",
  "name": "Human-readable name",
  "summary": "One concise catalog-card sentence.",
  "description": "Paragraph one explains the product, audience, and problem it solves.\n\nParagraph two describes the core journey, features, and interactions in concrete terms.\n\nParagraph three explains personalization, design quality, and technical strengths.",
  "bucket": "Supplied bucket",
  "category": "Supplied category",
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
  "media": {
    "thumbnail": {
      "path": "templates/<id>/preview/<id>-thumbnail.png",
      "url": "https://github.com/hostinger/hostinger-templates/blob/main/templates/<id>/preview/<id>-thumbnail.png?raw=true",
      "source": "viewport",
      "width": 1440,
      "height": 900,
      "aspectRatio": "16:10"
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
- `description` is a rich multi-paragraph overview, not short card copy.
- Write at least three paragraphs separated by `\n\n`.
- Cover the audience and problem, customer journey and features, then
  personalization and technical strengths.
- `bucket`, `category`, and `whoItsFor` preserve the supplied brief.
- `demoUrl` stays `null` until a real public deployment exists.
- `categories` support browsing; use stable lowercase kebab-case terms.
- `useCases` describe outcomes, not implementation details.
- `frameworks` lists only frameworks and build tools actually used.
- `features` contains 6–12 meaningful user-facing capabilities verified against
  the implementation.
- Feature IDs are unique within the entry.
- `technology` reflects `package.json`, source structure, and build config. Do
  not list libraries, persistence, services, or deployment behavior that are
  not present.
- Runtime versions match `package.json` and README requirements.
- Media paths are relative to the collection root and point to existing files.
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
