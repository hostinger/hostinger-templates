import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Posts the final hostinger-build status and the sticky PR comment after the
// preview deploys. Usage: pr-deploy-report.mjs <results-dir> <plan.json>

const MARKER = '<!-- hostinger-build -->';
const [resultsDir, planFile] = process.argv.slice(2);
const { GITHUB_TOKEN, GITHUB_REPOSITORY, RUN_URL } = process.env;
const API = `https://api.github.com/repos/${GITHUB_REPOSITORY}`;

const plan = JSON.parse(readFileSync(planFile, 'utf8'));
const results = new Map();
if (existsSync(resultsDir)) {
  for (const file of readdirSync(resultsDir).filter((name) => name.endsWith('.json'))) {
    for (const result of JSON.parse(readFileSync(join(resultsDir, file), 'utf8'))) {
      results.set(result.id, result);
    }
  }
}

const rows = plan.ids.map(
  (id) => results.get(id) ?? { id, ok: false, error: 'No result: the artifact was rejected or the deploy job failed.' },
);
const failed = rows.filter((row) => !row.ok);

await request('POST', `/statuses/${plan.sha}`, {
  state: failed.length ? 'failure' : 'success',
  context: 'hostinger-build',
  description: failed.length
    ? `${failed.length} of ${rows.length} template(s) failed on Hostinger`
    : `${rows.length} template(s) built and passed the smoke check on Hostinger`,
  target_url: RUN_URL,
});

await upsertComment(renderComment(rows));

console.log(failed.length ? `${failed.length} failed` : 'All templates passed');
if (failed.length) {
  process.exit(1);
}

function renderComment(entries) {
  const lines = [
    MARKER,
    '## Hostinger build',
    '',
    'Each changed template was deployed to the preview hosting account and checked like a visitor would see it.',
    '',
    '| Template | Result | Build time | Routes | Preview |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const row of entries) {
    const routes = row.smoke?.routes?.map((route) => `\`${route.path}\` ${route.status ?? '—'}`).join(' · ') ?? '—';
    const time = row.buildSeconds ? `${Math.floor(row.buildSeconds / 60)}m ${row.buildSeconds % 60}s` : '—';
    lines.push(
      `| \`${row.id}\` | ${row.ok ? '✅' : `❌ ${escapeCell(row.error ?? '')}`} | ${time} | ${routes} | ${row.url ?? '—'} |`,
    );
  }

  for (const row of entries.filter((entry) => !entry.ok && (entry.buildLogTail || entry.buildAnalysis))) {
    lines.push('', `<details><summary><code>${row.id}</code> build output</summary>`, '');
    if (row.buildAnalysis?.analysis) {
      lines.push(
        "Hostinger's automatic analysis (reproduce with Node.js 22 before acting on it):",
        '',
        `> ${row.buildAnalysis.analysis.replace(/\n/g, '\n> ')}`,
        '',
      );
      if (row.buildAnalysis.solution) {
        lines.push(`> **Suggested fix:** ${row.buildAnalysis.solution.replace(/\n/g, '\n> ')}`, '');
      }
    }
    if (row.buildLogTail) {
      lines.push('```text', row.buildLogTail.slice(-6000), '```');
    }
    lines.push('</details>');
  }

  lines.push(
    '',
    `Previews are for review only: they are not indexed and are deleted when the PR closes. [Run](${RUN_URL})`,
  );
  return lines.join('\n');
}

async function upsertComment(body) {
  const comments = await request('GET', `/issues/${plan.pr}/comments?per_page=100`);
  const existing = comments.find((comment) => comment.body?.includes(MARKER));
  if (existing) {
    await request('PATCH', `/issues/comments/${existing.id}`, { body });
  } else {
    await request('POST', `/issues/${plan.pr}/comments`, { body });
  }
}

async function request(method, path, body) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`${method} ${path} returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return response.status === 204 ? null : response.json();
}

function escapeCell(text) {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}
