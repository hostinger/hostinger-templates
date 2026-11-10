import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHostingerApi } from './hostinger-api.mjs';
import { archiveUpstream } from './upstream-archive.mjs';

// Proves that repositories evaluate-repos.mjs passed really build and run on
// Hostinger: each one is archived at the evaluated commit (nothing from it
// runs here), deployed to scan-<owner>-<repo>.<preview domain> with
// deploy-demos.mjs, smoke-checked, and its subdomain deleted again.
//
//   HOSTINGER_API_TOKEN=… DEMO_PARENT_DOMAIN=… deploy-candidates.mjs results.json [--limit 5] [--keep]

const SUBDOMAIN_PREFIX = 'scan-';
const MAX_ID_LENGTH = 63 - SUBDOMAIN_PREFIX.length;
const scriptsDir = fileURLToPath(new URL('.', import.meta.url));

const [resultsFile, ...rest] = process.argv.slice(2);
const limit = Number(rest[rest.indexOf('--limit') + 1] ?? 5) || 5;
const keep = rest.includes('--keep');
const { HOSTINGER_API_TOKEN, DEMO_PARENT_DOMAIN } = process.env;

if (!resultsFile || !HOSTINGER_API_TOKEN || !DEMO_PARENT_DOMAIN) {
  console.error('Usage: HOSTINGER_API_TOKEN=… DEMO_PARENT_DOMAIN=… deploy-candidates.mjs <results.json> [--limit N] [--keep]');
  process.exit(1);
}

const workDir = resolve(process.env.RUNNER_TEMP ?? '/tmp', 'repo-scan');
rmSync(workDir, { recursive: true, force: true });
mkdirSync(join(workDir, 'demos'), { recursive: true });

const candidates = JSON.parse(readFileSync(resultsFile, 'utf8'))
  .filter((result) => ['deployable', 'needs-review'].includes(result.verdict) && result.commit)
  .slice(0, limit);

const staged = [];
const outcomes = [];
for (const candidate of candidates) {
  const id = toId(candidate.repository, candidate.appDir);
  try {
    stage(candidate, id);
    staged.push({ id, candidate });
  } catch (error) {
    outcomes.push({ ...describe(candidate, id), ok: false, error: `Not deployed: ${error.message}` });
  }
}

if (staged.length) {
  const resultsPath = join(workDir, 'deploy-results.json');
  spawnSync('node', [join(scriptsDir, 'deploy-demos.mjs'), join(workDir, 'demos')], {
    stdio: 'inherit',
    env: {
      ...process.env,
      TEMPLATES: JSON.stringify(staged.map(({ id }) => id)),
      DEMO_SUBDOMAIN_PREFIX: SUBDOMAIN_PREFIX,
      RESULTS_FILE: resultsPath,
      BUILD_TIMEOUT_MINUTES: process.env.BUILD_TIMEOUT_MINUTES ?? '15',
      SMOKE_FIRST_ANSWER_MINUTES: process.env.SMOKE_FIRST_ANSWER_MINUTES ?? '10',
    },
  });
  const deployed = existsSync(resultsPath) ? JSON.parse(readFileSync(resultsPath, 'utf8')) : [];
  for (const { id, candidate } of staged) {
    const result = deployed.find((row) => row.id === id);
    outcomes.push({
      ...describe(candidate, id),
      ok: Boolean(result?.ok),
      error: result?.ok ? null : result?.error ?? 'No deploy result',
      buildAnalysis: result?.buildAnalysis?.analysis ?? null,
      buildSeconds: result?.buildSeconds ?? null,
    });
  }
  if (!keep) {
    await deleteSubdomains(staged.map(({ id }) => `${SUBDOMAIN_PREFIX}${id}`));
  }
}

writeFileSync(join(workDir, 'outcomes.json'), JSON.stringify(outcomes, null, 2));
const report = renderReport(outcomes);
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);

function stage(candidate, id) {
  const demoDir = join(workDir, 'demos', id);
  const { archive } = archiveUpstream(
    { repository: candidate.repository, commit: candidate.commit, directory: candidate.appDir?.replace(/\/$/, '') ?? null },
    demoDir,
    id,
  );
  writeFileSync(join(demoDir, 'meta.json'), JSON.stringify({ id, kind: 'node', archive, title: null, deploy: {}, routes: ['/'] }));
}

async function deleteSubdomains(labels) {
  const { api, resolveUsername } = createHostingerApi({
    token: HOSTINGER_API_TOKEN,
    baseUrl: process.env.HOSTINGER_API_BASE_URL,
  });
  const username = await resolveUsername(DEMO_PARENT_DOMAIN);
  for (const label of labels) {
    await api('DELETE', `accounts/${username}/websites/${DEMO_PARENT_DOMAIN}/subdomains/${encodeURIComponent(label)}`).catch(
      (error) => console.log(`::warning::Could not delete ${label}: ${error.message}`),
    );
  }
}

function toId(repository, appDir) {
  return [repository.replace('/', '-'), appDir?.split('/').pop()]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_ID_LENGTH)
    .replace(/-+$/, '');
}

function describe(candidate, id) {
  return { repository: candidate.repository, appDir: candidate.appDir, commit: candidate.commit, framework: candidate.framework, id };
}

function renderReport(rows) {
  const lines = ['## Deployed on Hostinger', ''];
  if (!rows.length) {
    lines.push('No repository passed the static checks.');
    return lines.join('\n');
  }
  lines.push('| Repository | Commit | Result | Build time | Details |', '| --- | --- | --- | --- | --- |');
  for (const row of rows) {
    const details = [row.error, row.buildAnalysis && `Hostinger analysis: ${row.buildAnalysis}`].filter(Boolean).join(' ');
    lines.push(
      `| ${row.repository}${row.appDir ? `:${row.appDir}` : ''} | \`${row.commit.slice(0, 7)}\` | ${row.ok ? '✅ builds, runs and answers' : '❌'} | ${row.buildSeconds ? `${row.buildSeconds}s` : '—'} | ${(details || '—').replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`,
    );
  }
  return lines.join('\n');
}
