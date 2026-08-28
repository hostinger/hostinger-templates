import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { SiteContent, TrustContent } from '../types/content.js';

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function loadSiteContent(rootDir: string): SiteContent {
  const site = readJson<SiteContent>(
    path.join(rootDir, 'src', 'data', 'site.json'),
  );

  if (!EMAIL_SHAPE.test(site.securityContact.email)) {
    throw new Error(
      `securityContact.email in site.json ("${site.securityContact.email}") is not a usable email address. The disclosure fallback builds its mailto link from it.`,
    );
  }

  return site;
}

/**
 * Loads trust.json and fails fast with a clear message when an edit breaks an
 * assumption the disclosure flow relies on.
 */
export function loadTrustContent(rootDir: string): TrustContent {
  const trust = readJson<TrustContent>(
    path.join(rootDir, 'src', 'data', 'trust.json'),
  );

  if (trust.disclosure.form.categories.length === 0) {
    throw new Error(
      'trust.json needs at least one disclosure form category so the report form can be submitted.',
    );
  }

  const seenCategoryIds = new Set<string>();
  for (const category of trust.disclosure.form.categories) {
    if (seenCategoryIds.has(category.id)) {
      throw new Error(
        `Duplicate disclosure category id "${category.id}" in trust.json.`,
      );
    }
    seenCategoryIds.add(category.id);
  }

  if (trust.faqs.items.length === 0) {
    throw new Error(
      'trust.json needs at least one FAQ entry — the FAQ section and its JSON-LD are rendered from it.',
    );
  }

  return trust;
}
