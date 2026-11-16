import { appendFileSync, writeFileSync } from 'node:fs';
import { collectFacts, searchRepositories } from './repo-evaluation/github.mjs';
import { evaluateRepository } from './repo-evaluation/rules.mjs';

// Evaluates whether public GitHub repositories can run as Node.js apps on
// Hostinger web hosting, without cloning or running them.
//
//   node .github/scripts/evaluate-repos.mjs owner/repo[:app/dir] ...
//   node .github/scripts/evaluate-repos.mjs --discover [--limit 20]
//
// --out <file> writes the JSON results. GITHUB_TOKEN raises the API rate limit.

const DISCOVERY_QUERIES = [
  'topic:self-hosted language:TypeScript stars:>1000 archived:false',
  'topic:nextjs topic:template stars:>500 archived:false',
  'topic:saas-boilerplate stars:>300 archived:false',
  'topic:dashboard language:TypeScript stars:>1000 archived:false',
  'topic:nuxt topic:template stars:>300 archived:false',
  'topic:astro topic:template stars:>300 archived:false',
  'topic:sveltekit topic:template stars:>300 archived:false',
  'topic:express topic:boilerplate stars:>500 archived:false',
];

const args = process.argv.slice(2);
const limit = Number(valueOf('--limit') ?? 15);
const out = valueOf('--out');
const targets = args.filter((arg, index) => !arg.startsWith('--') && !['--limit', '--out', '--query'].includes(args[index - 1]));

if (args.includes('--discover')) {
  const queries = valueOf('--query') ? [valueOf('--query')] : DISCOVERY_QUERIES;
  for (const query of queries) {
    for (const name of await searchRepositories(query, { limit })) {
      if (!targets.includes(name)) targets.push(name);
    }
  }
}

const TARGET_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(:[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)*)?$/;
const invalid = targets.filter((target) => !TARGET_PATTERN.test(target) || target.includes('..'));
if (invalid.length) {
  console.error(`Not owner/repo[:app/dir]: ${invalid.join(', ')}`);
  process.exit(1);
}

if (!targets.length) {
  console.error('Usage: evaluate-repos.mjs owner/repo[:app/dir] ... | --discover [--query "<GitHub search>"] [--limit N] [--out results.json]');
  process.exit(1);
}

const results = [];
for (const target of targets) {
  const [fullName, appDir = null] = target.split(':');
  try {
    results.push(evaluateRepository(await collectFacts(fullName, { appDir })));
  } catch (error) {
    results.push({ repository: fullName, appDir, verdict: 'error', findings: [{ level: 'fail', check: 'api', message: error.message }] });
  }
}

const order = { deployable: 0, 'needs-review': 1, 'not-deployable': 2, error: 3 };
results.sort((a, b) => order[a.verdict] - order[b.verdict] || (b.stars ?? 0) - (a.stars ?? 0));

if (out) writeFileSync(out, JSON.stringify(results, null, 2));
const report = renderReport(results);
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);

function renderReport(rows) {
  const icon = { deployable: '✅', 'needs-review': '🟡', 'not-deployable': '❌', error: '⚠️' };
  const lines = [
    '## Node.js deployability',
    '',
    '| Repository | Stars | Verdict | Framework | Why |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const row of rows) {
    const reasons = row.findings.filter((finding) => finding.level !== 'pass').map((finding) => finding.message);
    lines.push(
      `| [${row.repository}${row.appDir ? `:${row.appDir}` : ''}](https://github.com/${row.repository}) | ${row.stars ?? '—'} | ${icon[row.verdict]} ${row.verdict} | ${row.framework ?? '—'} | ${escape(reasons.join(' ') || 'All checks pass.')} |`,
    );
  }
  const counts = Object.keys(icon).map((verdict) => `${rows.filter((row) => row.verdict === verdict).length} ${verdict}`);
  lines.push('', `${rows.length} evaluated: ${counts.join(', ')}.`);
  return lines.join('\n');
}

function escape(text) {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function valueOf(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}
