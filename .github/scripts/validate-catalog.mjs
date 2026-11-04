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

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
