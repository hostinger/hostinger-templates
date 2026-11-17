import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HISTORY_LIMIT = 100;
const VERDICT_ORDER = { deployable: 0, 'needs-review': 1, 'not-deployable': 2, error: 3 };
const VERDICT_ICON = { deployable: '✅', 'needs-review': '🟡', 'not-deployable': '❌', error: '⚠️' };

export function entryPath(repository, appDir) {
  const [owner, name] = repository.split('/');
  const suffix = appDir ? `__${appDir.replace(/\/+$/, '').replace(/\//g, '__')}` : '';
  return join('repositories', owner, `${name}${suffix}.json`);
}

export function hostingerStatus(deploy) {
  if (!deploy) return 'not-tried';
  return deploy.ok ? 'deploys' : 'fails';
}

export function recordScan(previous, result, deployOutcome, { date, runUrl }) {
  const deploy = deployOutcome
    ? {
        date,
        commit: deployOutcome.commit,
        ok: Boolean(deployOutcome.ok),
        error: deployOutcome.error ?? null,
        buildAnalysis: deployOutcome.buildAnalysis ?? null,
        buildSeconds: deployOutcome.buildSeconds ?? null,
        run: runUrl,
      }
    : previous?.deploy ?? null;
  const visit = {
    date,
    commit: result.commit ?? null,
    verdict: result.verdict,
    deployed: deployOutcome ? Boolean(deployOutcome.ok) : null,
    run: runUrl,
  };
  const history = [visit, ...(previous?.history ?? []).filter((item) => item.run !== runUrl)].slice(0, HISTORY_LIMIT);
  return {
    repository: result.repository,
    appDir: result.appDir ?? null,
    url: `https://github.com/${result.repository}`,
    stars: result.stars ?? previous?.stars ?? null,
    framework: result.framework ?? previous?.framework ?? null,
    firstScanned: previous?.firstScanned ?? date,
    lastScanned: date,
    commit: result.commit ?? null,
    ref: result.ref ?? null,
    verdict: result.verdict,
    hostinger: hostingerStatus(deploy),
    findings: result.findings,
    deploy,
    history,
  };
}

export function renderIndex(entries) {
  const rows = [...entries].sort(
    (a, b) =>
      VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict] ||
      (b.stars ?? 0) - (a.stars ?? 0) ||
      a.repository.localeCompare(b.repository),
  );
  const hostingerLabel = { deploys: '✅ deploys', fails: '❌ fails', 'not-tried': '—' };
  const lines = [
    '# Repository scan log',
    '',
    'Every public repository the [Repository deployability](../.github/workflows/repo-deployability.yml) workflow has checked, with its latest result. The full findings, the last Hostinger deploy and the scan history of each one are in `repositories/<owner>/<repo>.json`.',
    '',
    '| Repository | Stars | Static check | Hostinger deploy | Last scanned | Why |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  for (const entry of rows) {
    const reasons = entry.findings.filter((finding) => finding.level !== 'pass').map((finding) => finding.message);
    if (entry.deploy && !entry.deploy.ok && entry.deploy.error) reasons.push(`Deploy: ${entry.deploy.error}`);
    const name = `${entry.repository}${entry.appDir ? `:${entry.appDir}` : ''}`;
    lines.push(
      `| [${name}](${entryPath(entry.repository, entry.appDir)}) | ${entry.stars ?? '—'} | ${VERDICT_ICON[entry.verdict]} ${entry.verdict} | ${hostingerLabel[entry.hostinger]} | ${entry.lastScanned} | ${escapeCell(reasons.join(' ') || 'All checks pass.')} |`,
    );
  }
  const counts = Object.keys(VERDICT_ICON).map((verdict) => `${rows.filter((entry) => entry.verdict === verdict).length} ${verdict}`);
  const deployed = rows.filter((entry) => entry.hostinger === 'deploys').length;
  lines.push('', `${rows.length} repositories: ${counts.join(', ')}. ${deployed} deployed on Hostinger.`, '');
  return lines.join('\n');
}

export function updateLog(logDir, results, deployOutcomes, { date, runUrl }) {
  const changed = [];
  for (const result of results) {
    const path = entryPath(result.repository, result.appDir);
    const file = join(logDir, path);
    const previous = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
    const outcome = deployOutcomes.find(
      (item) => item.repository === result.repository && (item.appDir ?? null) === (result.appDir ?? null),
    );
    mkdirSync(join(file, '..'), { recursive: true });
    writeIfChanged(file, `${JSON.stringify(recordScan(previous, result, outcome, { date, runUrl }), null, 2)}\n`, changed);
  }
  writeIfChanged(join(logDir, 'README.md'), renderIndex(readEntries(join(logDir, 'repositories'))), changed);
  return changed;
}

function readEntries(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true })
    .filter((name) => String(name).endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(join(dir, String(name)), 'utf8')));
}

function writeIfChanged(file, contents, changed) {
  if (existsSync(file) && readFileSync(file, 'utf8') === contents) return;
  writeFileSync(file, contents);
  changed.push(file);
}

function escapeCell(text) {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

async function commitFiles({ checkout, files, branch, repository, token, message }) {
  const expectedHeadOid = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: checkout, encoding: 'utf8' }).trim();
  const additions = files.map((file) => ({
    path: relative(checkout, file).split('\\').join('/'),
    contents: readFileSync(file).toString('base64'),
  }));
  const response = await fetch(process.env.GITHUB_GRAPHQL_URL ?? 'https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      query:
        'mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { url } } }',
      variables: {
        input: {
          branch: { repositoryNameWithOwner: repository, branchName: branch },
          expectedHeadOid,
          message: { headline: message },
          fileChanges: { additions },
        },
      },
    }),
  });
  const body = await response.json();
  if (!response.ok || body.errors) throw new Error(`Could not commit the scan log: ${JSON.stringify(body.errors ?? body)}`);
  return body.data.createCommitOnBranch.commit.url;
}

async function main(args) {
  const valueOf = (name) => {
    const index = args.indexOf(name);
    return index === -1 ? null : args[index + 1];
  };
  const resultsFile = valueOf('--results');
  const checkout = valueOf('--checkout');
  if (!resultsFile || !checkout) {
    console.error(
      'Usage: scan-log.mjs --results results.json --checkout <log branch checkout> [--deploys deploy-outcomes.json] [--dir scan-log] [--run-url URL] [--commit owner/repo:branch]',
    );
    process.exit(1);
  }
  const deploysFile = valueOf('--deploys');
  const logDir = resolve(checkout, valueOf('--dir') ?? 'scan-log');
  const date = new Date().toISOString().slice(0, 10);
  const runUrl = valueOf('--run-url');
  const results = JSON.parse(readFileSync(resultsFile, 'utf8'));
  const deployOutcomes = deploysFile && existsSync(deploysFile) ? JSON.parse(readFileSync(deploysFile, 'utf8')) : [];

  mkdirSync(logDir, { recursive: true });
  const changed = updateLog(logDir, results, deployOutcomes, { date, runUrl });
  console.log(`${changed.length} scan log files changed.`);

  const target = valueOf('--commit');
  if (!target || !changed.length) return;
  const [repository, branch] = target.split(':');
  const url = await commitFiles({
    checkout: resolve(checkout),
    files: changed,
    branch,
    repository,
    token: process.env.GITHUB_TOKEN,
    message: `Record repository scan of ${date} (${results.length} repositories)`,
  });
  console.log(`Committed ${url}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv.slice(2));
}
