import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The compiled app runs from `dist/`, one level below the project root.
 * Views, content and static assets are resolved from the root, so the
 * build needs no copy step — deploy the whole folder and run
 * `node dist/main.js`.
 */
export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
