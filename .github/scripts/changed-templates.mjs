import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const base = process.argv[2];
const head = process.argv[3];

if (!base || !head) {
  console.error('Usage: changed-templates.mjs <base-sha> <head-sha>');
  process.exit(1);
}

const files = execFileSync('git', ['diff', '--name-only', `${base}...${head}`], {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

const ids = new Set();

for (const file of files) {
  const match = file.match(/^templates\/([^/]+)\//);
  if (match) {
    ids.add(match[1]);
  }
}

const templates = [...ids]
  .filter((id) => existsSync(`templates/${id}/package.json`))
  .sort();

console.log(JSON.stringify(templates));
