# Engineering Blog

A team engineering blog built for real technical writing: markdown posts with dark syntax-highlighted code blocks and copy buttons, computed reading time, and series navigation that threads multi-part posts together.

## Overview

Engineering Blog is the publishing home of a technical team that writes publicly — postmortems, design writeups, and running-in-production notes. It ships as the blog of Halyard, a fictional webhook-delivery platform, seeded with a two-part series: a postmortem of a retry storm and the design writeup of the pipeline rebuilt afterwards. Replace the config data and the markdown files and it becomes your team's blog.

Every post is a markdown file in `content/posts/`. Dropping a new file in creates its page at `/writing/<filename>/` — frontmatter carries the title, date, author, tags, and an optional series name and part number. Posts that share a series name are threaded together: a crimson line connects them in the index list, and each post carries previous/next series navigation with part labels.

Reading is the product. Prose is set in a serif at a comfortable ~68ch measure, every fenced code block renders on a dark, syntax-highlighted surface with a language label and a copy button that copies the code exactly, and each post shows a reading time computed from its word count. The whole site is statically built — posts are fully readable with JavaScript disabled (the copy buttons are a progressive enhancement).

## Features

- Markdown-driven posts: one file in `content/posts/` per post, each with its own directly loadable page under `/writing/`
- Build-time syntax highlighting for fenced code blocks (TypeScript, SQL, YAML, diff, and every other Prism language) on a dark surface with a language label
- Copy button on every code block that copies the code exactly, with a "Copied" confirmation — added after hydration, absent without JavaScript
- Reading time computed in a typed utility from prose word count plus code-line count, shown in the index list and on every post
- Series support: posts sharing a `series` frontmatter value get part labels, a crimson thread connecting them in the index, and previous/next series navigation on each post
- Index page listing every post with date, tags, reading time, and excerpt, newest first
- About section with the team's authors and roles, driven by config data
- Four-question FAQ with `FAQPage` JSON-LD, plus `BlogPosting` JSON-LD on every post
- Semantic article markup, keyboard-accessible controls, visible focus states, skip link, and reduced-motion support; layouts verified down to a 320px viewport

## Tech stack

- **Language:** TypeScript
- **Framework:** React 19
- **Build tool:** Vite
- **Content:** Markdown files parsed in `src/lib/`, highlighted with Prism
- **Styling:** Plain hand-written CSS with centralized design tokens
- **Linting:** ESLint

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL printed by the development server.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — type-check and create a production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Project structure

```text
content/
└── posts/          # One markdown file per post
src/
├── App.tsx
├── main.tsx
├── components/     # Header, footer, masthead, post list, article body, series nav, FAQ
├── data/           # site.json — every word of site chrome and FAQ copy
├── icons/          # Original SVG wordmark and series-thread marks
├── lib/            # Markdown load + Prism highlight
├── pages/          # Home, post, and not-found routes
├── styles/         # global.css — design tokens and all styling
├── types/          # Shared content types
└── utils/          # Reading time, series navigation, dates, paths
public/
└── favicon.svg
scripts/
└── prerender.mjs   # Copies index.html to each /writing/<slug>/ path
```

## Personalizing

### Content and business data

- `content/posts/*.md` — the posts. Each file's name becomes its URL (`retry-storm-postmortem.md` → `/writing/retry-storm-postmortem/`). Frontmatter fields: `title`, `date` (YYYY-MM-DD), `author` (should match a name in `site.json` to show a role), `tags` (list), and optional `series` + `part` for multi-part writing — posts with the same `series` string are threaded together automatically. Add a post by adding a file; delete the two Halyard posts when you start writing.
- `src/data/site.json` — everything else written on the site: blog name and wordmark words, description and site URL, masthead copy, navigation and footer links, the about section, the author list (name + role), and all FAQ questions and answers (which also feed the `FAQPage` JSON-LD).

### Branding and styles

- `src/styles/global.css` — the Google Fonts import (Newsreader, Source Sans 3, Courier Prime) and every design token sit in the `:root` block at the top: page and zinc surfaces, ink tones, the single crimson accent, hairlines, the dark code-block palette, fonts, the ~68ch reading measure, and page widths. Component rules and the responsive breakpoints (1024px, 900px, 640px, 360px) follow in the same file.
- Reading-time pace lives in `src/utils/readingTime.ts` (`PROSE_WORDS_PER_MINUTE`, `CODE_LINES_PER_MINUTE`).

### Images

There is no photography — the only artwork is original SVG. The pennant wordmark is `src/icons/Wordmark.tsx`, the series-thread marks are `src/icons/ThreadNode.tsx` and `src/icons/ThreadRule.tsx`, and the favicon is `public/favicon.svg`. Edit the SVGs in place; they inherit the accent color from the CSS tokens.

### Routes and features

- `/` is `src/pages/HomePage.tsx`; post pages are `src/pages/PostPage.tsx`, loaded from every markdown file in `src/lib/posts.ts`. The `/writing/` URL prefix lives in `src/utils/paths.ts`.
- Series previous/next resolution is `src/utils/series.ts`; reading time is `src/utils/readingTime.ts`; date formatting is centralized in `src/utils/formatDate.ts`.
- The copy-button enhancement for code blocks lives in `src/components/ArticleBody.tsx`.
- A minimal not-found page is `src/pages/NotFoundPage.tsx`.
- `scripts/prerender.mjs` copies `index.html` to each `/writing/<slug>/` path so those URLs load on a static host.

### Environment variables

This project does not require environment variables.

## Production build

```bash
npm run build
npm run preview
```

Production files are written to `dist/`.

## License

MIT. See `LICENSE`; reuse and adapt this template in personal or commercial
projects.

## Screenshots

- Thumbnail: `preview/engineering-blog-thumbnail.png`
- Full page: `preview/engineering-blog-homepage.png`
