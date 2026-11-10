import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { checkPin, createUpstreamClient } from './repo-evaluation/upstream.mjs';

// Template gate check for upstream templates: every entry this PR adds or
// re-pins must have a ref that matches its commit, the license GitHub
// reports, and pass the deployability rules at the pinned commit.
//
//   check-upstream.mjs [--base <sha>]    (without --base, checks every entry)

const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');
const base = baseIndex === -1 ? null : args[baseIndex + 1];

const head = JSON.parse(readFileSync('templates.json', 'utf8')).upstream ?? [];
const before = base ? baseUpstream(base) : new Map();
const changed = head.filter((entry) => JSON.stringify(before.get(entry.id)?.source) !== JSON.stringify(entry.source));

if (!changed.length) {
  console.log('No upstream template was added or re-pinned.');
  process.exit(0);
}

const client = createUpstreamClient();
const rows = [];
for (const entry of changed) {
  const { problems } = await checkPin(entry.source, client).catch((error) => ({ problems: [error.message] }));
  rows.push({ entry, problems });
  for (const problem of problems) {
    console.log(`::error file=templates.json::upstream "${entry.id}": ${problem}`);
  }
}

const summary = [
  '## Upstream templates',
  '',
  '| Template | Source | Result |',
  '| --- | --- | --- |',
  ...rows.map(({ entry, problems }) => {
    const { repository, ref, commit, directory } = entry.source;
    const where = `[${repository}${directory ? `/${directory}` : ''}@${ref}](https://github.com/${repository}/tree/${commit}${directory ? `/${directory}` : ''}) \`${commit.slice(0, 7)}\``;
    const result = problems.length ? `❌ ${problems.join('; ').replace(/\|/g, '\\|')}` : '✅ pin, license and deployability rules';
    return `| \`${entry.id}\` | ${where} | ${result} |`;
  }),
].join('\n');

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

if (rows.some(({ problems }) => problems.length)) {
  process.exit(1);
}

function baseUpstream(ref) {
  try {
    const raw = execFileSync('git', ['show', `${ref}:templates.json`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return new Map((JSON.parse(raw).upstream ?? []).map((entry) => [entry.id, entry]));
  } catch {
    return new Map();
  }
}
