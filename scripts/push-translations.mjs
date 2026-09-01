/**
 * Push template catalog texts to translate.hostinger.io so hPanel can render
 * them in every supported language.
 *
 * Source of truth: templates.json in this repository. Each template maps to
 *   v2.onboarding.node.template.catalog.<id>.summary
 *   v2.onboarding.node.template.catalog.<id>.description
 * and each distinct category to
 *   v2.onboarding.node.template.catalog.category.<category-slug>
 *
 * The namespace is registered as externally managed in hpanel
 * (tools/i18n/managedPrefixes.ts), so hpanel never pushes or deletes these
 * keys itself. New messages are AI-translated by the platform; hPanel shows
 * the catalog English as a fallback until translations arrive.
 *
 * The full catalog is pushed on every run: the sync endpoint is idempotent
 * and reports created/updated/unchanged per key, so re-pushing unchanged
 * bodies is a no-op. This deliberately avoids diff-based pushing, which
 * silently misses messages when several commits land in one push. The
 * previous catalog revision (BASE_SHA, falling back to HEAD^) is only used
 * to warn about keys orphaned by removed templates.
 *
 * Pass --dry-run to print without calling the API. Requires
 * TRANSLATIONS_API_KEY_V2 in the environment (never logged).
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const TRANSLATE_HOST = 'https://translate.hostinger.io';
const BRAND = 'hostinger-hpanel-frontend-v2';
const SLUG_PREFIX = 'v2.onboarding.node.template.catalog.';
const SYNC_TAGS = ['standard'];
const SYNC_AUTO_TRANSLATE_SERVICE = 'ai';
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1000;
const FETCH_TIMEOUT_MS = 30000;
const CATALOG_PATH = 'templates.json';
const EMPTY_SHA = '0000000000000000000000000000000000000000';
const VALID_STATUSES = new Set(['created', 'updated', 'unchanged']);

const dryRun = process.argv.includes('--dry-run');

const toCategorySlugPart = (category) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, '.');

const buildMessages = (catalog) => {
  const messages = {};
  const invalidTemplates = [];

  for (const template of catalog.templates ?? []) {
    const { id, summary, description, category } = template;

    if (!id || !summary || !description || !category) {
      invalidTemplates.push(id ?? JSON.stringify(template).slice(0, 100));
      continue;
    }

    messages[`${SLUG_PREFIX}${id}.summary`] = summary;
    messages[`${SLUG_PREFIX}${id}.description`] = description;
    messages[`${SLUG_PREFIX}category.${toCategorySlugPart(category)}`] =
      category;
  }

  return { messages, invalidTemplates };
};

const readCatalogAt = (ref) => {
  if (!ref || ref === EMPTY_SHA) return null;

  try {
    const raw = execSync(`git show ${ref}:${CATALOG_PATH}`, {
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 64 * 1024 * 1024,
    }).toString();

    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const warnAboutOrphanedKeys = (currentMessages) => {
  const previousCatalog =
    readCatalogAt(process.env.BASE_SHA) ?? readCatalogAt('HEAD^');

  if (!previousCatalog) return;

  const { messages: previousMessages } = buildMessages(previousCatalog);
  const removed = Object.keys(previousMessages).filter(
    (slug) => !(slug in currentMessages),
  );

  if (removed.length === 0) return;

  console.warn(
    `WARNING: ${removed.length} key(s) no longer exist in the catalog and are now orphaned on translate.hostinger.io (clean up manually):`,
  );
  removed.forEach((slug) => console.warn(`  - ${slug}`));
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, init) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const assertSyncResponse = (rawBody, slugs) => {
  let body;

  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new Error(`Invalid JSON response: ${rawBody}`);
  }

  const result = body?.result;

  if (
    !result ||
    typeof result !== 'object' ||
    !result.results ||
    typeof result.results !== 'object' ||
    !Array.isArray(body.errors)
  ) {
    throw new Error(`Unexpected response shape: ${rawBody}`);
  }

  if (body.errors.length > 0) {
    throw new Error(`Sync returned errors: ${body.errors.join('; ')}`);
  }

  for (const slug of slugs) {
    const status = result.results[slug]?.status;

    if (!VALID_STATUSES.has(status)) {
      throw new Error(`Missing or invalid status for ${slug}: ${rawBody}`);
    }
  }

  return body;
};

const syncSourceDictionary = async (messages, apiKey, bundleKey) => {
  const slugs = Object.keys(messages);
  const requestBody = JSON.stringify({
    bundle_key: bundleKey,
    messages,
    tags: SYNC_TAGS,
    auto_translate_service: SYNC_AUTO_TRANSLATE_SERVICE,
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response;
    let rawBody;

    try {
      response = await fetchWithTimeout(
        `${TRANSLATE_HOST}/api/v2/brands/${BRAND}/sync-source-dictionary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey,
            Accept: 'application/json',
          },
          body: requestBody,
        },
      );
      rawBody = await response.text();
    } catch (error) {
      if (attempt < MAX_ATTEMPTS) {
        console.warn(
          `Request failed (${error.message}). Retrying (${attempt + 1}/${MAX_ATTEMPTS})...`,
        );
        await sleep(RETRY_BASE_DELAY_MS * attempt);
        continue;
      }

      throw error;
    }

    if (!response.ok) {
      const message = `sync-source-dictionary failed: ${response.status} ${response.statusText} — ${rawBody}`;

      if (response.status >= 500 && attempt < MAX_ATTEMPTS) {
        console.warn(
          `${message}. Retrying (${attempt + 1}/${MAX_ATTEMPTS})...`,
        );
        await sleep(RETRY_BASE_DELAY_MS * attempt);
        continue;
      }

      throw new Error(message);
    }

    return assertSyncResponse(rawBody, slugs);
  }

  throw new Error('Retry loop exhausted unexpectedly.');
};

const main = async () => {
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
  const { messages, invalidTemplates } = buildMessages(catalog);
  const slugs = Object.keys(messages);

  if (invalidTemplates.length > 0) {
    console.error(
      'Templates missing id, summary, description or category:',
      invalidTemplates.join(', '),
    );
    process.exit(1);
  }

  if (slugs.length === 0) {
    console.error('The catalog produced no translation messages.');
    process.exit(1);
  }

  warnAboutOrphanedKeys(messages);

  if (dryRun) {
    console.log(`DRY RUN: would push ${slugs.length} message(s):`);
    slugs.forEach((slug) => console.log(`  - ${slug}`));

    return;
  }

  const apiKey = process.env.TRANSLATIONS_API_KEY_V2;

  if (!apiKey) {
    console.error('TRANSLATIONS_API_KEY_V2 is missing.');
    process.exit(1);
  }

  const bundleKey =
    process.env.TRANSLATION_SYNC_BUNDLE_KEY ?? 'hostinger-templates:main';

  console.log(`Pushing ${slugs.length} catalog message(s)...`);

  const response = await syncSourceDictionary(messages, apiKey, bundleKey);
  const byStatus = { created: [], updated: [], unchanged: [] };

  for (const slug of slugs) {
    byStatus[response.result.results[slug].status].push(slug);
  }

  console.log(
    `Synced ${slugs.length} message(s): ${byStatus.created.length} created, ${byStatus.updated.length} updated, ${byStatus.unchanged.length} unchanged (bundle ${response.result.bundle_id ?? 'none'})`,
  );
  [...byStatus.created, ...byStatus.updated].forEach((slug) =>
    console.log(`  ${byStatus.created.includes(slug) ? '+' : '~'} ${slug}`),
  );
};

main().catch((error) => {
  console.error('push-translations failed:', error);
  process.exit(1);
});
