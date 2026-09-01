# Node.js repositories

Collection of runnable Node.js projects. Every project lives under
`templates/`:

```text
hostinger-templates/
├── templates/
│   └── <repository-id>/
├── skills/
└── templates.json
```

## Repository catalog

`templates.json` is the source of truth for projects in this collection. Its
`templates` array starts empty. Add one entry when a project is created.

Each entry can contain these fields:

- `id` and `name`
- `summary` and `description`
- `bucket`, `category`, and `whoItsFor`
- `demoUrl`
- `classification`: categories, use cases, and frameworks
- `features`: 6–12 verified feature IDs, names, and descriptions
- `technology`: languages, frameworks, styling, data strategy, and deployment
- `compatibility`: runtimes and supported versions
- `media`: thumbnail and preview metadata
- `searchTerms`

Project paths use `templates/<id>/`, where the directory name matches the
catalog `id`.

## Adding a project

Follow `skills/create-repository/SKILL.md`. It defines the creation workflow;
`skills/create-repository/RULES.md` defines constraints every project must
follow.

## Translations

`templates.json` is the English source of truth for the template summaries, descriptions and category labels shown in hPanel. A scheduled workflow in the hPanel repository (`sync-node-template-translations`) fetches this public catalog daily, pushes the texts to translate.hostinger.io under the `v2.onboarding.node.template.catalog.*` namespace, and the platform AI-translates them into all hPanel languages. Until translations arrive, hPanel renders the catalog English as a fallback.

This repository intentionally has no CI, secrets or runners — it is public because hPanel and the deploy flow clone templates anonymously. After merging a new template, translations land after the next daily sync (or ask an hPanel developer to trigger the workflow manually for a same-day sync).
