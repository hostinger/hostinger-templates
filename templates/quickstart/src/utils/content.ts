import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { ProjectContent, SiteContent } from '../types/content.js';

/** Reads the committed site content. `rootDir` is the project root. */
export function loadSiteContent(rootDir: string): SiteContent {
  const filePath = path.join(rootDir, 'src', 'data', 'site.json');
  return JSON.parse(readFileSync(filePath, 'utf8')) as SiteContent;
}

/**
 * Resolves nav/footer link tokens against the project record, so the
 * repository and docs URLs are written once in `site.json`.
 */
export function resolveHref(project: ProjectContent, href: string): string {
  if (href === '$repo') return project.repoUrl;
  if (href === '$docs') return project.docsUrl;
  if (href === '$issues') return `${project.repoUrl}/issues`;
  return href;
}

/** True for links that leave the page (used to add rel/target safely). */
export function isExternalHref(resolvedHref: string): boolean {
  return resolvedHref.startsWith('http://') || resolvedHref.startsWith('https://');
}
