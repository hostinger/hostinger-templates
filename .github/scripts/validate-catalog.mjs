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

// The schema can't see the file tree: a templates[] entry ships its code in
// templates/<id>/, an upstream[] entry ships only its preview images in
// upstream/<id>/preview/ and deploys from its source repository.
function checkLayout() {
  let catalog;
  try {
    catalog = readJson(join(root, 'templates.json'));
  } catch {
    return;
  }
  const lists = [
    ['templates', catalog.templates ?? []],
    ['upstream', catalog.upstream ?? []],
  ];
  const seen = new Set((catalog.retired ?? []).map((entry) => entry.id));
  for (const [list, entries] of lists) {
    for (const entry of entries) {
      const file = 'templates.json';
      if (seen.has(entry.id)) {
        errors.push({ file, message: `${list}: id "${entry.id}" is already used in templates, upstream or retired` });
      }
      seen.add(entry.id);

      const hasCode = existsSync(join(root, 'templates', entry.id, 'package.json'));
      if (list === 'templates' && !hasCode) {
        errors.push({ file, message: `templates: "${entry.id}" has no templates/${entry.id}/package.json` });
      }
      if (list === 'upstream' && existsSync(join(root, 'templates', entry.id))) {
        errors.push({ file, message: `upstream: "${entry.id}" deploys from ${entry.source?.repository}; remove templates/${entry.id}/` });
      }

      const prefix = `${list}/${entry.id}/preview/`;
      const { thumbnail = {}, preview = {} } = entry.media ?? {};
      const paths = [thumbnail.path, preview.path, ...(thumbnail.variants ?? []).map((variant) => variant.path)];
      for (const path of paths.filter(Boolean)) {
        if (!path.startsWith(prefix)) {
          errors.push({ file, message: `${list}: "${entry.id}" media ${path} must be under ${prefix}` });
        } else if (!existsSync(join(root, path))) {
          errors.push({ file, message: `${list}: "${entry.id}" media ${path} does not exist` });
        }
      }
      for (const image of [thumbnail, preview]) {
        if (image.path && image.url && !image.url.includes(`/blob/main/${image.path}?`)) {
          errors.push({ file, message: `${list}: "${entry.id}" media url ${image.url} does not point at ${image.path}` });
        }
      }
    }
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
