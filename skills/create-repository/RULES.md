# Repository creation rules

## Intake gate

- Before any implementation, ask for name, description, tech stack, language,
  and framework.
- Explicitly confirm TypeScript; all application code must use TypeScript.
- Ask whether the app should be single-page or multi-page when scope is unclear.
- Do not create files or install packages until required answers are available.

## Project placement

- Put each project under `templates/<id>/`.
- Use one unique lowercase kebab-case ID for its directory and catalog entry.
- Never put project source directly in the collection root or in `skills/`.

## Required stack

- Use React and TypeScript.
- Use Vite for development and production builds.
- Use npm and commit `package-lock.json`.
- `npm install`, `npm run lint`, and `npm run build` must succeed.
- Use ESLint. Do not install or configure Oxlint.

## Configuration hygiene

- Keep exactly one `tsconfig.json`.
- Keep exactly one `vite.config.ts`.
- Use `tsc --noEmit` for type checking.
- Do not leave generated `vite.config.js`, `vite.config.d.ts`,
  `*.tsbuildinfo`, duplicate configs, unused scaffold files, or build output.
- Ignore `node_modules`, `dist`, local environment files, and `*.tsbuildinfo`.

## Code quality

- Keep `App.tsx` focused on page composition.
- Separate components, constants, icons, shared types, and styles into dedicated
  `src/` directories.
- Keep repeated business content and configuration in typed constants.
- Keep state close to its owning feature.
- Prefer small named components over one large page component.
- Use semantic HTML and accessible controls.
- Keep common copy, links, images, theme values, and configuration easy to
  personalize without editing component logic.
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
- Make every catalog `description` at least three substantial paragraphs,
  separated by `\n\n`; do not reuse the short `summary`.
- Keep media paths relative to the collection root.
- Keep facts accurate. Use `null` for unknown optional scalar values and empty
  arrays for unknown list values.
- Keep `templates.json` strict JSON: no comments or trailing commas.
- Add an entry only after install, lint, build, browser checks, and image
  inspection pass.
