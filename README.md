# Node.js repositories

Collection of runnable Node.js projects. Every project lives in its own
top-level directory:

```text
nodejs-repos/
├── <repository-id>/
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
- `features`: feature IDs, names, and descriptions
- `compatibility`: runtimes and supported versions
- `media`: thumbnail and preview metadata
- `searchTerms`

Project directory names must match their catalog `id`.

## Adding a project

Follow `skills/create-repository/SKILL.md`. It defines the creation workflow;
`skills/create-repository/RULES.md` defines constraints every project must
follow.

## Unsplash MCP

Project-scoped Unsplash tools are configured in `.cursor/mcp.json`. Export your
Unsplash developer access key before starting Cursor:

```bash
export UNSPLASH_ACCESS_KEY="your-access-key"
```

Restart Cursor after setting the variable. The key is read from the environment
and must never be committed.
