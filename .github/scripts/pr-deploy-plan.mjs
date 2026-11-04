import { appendFileSync, writeFileSync } from 'node:fs';

// Decides what the trusted PR deploy does for one Template gate run. It
// recomputes the PR and the changed templates from the head SHA through the
// GitHub API and never reads anything the PR's own jobs produced.
// Writes plan.json and the outputs decision, pr, ids and message.

const SCANNER_CONTEXT = 'AI Security Scanner';
const SCANNER_WAIT_MS = Number(process.env.SCANNER_WAIT_SECONDS ?? 900) * 1000;
const SCANNER_POLL_MS = 30 * 1000;
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const { GITHUB_TOKEN, GITHUB_REPOSITORY, HEAD_SHA, HEAD_REPOSITORY } = process.env;
const API = `${process.env.GITHUB_API_URL ?? 'https://api.github.com'}/repos/${GITHUB_REPOSITORY}`;

const plan = await decide();
writeFileSync('plan.json', JSON.stringify(plan, null, 2));
output('decision', plan.decision);
output('pr', String(plan.pr ?? ''));
output('ids', JSON.stringify(plan.ids));
output('message', plan.message);
console.log(JSON.stringify(plan, null, 2));

async function decide() {
  const base = { sha: HEAD_SHA, pr: null, ids: [], templates: {} };

  if (HEAD_REPOSITORY !== GITHUB_REPOSITORY) {
    return { ...base, decision: 'refuse', message: 'Fork PRs are not deployed. Ask a maintainer to review and override.' };
  }

  const pulls = await github(`/commits/${HEAD_SHA}/pulls`);
  const pr = pulls.find((pull) => pull.state === 'open' && pull.head.sha === HEAD_SHA);
  if (!pr) {
    return { ...base, decision: 'skip', message: 'No open PR has this commit as its head.' };
  }

  const files = await listFiles(pr.number);
  const touchesWorkflows = files.some((file) => file.startsWith('.github/'));
  const candidateIds = [
    ...new Set(files.map((file) => file.match(/^templates\/([^/]+)\//)?.[1]).filter(Boolean)),
  ].sort();

  const ids = [];
  for (const id of candidateIds) {
    if (ID_PATTERN.test(id) && (await exists(`templates/${id}/package.json`))) {
      ids.push(id);
    }
  }

  const withPr = { ...base, pr: pr.number };

  if (!ids.length) {
    return { ...withPr, decision: 'not-applicable', message: 'No template code changed.' };
  }

  if (touchesWorkflows) {
    return {
      ...withPr,
      ids,
      decision: 'refuse',
      message: 'This PR changes .github/ and templates, so it is not deployed automatically. A maintainer can override.',
    };
  }

  const scanner = await waitForScanner();
  if (scanner !== 'success') {
    return { ...withPr, ids, decision: 'refuse', message: scanner };
  }

  const catalog = JSON.parse(await raw('templates.json'));
  const templates = {};
  for (const id of ids) {
    const entry = catalog.templates.find((template) => template.id === id);
    if (!entry) {
      return { ...withPr, ids, decision: 'refuse', message: `templates.json has no entry for ${id}.` };
    }
    templates[id] = { deploy: entry.deploy ?? {}, routes: entry.routes ?? ['/'] };
  }

  return {
    ...withPr,
    ids,
    templates,
    decision: 'deploy',
    message: `Deploying ${ids.length} template(s) to the preview account.`,
  };
}

async function waitForScanner() {
  const deadline = Date.now() + SCANNER_WAIT_MS;
  while (Date.now() < deadline) {
    const { statuses } = await github(`/commits/${HEAD_SHA}/status`);
    const scanner = statuses.find((status) => status.context === SCANNER_CONTEXT);
    if (scanner?.state === 'success' && /public repo skipped/i.test(scanner.description ?? '')) {
      return process.env.ALLOW_UNSCANNED_SAME_REPO === 'true'
        ? 'success'
        : 'The AI Security Scanner does not scan public repositories, so previews stay off (see PREVIEW_ALLOW_UNSCANNED).';
    }
    if (scanner?.state === 'success' && /not scanned/i.test(scanner.description ?? '')) {
      return 'The AI Security Scanner skips drafts. Mark the PR ready for review to deploy it.';
    }
    if (scanner?.state === 'success') {
      return 'success';
    }
    if (scanner && ['failure', 'error'].includes(scanner.state)) {
      return `The AI Security Scanner reported ${scanner.state}; not deploying.`;
    }
    await new Promise((done) => setTimeout(done, SCANNER_POLL_MS));
  }
  return 'The AI Security Scanner did not report within 15 minutes; not deploying.';
}

async function listFiles(number) {
  const files = [];
  for (let page = 1; page <= 30; page += 1) {
    const batch = await github(`/pulls/${number}/files?per_page=100&page=${page}`);
    files.push(...batch.flatMap((file) => [file.filename, file.previous_filename].filter(Boolean)));
    if (batch.length < 100) {
      break;
    }
  }
  return files;
}

async function exists(path) {
  const response = await fetch(`${API}/contents/${path}?ref=${HEAD_SHA}`, { headers: headers() });
  return response.ok;
}

async function raw(path) {
  const response = await fetch(`${API}/contents/${path}?ref=${HEAD_SHA}`, {
    headers: { ...headers(), Accept: 'application/vnd.github.raw+json' },
  });
  if (!response.ok) {
    throw new Error(`GET ${path} at ${HEAD_SHA} returned ${response.status}`);
  }
  return response.text();
}

async function github(path) {
  const response = await fetch(`${API}${path}`, { headers: headers() });
  if (!response.ok) {
    throw new Error(`GET ${path} returned ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
  return response.json();
}

function headers() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value.replace(/\n/g, ' ')}\n`);
  }
}
