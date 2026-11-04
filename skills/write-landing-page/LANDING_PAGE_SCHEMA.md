# Landing-page copy schema

Every template can have a sales page at
`https://www.hostinger.com/applications/<id>`. Its copy lives in
`landing-pages/<id>.json`, separate from the template code, so that marketing
approves copy and engineers approve code.

`schema/landing-page.schema.json` is the machine-readable version of this
file. `.github/scripts/lint-landing-copy.mjs` enforces both on every PR.

## Files

- `landing-pages/<id>.json`: one file per template. `<id>` is a catalog `id`
  from `templates.json`.
- `landing-pages/index.json`: `{ "landingPages": ["<id>", ...] }`, sorted. It
  lists every copy file, because hostinger.com reads the files over
  `raw.githubusercontent.com`, which can't list a directory. Keep it in sync
  by hand; the lint fails when it differs from the directory. There is no
  generated merged file, because bots can't push to `main`.

## Shape

```json
{
  "landingPage": {
    "enabled": false,
    "popular": false,
    "recommended": false,
    "heroTitle": "Plumber and electrician website template",
    "heroDescription": "Launch a one-page site with services, hours, coverage checks and a click-to-call button that brings in local enquiries.",
    "about": "80 to 150 words about who the template is for, what visitors can do on it, and what the owner changes to make it theirs.",
    "features": [
      { "title": "Coverage checker", "description": "Visitors check whether you cover their street or postcode before they call." }
    ],
    "metaTitle": "Plumber Website Template | Hostinger",
    "metaDescription": "140 to 160 characters that say what the template is, who it is for and that it deploys on Hostinger Node.js hosting in a few clicks.",
    "short": "One-page site for local trades with click-to-call.",
    "long": "One to three sentences for listings and previews.",
    "kbUrl": null
  }
}
```

| Field | Rule when `enabled` is `true` |
| --- | --- |
| `enabled` | Publishes the page. Only the marketing/SEO code owner sets it to `true`. |
| `popular` | Shows the app among popular apps in the `/applications` listing. |
| `recommended` | Puts the app first in "other apps" recommendations. |
| `heroTitle` | 10–70 characters. |
| `heroDescription` | 50–220 characters. |
| `about` | 80–150 words. |
| `features` | 4–8 items. `title` 3–60 characters, `description` 20–220 characters. |
| `metaTitle` | 10–59 characters. |
| `metaDescription` | 140–160 characters. |
| `short` | 20–120 characters. Listing card line. |
| `long` | 50–400 characters. Listing and preview description. |
| `kbUrl` | `null`, or an `https://www.hostinger.com/support/...` article about deploying the template. |

A draft (`enabled: false`) may leave text fields empty, but its JSON must
still match the shape.

## Text rules

These apply to every text field, drafts included:

- No URLs, email addresses or domains. Link through `kbUrl` only.
- No HTML or Markdown.
- No `{`, `}`, `@` or `|`. hostinger.com renders the copy through vue-i18n,
  where these characters start placeholders, linked messages and plural forms.
- No credentials, tokens or keys.
- Plain, specific language about what the template does. No claims the
  template can't back up: if it uses sample data, don't promise live
  bookings or payments.

## Publishing and removal

- A page is published when its file has `enabled: true`, the template is in
  `templates.json` with a `demoUrl`, and the id isn't in `retired`. Merging
  such a change to `main` notifies hostinger.com, which rebuilds
  `/applications` and sends the text to translation.
- To remove a published page, set `enabled: false` (or delete the template)
  and, in the same PR, add `{ "id": "<id>", "retiredAt": "YYYY-MM-DD" }` to
  `retired` in `templates.json`. hostinger.com then redirects
  `/applications/<id>` to `/applications`. The lint fails a PR that
  unpublishes a page without retiring it.
- A retired id can't get an enabled page again while it's in `retired`.
  To bring a page back, remove its `retired` entry and enable it in one PR;
  the redirect is dropped on the next build.
- Ids are permanent. Never reuse a retired id for a different template.
