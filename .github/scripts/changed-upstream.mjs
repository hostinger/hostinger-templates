import { execFileSync } from 'node:child_process';

// Lists the upstream templates whose deploy changed between two commits: new
// entries, and entries whose source pin, deploy settings or routes changed.
//
//   changed-upstream.mjs <base-sha> <head-sha>

const [base, head] = process.argv.slice(2);

if (!base || !head) {
  console.error('Usage: changed-upstream.mjs <base-sha> <head-sha>');
  process.exit(1);
}

const before = upstreamById(base);
const after = upstreamById(head);

const ids = [...after.keys()].filter((id) => deployShape(before.get(id)) !== deployShape(after.get(id))).sort();

console.log(JSON.stringify(ids));

function deployShape(entry) {
  return entry ? JSON.stringify([entry.source, entry.deploy ?? {}, entry.routes ?? ['/']]) : null;
}

function upstreamById(ref) {
  let raw;
  try {
    raw = /^0+$/.test(ref)
      ? '{}'
      : execFileSync('git', ['show', `${ref}:templates.json`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    raw = '{}';
  }
  return new Map((JSON.parse(raw).upstream ?? []).map((entry) => [entry.id, entry]));
}
