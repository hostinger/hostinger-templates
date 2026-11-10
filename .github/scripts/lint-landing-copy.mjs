import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const APPLICATIONS_LISTING_URL = 'https://www.hostinger.com/applications';
const MIN_EXPECTED_DOCKER_APPLICATIONS = 100;

// Copy rules for enabled pages; skills/write-landing-page/LANDING_PAGE_SCHEMA.md.
const CHARACTER_LIMITS = {
  heroTitle: [10, 70],
  heroDescription: [50, 220],
  metaTitle: [10, 59],
  metaDescription: [140, 160],
  short: [20, 120],
  long: [50, 400],
};
const ABOUT_WORDS = [80, 150];
const FEATURE_COUNT = [4, 8];
const FEATURE_TITLE_CHARACTERS = [3, 60];
const FEATURE_DESCRIPTION_CHARACTERS = [20, 220];

const TEXT_RULES = [
  [/https?:\/\/|\bwww\./i, 'contains a URL'],
  [/\b[a-z0-9-]+\.(com|net|org|io|dev|app|co|ai|lt|eu)\b/i, 'contains a domain name'],
  [/[<>`]|\*\*|\]\(/, 'contains HTML or Markdown'],
  [/[{}@|]/, 'contains { } @ or |, which break the translation message format'],
  [
    /\b(api[_-]?key|secret|password|passwd|token|bearer)\s*[:=]|\b(sk|pk|rk)_(live|test)_[A-Za-z0-9]{8,}|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
    'looks like a credential',
  ],
];

const args = process.argv.slice(2);
const base = argValue('--base');
const offline = args.includes('--offline');

const errors = [];
const warnings = [];

const catalog = readJson('templates.json');
const templates = catalog.templates ?? [];
const templateIds = templates.map((template) => template.id);
const upstreamTemplates = catalog.upstream ?? [];
const upstreamIds = new Set(upstreamTemplates.map((template) => template.id));
const templatesById = new Map([...templates, ...upstreamTemplates].map((template) => [template.id, template]));
const retired = catalog.retired ?? [];
const retiredIds = new Set(retired.map((entry) => entry.id));

checkTemplateIds();
checkRetired();

const pages = readLandingPages();
const enabledIds = new Set(pages.filter((page) => page.data?.landingPage?.enabled === true).map((page) => page.id));

for (const page of pages) {
  checkPage(page);
}

if (base) {
  await checkAgainstBase(base);
}

for (const warning of warnings) {
  console.log(`::warning file=${warning.file}::${warning.message}`);
}
for (const error of errors) {
  console.log(`::error file=${error.file}::${error.message}`);
}

console.log(
  `\n${pages.length} landing page(s), ${enabledIds.size} enabled, ${retired.length} retired id(s): ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`,
);

if (errors.length) {
  process.exit(1);
}

function checkTemplateIds() {
  const seen = new Set();
  for (const id of templateIds) {
    if (seen.has(id)) {
      errors.push({ file: 'templates.json', message: `Duplicate template id "${id}"` });
    }
    seen.add(id);
  }

  const categorySlugs = new Set(
    templates.flatMap((template) => template.categories ?? []).map((category) => toSlug(category)),
  );
  for (const id of templateIds) {
    if (categorySlugs.has(id)) {
      errors.push({
        file: 'templates.json',
        message: `Template id "${id}" equals a gallery category slug; /templates/ai-coding/${id} would collide`,
      });
    }
  }
}

function checkRetired() {
  const ids = retired.map((entry) => entry.id);
  if (new Set(ids).size !== ids.length) {
    errors.push({ file: 'templates.json', message: 'retired lists an id more than once' });
  }
  const sorted = [...ids].sort();
  if (ids.join('\n') !== sorted.join('\n')) {
    errors.push({ file: 'templates.json', message: 'retired must be sorted by id' });
  }
}

function readLandingPages() {
  const dir = 'landing-pages';
  if (!existsSync(dir)) {
    return [];
  }

  const files = readdirSync(dir)
    .filter((name) => name.endsWith('.json') && name !== 'index.json')
    .sort();
  const fileIds = files.map((name) => name.slice(0, -'.json'.length));

  checkIndex(fileIds);

  return files.map((name) => {
    const id = name.slice(0, -'.json'.length);
    const file = `${dir}/${name}`;
    let data = null;
    try {
      data = readJson(file);
    } catch (error) {
      errors.push({ file, message: `Invalid JSON: ${error.message}` });
    }
    return { id, file, data };
  });
}

function checkIndex(fileIds) {
  const file = 'landing-pages/index.json';
  if (!existsSync(file)) {
    errors.push({ file, message: 'Missing landing-pages/index.json' });
    return;
  }

  const index = readJson(file).landingPages;
  if (!Array.isArray(index)) {
    errors.push({ file, message: 'index.json must be { "landingPages": [ids] }' });
    return;
  }

  if (index.join('\n') !== [...index].sort().join('\n') || new Set(index).size !== index.length) {
    errors.push({ file, message: 'landingPages must be sorted and unique' });
  }

  const listed = new Set(index);
  const present = new Set(fileIds);
  for (const id of present) {
    if (!listed.has(id)) {
      errors.push({ file, message: `landing-pages/${id}.json is not listed in index.json` });
    }
  }
  for (const id of listed) {
    if (!present.has(id)) {
      errors.push({ file, message: `index.json lists "${id}" but landing-pages/${id}.json does not exist` });
    }
  }
}

function checkPage({ id, file, data }) {
  if (!data) {
    return;
  }

  if (!ID_PATTERN.test(id)) {
    errors.push({ file, message: `File name must be <template id>.json in lowercase kebab-case` });
  }

  const template = templatesById.get(id);
  if (!template) {
    errors.push({ file, message: `No template with id "${id}" in templates.json` });
  }

  const page = data.landingPage ?? {};
  for (const [field, value] of textFields(page)) {
    for (const [pattern, problem] of TEXT_RULES) {
      if (pattern.test(value)) {
        errors.push({ file, message: `${field} ${problem}` });
      }
    }
  }

  if (page.enabled !== true) {
    const missing = missingCopy(page);
    if (missing.length) {
      warnings.push({ file, message: `Draft. Before enabling: ${missing.join('; ')}` });
    }
    return;
  }

  if (retiredIds.has(id)) {
    errors.push({ file, message: `"${id}" is in retired; remove it from retired to publish the page again` });
  }
  if (upstreamIds.has(id)) {
    errors.push({
      file,
      message: `"${id}" is an upstream template; hostinger.com does not read the upstream list yet, so keep the page a draft`,
    });
  }
  if (template && !template.demoUrl) {
    errors.push({ file, message: `Template "${id}" has no demoUrl; a page needs a live demo` });
  }
  for (const problem of missingCopy(page)) {
    errors.push({ file, message: problem });
  }
}

function missingCopy(page) {
  const problems = [];

  for (const [field, [min, max]] of Object.entries(CHARACTER_LIMITS)) {
    const length = (page[field] ?? '').trim().length;
    if (length < min || length > max) {
      problems.push(`${field} must be ${min}–${max} characters (now ${length})`);
    }
  }

  const words = (page.about ?? '').trim().split(/\s+/).filter(Boolean).length;
  if (words < ABOUT_WORDS[0] || words > ABOUT_WORDS[1]) {
    problems.push(`about must be ${ABOUT_WORDS[0]}–${ABOUT_WORDS[1]} words (now ${words})`);
  }

  const features = Array.isArray(page.features) ? page.features : [];
  if (features.length < FEATURE_COUNT[0] || features.length > FEATURE_COUNT[1]) {
    problems.push(`features must have ${FEATURE_COUNT[0]}–${FEATURE_COUNT[1]} items (now ${features.length})`);
  }
  features.forEach((feature, index) => {
    const title = (feature?.title ?? '').trim().length;
    const description = (feature?.description ?? '').trim().length;
    if (title < FEATURE_TITLE_CHARACTERS[0] || title > FEATURE_TITLE_CHARACTERS[1]) {
      problems.push(`features[${index}].title must be ${FEATURE_TITLE_CHARACTERS.join('–')} characters`);
    }
    if (description < FEATURE_DESCRIPTION_CHARACTERS[0] || description > FEATURE_DESCRIPTION_CHARACTERS[1]) {
      problems.push(
        `features[${index}].description must be ${FEATURE_DESCRIPTION_CHARACTERS.join('–')} characters`,
      );
    }
  });

  return problems;
}

async function checkAgainstBase(ref) {
  const baseCatalog = readJsonAt(ref, 'templates.json') ?? { templates: [] };
  const baseTemplateIds = new Set((baseCatalog.templates ?? []).map((template) => template.id));
  const baseEnabled = new Set(
    (readJsonAt(ref, 'landing-pages/index.json')?.landingPages ?? []).filter(
      (id) => readJsonAt(ref, `landing-pages/${id}.json`)?.landingPage?.enabled === true,
    ),
  );

  for (const id of baseEnabled) {
    if (!enabledIds.has(id) && !retiredIds.has(id)) {
      errors.push({
        file: 'templates.json',
        message: `This PR unpublishes "${id}"; add { "id": "${id}", "retiredAt": "YYYY-MM-DD" } to retired`,
      });
    }
  }

  for (const id of templateIds) {
    if (!baseTemplateIds.has(id) && retiredIds.has(id)) {
      errors.push({ file: 'templates.json', message: `"${id}" is a retired id; give the new template another id` });
    }
  }

  const newlyEnabled = [...enabledIds].filter((id) => !baseEnabled.has(id));
  if (!newlyEnabled.length || offline) {
    return;
  }

  const dockerSlugs = await readDockerApplicationSlugs();
  if (!dockerSlugs) {
    return;
  }
  for (const id of newlyEnabled) {
    if (dockerSlugs.has(id)) {
      errors.push({
        file: `landing-pages/${id}.json`,
        message: `/applications/${id} already belongs to a VPS Docker application; the template needs another id`,
      });
    }
  }
}

async function readDockerApplicationSlugs() {
  try {
    const response = await fetch(APPLICATIONS_LISTING_URL, {
      headers: { 'User-Agent': 'hostinger-templates-ci (+https://github.com/hostinger/hostinger-templates)' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();
    const slugs = new Set([...html.matchAll(/href="\/applications\/([a-z0-9-]+)"/g)].map((match) => match[1]));
    if (slugs.size < MIN_EXPECTED_DOCKER_APPLICATIONS) {
      throw new Error(`found only ${slugs.size} application links`);
    }
    return slugs;
  } catch (error) {
    errors.push({
      file: 'landing-pages/index.json',
      message: `Could not read ${APPLICATIONS_LISTING_URL} to check slug collisions (${error.message}); rerun the check`,
    });
    return null;
  }
}

function* textFields(page) {
  for (const field of ['heroTitle', 'heroDescription', 'about', 'metaTitle', 'metaDescription', 'short', 'long']) {
    if (typeof page[field] === 'string') {
      yield [field, page[field]];
    }
  }
  if (Array.isArray(page.features)) {
    for (const [index, feature] of page.features.entries()) {
      for (const key of ['title', 'description']) {
        if (typeof feature?.[key] === 'string') {
          yield [`features[${index}].${key}`, feature[key]];
        }
      }
    }
  }
}

function toSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readJsonAt(ref, path) {
  try {
    return JSON.parse(execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  } catch {
    return null;
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}
