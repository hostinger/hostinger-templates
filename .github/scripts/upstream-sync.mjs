import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { checkPin, createUpstreamClient, latestPin } from './repo-evaluation/upstream.mjs';
import {
  actualEntries,
  diffEntries,
  dropFetchedCommit,
  expectedEntries,
  fetchCommit,
  hasLicense,
  inspectEntries,
  readBlob,
  templateRoot,
} from './upstream-copy.mjs';

// Keeps vendored templates (templates.json entries with a source) in step
// with their upstream repositories.
//
//   upstream-sync.mjs check
//       writes upstream-sync.json: every vendored template whose newer
//       release or branch commit passes the Template gate's pin checks
//   upstream-sync.mjs push <id> [--base <rev>] [--dry-run]
//       builds one commit on top of --base (default HEAD) that turns
//       templates/<id>/ into the upstream tree at the checked commit and
//       moves source.ref/commit in templates.json, then points
//       upstream-sync/<id> at it and writes pr-body.md. It skips a branch
//       with commits it didn't make and a pin whose PR was closed unmerged.
//       --dry-run prints the plan and writes nothing to GitHub.
//
// push goes through the Git Data API with no author or committer, so GitHub
// signs the commit, and uploads only the blobs that changed. The workflow
// opens or refreshes the PR; the Template gate and preview deploy on that PR
// prove the new code, and a person merges it.

export const MAX_BLOBS = 400;
const BRANCH_PREFIX = 'upstream-sync/';
const SYNC_FILE = 'upstream-sync.json';
const CATALOG = 'templates.json';
const UPLOAD_DELAY_MS = 100;
const API = 'https://api.github.com';

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, id] = process.argv.slice(2);
  try {
    if (command === 'check') {
      await check();
    } else if (command === 'push' && id) {
      await push(id, { base: optionValue('--base') ?? 'HEAD', dryRun: process.argv.includes('--dry-run') });
    } else {
      console.error('Usage: upstream-sync.mjs check | push <template-id> [--base <rev>] [--dry-run]');
      process.exitCode = 1;
    }
  } catch (error) {
    console.log(`::error::${error.message}`);
    process.exitCode = 1;
  }
}

// templates.json with id's source moved to the new pin, formatted the way
// the file is kept so the diff is just those two lines.
export function updateCatalog(catalogText, id, to) {
  const catalog = JSON.parse(catalogText);
  const entry = catalog.templates.find((candidate) => candidate.id === id);
  if (!entry?.source) {
    throw new Error(`${id} is not a vendored template in ${CATALOG}`);
  }
  entry.source = { ...entry.source, ref: to.ref, commit: to.commit };
  return `${toAsciiJson(catalog)}\n`;
}

// The Git Data API calls for one sync. uploads are the distinct blobs GitHub
// may not have yet; tree lists every path to set or delete (sha null) under
// templates/<id>/ on top of the base tree, plus the new templates.json.
export function planSync({ id, diff, catalogSha }) {
  const root = templateRoot(id);
  const set = [...diff.added, ...diff.changed];
  const newBlobs = set.filter((entry) => entry.from?.sha !== entry.sha);
  const uploads = [...new Map(newBlobs.map((entry) => [entry.sha, entry])).values()].map(({ sha, path }) => ({ sha, path }));
  const tree = [
    ...set.map(({ path, mode, sha }) => ({ path: `${root}/${path}`, mode, type: 'blob', sha })),
    ...diff.removed.map(({ path, mode }) => ({ path: `${root}/${path}`, mode, type: 'blob', sha: null })),
    { path: CATALOG, mode: '100644', type: 'blob', sha: catalogSha },
  ];
  return {
    uploads,
    tree,
    counts: { added: diff.added.length, changed: diff.changed.length, removed: diff.removed.length },
    tooLarge: uploads.length > MAX_BLOBS,
  };
}

export function renderBody({ id, repository, from, to, counts }) {
  const compare = `https://github.com/${repository}/compare/${from.commit}...${to.commit}`;
  return [
    `Syncs the vendored \`${id}\` template from \`${label(from)}\` to \`${label(to)}\` of [${repository}](https://github.com/${repository}).`,
    '',
    `- Upstream changes: ${compare}`,
    to.publishedAt ? `- Release: ${to.url} (published ${to.publishedAt.slice(0, 10)})` : `- Commit: ${to.url}`,
    `- \`${templateRoot(id)}/\`: ${counts.added} added, ${counts.changed} changed, ${counts.removed} removed (\`preview/\` untouched)`,
    '- Checked before opening: the ref points at the commit, the license is still the one in `source.license`, and the deployability rules pass at the new commit.',
    '',
    `The Template gate checks that \`${templateRoot(id)}/\` is the upstream tree at the new commit and builds, lints and audits it. ` +
      `Before merging, check that the Hostinger preview deploy (\`hostinger-build\`) is green and compare the preview with the screenshots in ` +
      `\`${templateRoot(id)}/preview/\`. Re-capture them if the design changed.`,
    '',
    'Opened by the weekly `upstream-sync` workflow, which never merges.',
  ].join('\n');
}

