import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = process.argv[2] ?? '.';
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const validateCatalog = ajv.compile(readJson(join(root, 'schema/templates.schema.json')));
const validateLandingPage = ajv.compile(readJson(join(root, 'schema/landing-page.schema.json')));

const errors = [];

check('templates.json', validateCatalog);
checkLayout();

const landingDir = join(root, 'landing-pages');
if (existsSync(landingDir)) {
  for (const file of readdirSync(landingDir).filter((name) => name.endsWith('.json')).sort()) {
    if (file === 'index.json') {
      continue;
    }
    check(`landing-pages/${file}`, validateLandingPage);
  }
}

if (errors.length) {
  for (const error of errors) {
    console.log(`::error file=${error.file}::${error.message}`);
  }
  console.error(`\n${errors.length} schema error(s).`);
  process.exit(1);
}

console.log('templates.json and landing-pages/*.json match their schemas.');

function check(file, validate) {
  let data;
  try {
    data = readJson(join(root, file));
  } catch (error) {
    errors.push({ file, message: `Invalid JSON: ${error.message}` });
    return;
  }

  if (validate(data)) {
    return;
  }

  for (const error of validate.errors) {
    const where = error.instancePath || '/';
    const detail = error.params?.additionalProperty
      ? `${error.message} (${error.params.additionalProperty})`
      : error.message;
    errors.push({ file, message: `${where} ${detail}` });
  }
}

// The schema can't see the file tree: every entry ships its code in
// templates/<id>/ and its catalog images in templates/<id>/preview/.
function checkLayout() {
  let catalog;
  try {
    catalog = readJson(join(root, 'templates.json'));
  } catch {
    return;
  }
  const file = 'templates.json';
  const seen = new Set((catalog.retired ?? []).map((entry) => entry.id));
  for (const entry of catalog.templates ?? []) {
    if (seen.has(entry.id)) {
      errors.push({ file, message: `templates: id "${entry.id}" is already used in templates or retired` });
    }
    seen.add(entry.id);

    if (!existsSync(join(root, 'templates', entry.id, 'package.json'))) {
      errors.push({ file, message: `templates: "${entry.id}" has no templates/${entry.id}/package.json` });
    }

    const prefix = `templates/${entry.id}/preview/`;
    const { thumbnail = {}, preview = {} } = entry.media ?? {};
    const paths = [thumbnail.path, preview.path, ...(thumbnail.variants ?? []).map((variant) => variant.path)];
    for (const path of paths.filter(Boolean)) {
      if (!path.startsWith(prefix)) {
        errors.push({ file, message: `templates: "${entry.id}" media ${path} must be under ${prefix}` });
      } else if (!existsSync(join(root, path))) {
        errors.push({ file, message: `templates: "${entry.id}" media ${path} does not exist` });
      }
    }
    for (const image of [thumbnail, preview]) {
      if (image.path && image.url && !image.url.includes(`/blob/main/${image.path}?`)) {
        errors.push({ file, message: `templates: "${entry.id}" media url ${image.url} does not point at ${image.path}` });
      }
    }
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
