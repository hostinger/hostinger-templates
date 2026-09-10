# Repository creation rules

## Intake gate

- Before any implementation, ask for name, description, tech stack, language,
  and framework.
- Prefer TypeScript when the user does not specify a language.
- Prefer React when the user does not specify a framework.
- When the user explicitly supplies a language or framework, use it instead of
  the defaults and adapt the project conventions accordingly.
- Ask whether the app should be single-page or multi-page when scope is unclear.
- Do not create files or install packages until required answers are available.

## Project placement

- Put each project under `templates/<id>/`.
- Use one unique lowercase kebab-case ID for its directory and catalog entry.
- Never put project source directly in the collection root or in `skills/`.

## Stack defaults and requirements

- Default to React, TypeScript, and Vite.
- Treat an explicitly requested language, framework, or build tool as
  authoritative.
- Do not use Gatsby. Prefer Vite, Astro, Next.js, Nuxt, or SvelteKit.
- Use npm and commit `package-lock.json`.
- Use explicit dependency ranges and declare the supported Node.js version in
  `engines`.
- Include an explicit license for template reuse.
- `npm install`, `npm run lint`, and `npm run build` must succeed.
- `npm audit --audit-level=high` must pass. Use `overrides` only for a
  parent pin you document in the project README.
- Use ESLint. Do not install or configure Oxlint.

## Security and issue gate

Do not mark a template complete, register it in `templates.json`, or offer to
commit until the template's own code is free of issues and vulnerabilities.

- Re-run install, lint, build, and `npm audit --audit-level=high` after the
  last code change. A passing run from earlier in the session is not enough.
- Review the template source, not only dependency audit output. Look for
  secrets, credentials, committed `.env` files, `eval` / `new Function`,
  unsanitized HTML, unsafe URL or query handling, and other exploitable sinks.
- Fix every finding before screenshots or catalog registration. If a finding
  cannot be fixed, stop and report it instead of finishing.

## Configuration hygiene

- Keep one intentional configuration file per tool.
- For TypeScript projects, keep one `tsconfig.json` and run the framework's
  supported type check during `npm run build`.
- For Vite projects, keep one `vite.config.ts`.
- Do not leave generated duplicate configs, `*.tsbuildinfo`, unused scaffold
  files, or build output.
- Ignore `node_modules`, framework build/cache directories, local environment
  files, and generated language artifacts.
- Never commit symlinks: gitignore output directories WITHOUT a trailing slash
  (`dist`, not `dist/` — the slash form does not match a symlink, which is how
  a machine-specific `dist` link once reached the repo and broke deploys).
  Before publishing, verify `git ls-files -s | awk '$1 == "120000"'` prints
  nothing.
- Static builds must leave the deployable site in a REAL directory (no
  symlinks) that the template's `deploy.outputDirectory` (or the framework
  default `dist`) points at. Nuxt is the exception: it must build as SSR
  (`nuxt build`) because the hosting API requires an entry file for nuxt.

## Code quality

- Keep the framework's root app, layout, or page files focused on composition.
- Separate components, content, icons, shared models or types, and styles into
  dedicated source directories where the framework supports them.
- Keep repeated business content and configuration in structured data.
- Keep user-owned copy and business details in one obvious content location;
  keep calculations and functions in typed source modules.
- Do not duplicate editable copy across pages, components, and styles.
- Keep state close to its owning feature.
- Prefer small named components over one large page component.
- Use semantic HTML and accessible controls.
- Keep common copy, links, images, theme values, and configuration easy to
  personalize without editing component logic.
- Keep text and locale-sensitive formatting centralized. Add an i18n library
  only when localization is part of the brief.
- Never present local demo logic as a live availability, coverage, inventory,
  payment, or booking check. Use a clear enquiry fallback for unknown results.
- Build `tel:` and `mailto:` targets from the same contact data shown on screen.
- When URL state is requested, hydrate valid input values from the URL and keep
  it synchronized as the user changes them.
- Keep print and screenshot summaries useful without controls or page chrome.
- Do not add secrets, credentials, generated dependencies, or build output.

## Design quality

- Create original topic-specific branding and styling for every template.
- Do not reuse the same visual direction between templates.
- Build a complete, polished page—not a generic starter or sparse wireframe.
- Consider multiple pages when the brief contains distinct user journeys.
- Use relevant, high-quality Pexels photos where photography suits the topic.
- Download images into the project instead of hotlinking.
- Keep provider names and source URLs out of application code. Record required
  provenance in project documentation.
- Support desktop, tablet, and mobile without horizontal overflow or clipped
  content.
- Verify a modern mobile viewport at `390 × 844` and a `320px` narrow viewport.
- Keep touch targets, typography, spacing, forms, and calls to action usable on
  mobile.

## Documentation

- Include a project `README.md`.
- Follow `README_TEMPLATE.md` exactly, including heading order.
- Include the mandatory `Personalizing` section with exact file paths.

## Images

- Create a `preview/` directory in every project.
- Capture images only after final code and styles are ready.
- Use the same `1440 × 900` landscape viewport for every template.
- Save `<id>-thumbnail.png` from that viewport.
- Save `<id>-homepage.png` using `fullPage: true` to include the whole page.
- Set thumbnail `source` to `"viewport"` and dimensions to `1440 × 900`.
- Set preview `source` to `"fullPage"`, width to `1440`, and height to the
  actual saved image height.
- Add a GitHub `blob/main/...?...raw=true` URL for each catalog image.
- Push the image before verification, then confirm each URL returns an image
  response rather than a GitHub error page.
- Inspect saved images before catalog registration.

## Catalog

- Add every finished project to the root `templates.json`.
- Follow `TEMPLATE_SCHEMA.md` and write rich, specific metadata.
- Make every catalog `description` at most two normal-length sentences,
  separated by `\n\n`; do not reuse the short `summary`.
- Add at most 4 implementation-backed `features` and `technology` metadata sourced
  from the package, README, and build configuration.
- Keep media paths relative to the collection root.
- Keep facts accurate. Use `null` for unknown optional scalar values and empty
  arrays for unknown list values.
- Keep `templates.json` strict JSON: no comments or trailing commas.
- Add an entry only after install, lint, build, `npm audit --audit-level=high`,
  source security review, browser checks, and image inspection pass.
- For multi-page templates, directly load every built preview route. Add static
  host fallback handling or prerender routes when client routing needs it.
