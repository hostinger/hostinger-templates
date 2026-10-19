import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { RouteRecord, SiteContent } from '../types/content.js';

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

export function loadSiteContent(rootDir: string): SiteContent {
  return readJson<SiteContent>(path.join(rootDir, 'src', 'data', 'site.json'));
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Loads the route book and fails fast with a clear message when an edit to
 * `src/data/routes.json` breaks an assumption the app relies on.
 */
export function loadRoutes(rootDir: string): RouteRecord[] {
  const routes = readJson<RouteRecord[]>(
    path.join(rootDir, 'src', 'data', 'routes.json'),
  );
  const seenSlugs = new Set<string>();

  for (const route of routes) {
    if (!SLUG_PATTERN.test(route.slug)) {
      throw new Error(
        `Route "${route.name}" has an invalid slug "${route.slug}". Use lowercase letters, numbers and hyphens.`,
      );
    }
    if (seenSlugs.has(route.slug)) {
      throw new Error(`Duplicate route slug "${route.slug}" in routes.json.`);
    }
    seenSlugs.add(route.slug);

    if (route.profile.length < 2) {
      throw new Error(
        `Route "${route.name}" needs at least two elevation profile points.`,
      );
    }
  }

  return routes;
}
