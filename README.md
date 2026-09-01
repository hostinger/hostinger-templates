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

`templates.json` is the English source of truth for the template summaries, descriptions and category labels shown in hPanel. On every push to `main` that changes `templates.json`, the **Push template translations** workflow syncs the full catalog to translate.hostinger.io under the `v2.onboarding.node.template.catalog.*` namespace (brand `hostinger-hpanel-frontend-v2`). The sync is idempotent — unchanged texts are no-ops, while new or edited texts are AI-translated into all hPanel languages. hPanel treats this namespace as externally managed and renders the catalog English as a fallback until translations arrive.

- Requires the `TRANSLATIONS_API_KEY_V2` repository secret.
- Removing a template leaves its keys orphaned on the platform; the workflow logs them for manual cleanup.
- The workflow can also be run manually (workflow_dispatch) to re-sync at any time.
