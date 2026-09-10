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

Template summaries, descriptions and category labels are shown in hPanel in English, straight from `templates.json` — there is no translation pipeline for the v1 release.
