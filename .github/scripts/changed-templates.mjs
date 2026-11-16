import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const addedOnly = process.argv.includes('--added');
const [base, head] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

if (!base || !head) {
  console.error('Usage: changed-templates.mjs [--added] <base-sha> <head-sha>');
  process.exit(1);
}

// "<status>\t<path>" lines; renames and copies list the old and new path.
const changes = execFileSync('git', ['diff', '--name-status', `${base}...${head}`], {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean)
  .flatMap((line) => {
    const [status, ...paths] = line.split('\t');
    return paths.map((path) => ({ status: status[0], path }));
  });

// With --added, vendored templates (a source in templates.json) count on any
// change too: their code changes only through an upstream sync, and their
// demo has to follow it.
const vendored = addedOnly ? vendoredIds() : new Set();
const ids = new Set();

for (const { status, path } of changes) {
  const id = path.match(/^templates\/([^/]+)\//)?.[1];
  if (!id) {
    continue;
  }
  if (!addedOnly || vendored.has(id) || (status === 'A' && path === `templates/${id}/package.json`)) {
    ids.add(id);
  }
}

const templates = [...ids]
  .filter((id) => existsSync(`templates/${id}/package.json`))
  .sort();

console.log(JSON.stringify(templates));

function vendoredIds() {
  const catalog = existsSync('templates.json') ? JSON.parse(readFileSync('templates.json', 'utf8')) : {};
  return new Set((catalog.templates ?? []).filter((entry) => entry.source).map((entry) => entry.id));
}
