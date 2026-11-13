import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

// Decides whether hostinger.com must rebuild /applications after a push to
// main, and which enabled pages changed. Usage:
//   catalog-changes.mjs --before <sha> --after <sha>   (push)
//   catalog-changes.mjs --all                         (after a demo deploy, or by hand)
// Writes `ids` (changed enabled pages whose demo answers), `failed` (enabled
// pages whose demo doesn't) and `dispatch` (true/false) to $GITHUB_OUTPUT.

const DEMO_ATTEMPTS = 3;
const DEMO_RETRY_DELAY_MS = 20_000;
const DEMO_TIMEOUT_MS = 20_000;

const args = process.argv.slice(2);
const all = args.includes('--all');
const before = argValue('--before');
const after = argValue('--after') ?? 'HEAD';

const head = readSnapshot(after);
const previous = all || !isCommit(before) ? null : readSnapshot(before);

const candidates = previous ? changedEnabledIds(previous, head) : [...head.enabled].sort();
const unpublished = previous ? [...previous.enabled].filter((id) => !head.enabled.has(id)).sort() : [];
const retiredChanged = previous ? JSON.stringify(previous.retired) !== JSON.stringify(head.retired) : false;

const results = [];
for (const id of candidates) {
  const demoUrl = head.templates.get(id)?.demoUrl;
  results.push({ id, demoUrl, ...(await checkDemo(demoUrl)) });
}

const live = results.filter((result) => result.ok).map((result) => result.id);
const failed = results.filter((result) => !result.ok);
const dispatch = live.length > 0 || unpublished.length > 0 || retiredChanged;

writeOutput('ids', live.join(','));
writeOutput('failed', failed.map((result) => result.id).join(','));
writeOutput('dispatch', String(dispatch));
writeSummary();

console.log(
  JSON.stringify({ candidates, live, failed: failed.map((result) => result.id), unpublished, retiredChanged, dispatch }),
);

function changedEnabledIds(base, current) {
  return [...current.enabled]
    .filter(
      (id) =>
        !base.enabled.has(id) ||
        base.pages.get(id) !== current.pages.get(id) ||
        JSON.stringify(base.templates.get(id)) !== JSON.stringify(current.templates.get(id)),
    )
    .sort();
}

async function checkDemo(demoUrl) {
  if (!demoUrl) {
    return { ok: false, detail: 'no demoUrl in templates.json' };
  }

  let detail = '';
  for (let attempt = 1; attempt <= DEMO_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(demoUrl, { redirect: 'follow', signal: AbortSignal.timeout(DEMO_TIMEOUT_MS) });
      if (response.status >= 200 && response.status < 300) {
        return { ok: true, detail: `HTTP ${response.status}` };
      }
      detail = `HTTP ${response.status}`;
    } catch (error) {
      detail = error.message;
    }
    if (attempt < DEMO_ATTEMPTS) {
      await new Promise((done) => setTimeout(done, DEMO_RETRY_DELAY_MS));
    }
  }
  return { ok: false, detail };
}

function readSnapshot(ref) {
  const catalog = readJsonAt(ref, 'templates.json') ?? { templates: [], retired: [] };
  const index = readJsonAt(ref, 'landing-pages/index.json')?.landingPages ?? [];
  const pages = new Map();
  const enabled = new Set();
  for (const id of index) {
    const raw = readTextAt(ref, `landing-pages/${id}.json`);
    if (raw === null) {
      continue;
    }
    pages.set(id, raw);
    try {
      if (JSON.parse(raw).landingPage?.enabled === true) {
        enabled.add(id);
      }
    } catch {
      // Invalid JSON never reaches main: the gate rejects it.
    }
  }
  const templates = new Map((catalog.templates ?? []).map((template) => [template.id, template]));
  for (const id of [...enabled]) {
    if (!templates.has(id) || (catalog.retired ?? []).some((entry) => entry.id === id)) {
      enabled.delete(id);
    }
  }
  return { templates, pages, enabled, retired: catalog.retired ?? [] };
}

function readJsonAt(ref, path) {
  const raw = readTextAt(ref, path);
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readTextAt(ref, path) {
  if (ref === 'WORKTREE') {
    return existsSync(path) ? readFileSync(path, 'utf8') : null;
  }
  try {
    return execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

function isCommit(ref) {
  if (!ref || /^0+$/.test(ref)) {
    return false;
  }
  try {
    execFileSync('git', ['cat-file', '-e', `${ref}^{commit}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function writeOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

function writeSummary() {
  const lines = ['## Landing pages', ''];
  if (!candidates.length && !unpublished.length && !retiredChanged) {
    lines.push('No enabled landing page changed.');
  }
  if (results.length) {
    lines.push('| Page | Demo | Result |', '| --- | --- | --- |');
    for (const result of results) {
      lines.push(`| \`${result.id}\` | ${result.demoUrl ?? '—'} | ${result.ok ? '✅' : '❌'} ${result.detail} |`);
    }
    lines.push('');
  }
  if (unpublished.length) {
    lines.push(`Unpublished: ${unpublished.map((id) => `\`${id}\``).join(', ')}`, '');
  }
  if (retiredChanged) {
    lines.push('The retired list changed.', '');
  }
  lines.push(dispatch ? 'Notifying hostinger.com to rebuild /applications.' : 'Nothing to send to hostinger.com.');
  const text = lines.join('\n');
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);
  }
}

function argValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}
