import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const addedOnly = process.argv.includes('--added');
const [base, head] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));

if (!base || !head) {
  console.error('Usage: changed-templates.mjs [--added] <base-sha> <head-sha>');
  process.exit(1);
}

const diffArgs = ['diff', '--name-only'];
if (addedOnly) {
  diffArgs.push('--diff-filter=A');
}
diffArgs.push(`${base}...${head}`);

const files = execFileSync('git', diffArgs, {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

const ids = new Set();

for (const file of files) {
  const match = addedOnly
    ? file.match(/^templates\/([^/]+)\/package\.json$/)
    : file.match(/^templates\/([^/]+)\//);
  if (match) {
    ids.add(match[1]);
  }
}

const templates = [...ids]
  .filter((id) => existsSync(`templates/${id}/package.json`))
  .sort();

console.log(JSON.stringify(templates));