async function check() {
  const client = createUpstreamClient();
  const rows = [];
  for (const entry of readCatalog().templates.filter((candidate) => candidate.source)) {
    const row = { id: entry.id, repository: entry.source.repository, from: pick(entry.source) };
    try {
      const latest = await latestPin(entry.source, client);
      row.to = latest;
      if (latest.commit === entry.source.commit) {
        rows.push({ ...row, status: 'current' });
        continue;
      }
      const { problems } = await checkPin({ ...entry.source, ref: latest.ref, commit: latest.commit }, client);
      rows.push({ ...row, status: problems.length ? 'blocked' : 'update', problems });
    } catch (error) {
      rows.push({ ...row, status: 'error', problems: [error.message] });
    }
  }

  writeFileSync(SYNC_FILE, JSON.stringify(rows, null, 2));
  const updates = rows.filter((row) => row.status === 'update').map((row) => row.id);
  output('updates', JSON.stringify(updates));
  report(renderSummary(rows));
}

async function push(id, { base, dryRun }) {
  const row = JSON.parse(readFileSync(SYNC_FILE, 'utf8')).find((candidate) => candidate.id === id);
  if (row?.status !== 'update') {
    fail(`${id} has no checked update in ${SYNC_FILE}`);
  }

  const gitDir = process.cwd();
  const baseCommit = git(gitDir, 'rev-parse', `${base}^{commit}`);
  const catalogText = git(gitDir, 'show', `${baseCommit}:${CATALOG}`);
  const { source } = JSON.parse(catalogText).templates.find((candidate) => candidate.id === id) ?? {};
  if (source?.commit !== row.from.commit) {
    fail(`${id} is pinned to ${source?.commit ?? 'nothing'} at ${base}, not ${row.from.commit}; re-run check`);
  }

  fetchCommit(gitDir, source.repository, row.to.commit);
  try {
    const expected = expectedEntries(gitDir, row.to.commit, source.directory, source.exclude);
    const { problems } = inspectEntries(gitDir, expected);
    if (!hasLicense(expected)) {
      problems.push(`the upstream tree at ${row.to.commit.slice(0, 7)} has no LICENSE file at its root`);
    }
    if (problems.length) {
      fail(`${id} can't be synced to ${label(row.to)}: ${problems.join('; ')}`);
    }

    const diff = diffEntries(expected, actualEntries(gitDir, baseCommit, id));
    const catalog = updateCatalog(catalogText, id, row.to);
    const catalogSha = execFileSync('git', ['hash-object', '--stdin'], { cwd: gitDir, input: catalog, encoding: 'utf8' }).trim();
    const plan = planSync({ id, diff, catalogSha });
    if (plan.tooLarge) {
      fail(
        `${id}: ${label(row.to)} changes ${plan.uploads.length} files, more than the ${MAX_BLOBS} the bot uploads. ` +
          'A person must import it locally (see README, "Upstream templates").',
      );
    }

    const branch = `${BRANCH_PREFIX}${id}`;
    const title = `Sync ${id} with ${source.repository} ${label(row.to)}`;
    writeFileSync('pr-body.md', `${renderBody({ id, repository: source.repository, from: row.from, to: row.to, counts: plan.counts })}\n`);

    if (dryRun) {
      const baseTree = git(gitDir, 'rev-parse', `${baseCommit}^{tree}`);
      console.log(JSON.stringify({ branch, title, parent: baseCommit, baseTree, counts: plan.counts, uploads: plan.uploads, tree: plan.tree }, null, 2));
      console.log(`Dry run: would upload ${plan.uploads.length + 1} blobs and point ${branch} at the new commit. Nothing was written to GitHub.`);
      return;
    }

    const api = createApi(process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN, process.env.GITHUB_REPOSITORY);
    const skip = await skipReason(api, { id, branch, title, commit: row.to.commit, baseCommit });
    if (skip) {
      console.log(skip);
      output('pushed', 'false');
      return;
    }

    for (const [index, upload] of plan.uploads.entries()) {
      await uploadBlob(api, readBlob(gitDir, upload.sha), upload.sha);
      if (index % 50 === 49) {
        console.log(`Uploaded ${index + 1}/${plan.uploads.length} blobs`);
      }
      await sleep(UPLOAD_DELAY_MS);
    }
    await uploadBlob(api, Buffer.from(catalog), catalogSha);

    const tree = await api('POST', '/git/trees', { base_tree: git(gitDir, 'rev-parse', `${baseCommit}^{tree}`), tree: plan.tree });
    const commit = await api('POST', '/git/commits', { message: title, tree: tree.sha, parents: [baseCommit] });
    if (await api('GET', `/git/ref/heads/${branch}`, null, { allow404: true })) {
      await api('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha, force: true });
    } else {
      await api('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commit.sha });
    }

    console.log(`Pointed ${branch} at ${commit.sha}: ${title}`);
    output('pushed', 'true');
    output('branch', branch);
    output('title', title);
  } finally {
    dropFetchedCommit(gitDir, row.to.commit);
  }
}

// Why push must leave the branch alone, or null when it may move it.
async function skipReason(api, { id, branch, title, commit, baseCommit }) {
  const [owner] = process.env.GITHUB_REPOSITORY.split('/');
  const pulls = await api('GET', `/pulls?state=all&per_page=100&head=${encodeURIComponent(`${owner}:${branch}`)}`);
  const declined = declinedPull(pulls, title);
  if (declined) {
    return `::notice::#${declined.number} (${title}) was closed without merging, so it isn't reopened. Reopen it to retry; a newer upstream pin opens a new PR.`;
  }
  if (pulls.some((pull) => pull.state === 'open') && (await branchPins(api, branch, id)) === commit) {
    // A new push would only restart its checks and preview deploy.
    return `An open PR from ${branch} already syncs ${id} to this commit.`;
  }
  const compare = await api('GET', `/compare/${baseCommit}...${encodeURIComponent(branch)}`, null, { allow404: true });
  const foreign = foreignCommits(compare?.commits ?? [], id);
  if (foreign.length) {
    return (
      `::warning::${branch} has commits the bot didn't make (${foreign.map((sha) => sha.slice(0, 7)).join(', ')}), ` +
      'such as re-captured screenshots. It is left for a person to update.'
    );
  }
  return null;
}

// A closed, unmerged PR with this exact title declined this pin.
export function declinedPull(pulls, title) {
  return pulls.find((pull) => pull.state === 'closed' && !pull.merged_at && pull.title === title) ?? null;
}

// Commits on the branch beyond the base that aren't a single-parent sync
// commit for id. A person's commit or a merge of main would be lost by the
// force update.
export function foreignCommits(commits, id) {
  return commits
    .filter((entry) => entry.parents.length !== 1 || !entry.commit.message.startsWith(`Sync ${id} with `))
    .map((entry) => entry.sha);
}

async function branchPins(api, branch, id) {
  const file = await api('GET', `/contents/${CATALOG}?ref=${encodeURIComponent(branch)}`, null, { raw: true, allow404: true });
  return file && JSON.parse(file).templates?.find((candidate) => candidate.id === id)?.source?.commit;
}

async function uploadBlob(api, content, expectedSha) {
  const { sha } = await api('POST', '/git/blobs', { content: content.toString('base64'), encoding: 'base64' });
  if (sha !== expectedSha) {
    throw new Error(`GitHub stored a blob as ${sha}, expected ${expectedSha}`);
  }
}

function createApi(token, repository) {
  if (!token || !repository) {
    fail('push needs GH_TOKEN (or GITHUB_TOKEN) and GITHUB_REPOSITORY; use --dry-run to only print the plan');
  }
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'hostinger-templates-upstream-sync',
  };
  return async function request(method, path, body = null, { raw = false, allow404 = false } = {}) {
    for (let attempt = 1; ; attempt++) {
      const response = await fetch(`${API}/repos/${repository}${path}`, {
        method,
        headers: raw ? { ...headers, Accept: 'application/vnd.github.raw+json' } : headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (allow404 && response.status === 404) {
        return null;
      }
      // Secondary rate limits answer 403 or 429 with retry-after.
      const retryAfter = Number(response.headers.get('retry-after'));
      if ([403, 429].includes(response.status) && retryAfter && attempt < 4) {
        await sleep(retryAfter * 1000);
        continue;
      }
      if (!response.ok) {
        throw new Error(`${method} ${path} returned ${response.status}: ${(await response.text()).slice(0, 200)}`);
      }
      return raw ? response.text() : response.json();
    }
  };
}

function renderSummary(rows) {
  const status = { current: '✅ current', update: '⬆️ PR', blocked: '⛔ newer pin fails checks', error: '❌ error' };
  const lines = ['## Upstream sync', '', '| Template | Pinned | Newest | Result |', '| --- | --- | --- | --- |'];
  for (const row of rows) {
    const details = row.problems?.length ? ` ${row.problems.join('; ').replace(/\|/g, '\\|')}` : '';
    lines.push(`| \`${row.id}\` | \`${label(row.from)}\` | ${row.to ? `\`${label(row.to)}\`` : '—'} | ${status[row.status]}${details} |`);
  }
  return lines.join('\n');
}

function report(markdown) {
  console.log(markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }
}

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

function fail(message) {
  throw new Error(message);
}

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).replace(/\n$/, '');
}

function pick({ ref, commit }) {
  return { ref, commit };
}

function label({ ref, commit }) {
  return `${ref}@${commit.slice(0, 7)}`;
}

function readCatalog() {
  return JSON.parse(readFileSync(CATALOG, 'utf8'));
}

function optionValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
}

// templates.json escapes every non-ASCII character.
function toAsciiJson(value) {
  return JSON.stringify(value, null, 2).replace(
    /[\u0080-￿]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
}
