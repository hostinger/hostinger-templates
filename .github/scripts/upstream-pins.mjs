import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { checkPin, createUpstreamClient, latestPin } from './repo-evaluation/upstream.mjs';

// Keeps upstream templates current without copying their code.
//
//   upstream-pins.mjs check            writes pins.json: every upstream template
//                                      whose newer release or branch commit
//                                      passes the Template gate's pin checks
//   upstream-pins.mjs apply <id>       moves <id>'s pin in templates.json to the
//                                      checked commit and writes pr-body.md
//
// The workflow opens one PR per template. Its Template gate and Hostinger
// preview deploy prove the new commit still builds and answers before anyone
// merges it, and merging redeploys the demo.

const [command, id] = process.argv.slice(2);
const PINS_FILE = 'pins.json';

if (command === 'check') {
  await check();
} else if (command === 'apply' && id) {
  apply(id);
} else {
  console.error('Usage: upstream-pins.mjs check | apply <template-id>');
  process.exit(1);
}

async function check() {
  const client = createUpstreamClient();
  const rows = [];
  for (const entry of readCatalog().upstream ?? []) {
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

  writeFileSync(PINS_FILE, JSON.stringify(rows, null, 2));
  const updates = rows.filter((row) => row.status === 'update').map((row) => row.id);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `updates=${JSON.stringify(updates)}\n`);
  }

  const summary = renderSummary(rows);
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
  }
}

function apply(templateId) {
  const row = JSON.parse(readFileSync(PINS_FILE, 'utf8')).find((candidate) => candidate.id === templateId);
  if (row?.status !== 'update') {
    console.error(`${templateId} has no checked update in ${PINS_FILE}`);
    process.exit(1);
  }

  const catalog = readCatalog();
  const entry = catalog.upstream.find((candidate) => candidate.id === templateId);
  entry.source = { ...entry.source, ref: row.to.ref, commit: row.to.commit };
  writeFileSync('templates.json', `${toAsciiJson(catalog)}\n`);

  const { repository } = row;
  const compare = `https://github.com/${repository}/compare/${row.from.commit}...${row.to.commit}`;
  const body = [
    `Moves the \`${templateId}\` upstream template from \`${label(row.from)}\` to \`${label(row.to)}\` of [${repository}](https://github.com/${repository}).`,
    '',
    `- Upstream changes: ${compare}`,
    row.to.publishedAt ? `- Release: ${row.to.url} (published ${row.to.publishedAt.slice(0, 10)})` : `- Commit: ${row.to.url}`,
    '- Checked before opening: the ref points at the commit, the license is still the one in `source.license`, and the deployability rules pass at the new commit.',
    '',
    'Before merging, check that the Hostinger preview deploy (`hostinger-build`) is green, and compare the preview with the catalog screenshots in `upstream/' +
      templateId +
      '/preview/`. Re-capture them if the design changed. Merging redeploys the demo at ' +
      `${entry.demoUrl ?? 'its demo URL'}.`,
    '',
    'Opened by the weekly `upstream-pins` workflow.',
  ].join('\n');
  writeFileSync('pr-body.md', `${body}\n`);
  console.log(`Pinned ${templateId} to ${label(row.to)}`);
}

function renderSummary(rows) {
  const status = { current: '✅ current', update: '⬆️ PR', blocked: '⛔ newer pin fails checks', error: '❌ error' };
  const lines = ['## Upstream pins', '', '| Template | Pinned | Newest | Result |', '| --- | --- | --- | --- |'];
  for (const row of rows) {
    const details = row.problems?.length ? ` ${row.problems.join('; ').replace(/\|/g, '\\|')}` : '';
    lines.push(
      `| \`${row.id}\` | \`${label(row.from)}\` | ${row.to ? `\`${label(row.to)}\`` : '—'} | ${status[row.status]}${details} |`,
    );
  }
  return lines.join('\n');
}

function pick({ ref, commit }) {
  return { ref, commit };
}

function label({ ref, commit }) {
  return `${ref}@${commit.slice(0, 7)}`;
}

function readCatalog() {
  return JSON.parse(readFileSync('templates.json', 'utf8'));
}

// templates.json escapes every non-ASCII character, so a pin bump diffs only
// the two changed lines.
function toAsciiJson(value) {
  return JSON.stringify(value, null, 2).replace(
    /[\u0080-￿]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
}
