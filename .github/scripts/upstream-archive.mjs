import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectArchive } from './inspect-archive.mjs';

// Archives one commit of a public GitHub repository for a Hostinger Node.js
// build. The code is fetched and zipped with git; nothing from it runs here.
//
//   upstream-archive.mjs <template-id> <out-dir> [--plan plan.json]
//
// Reads the pinned source from templates.json's upstream list, or from the
// trusted plan.json of a PR deploy, and writes <out-dir>/<id>/ with the
// archive and the meta.json deploy-demos.mjs reads.

const COMMIT_PATTERN = /^[0-9a-f]{40}$/;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const DIRECTORY_PATTERN = /^[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)*$/;

export function archiveUpstream({ repository, commit, directory = null }, demoDir, id) {
  if (!REPOSITORY_PATTERN.test(repository ?? '')) {
    throw new Error(`"${repository}" is not owner/repo`);
  }
  if (!COMMIT_PATTERN.test(commit ?? '')) {
    throw new Error(`"${commit}" is not a full commit SHA`);
  }
  if (directory && (!DIRECTORY_PATTERN.test(directory) || directory.split('/').some((part) => part === '..' || part === '.'))) {
    throw new Error(`"${directory}" is not a directory inside the repository`);
  }

  const checkout = mkdtempSync(join(tmpdir(), 'upstream-'));
  try {
    const git = (...args) =>
      execFileSync('git', args, { cwd: checkout, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
    git('init', '--quiet');
    git('fetch', '--quiet', '--depth=1', '--no-tags', `https://github.com/${repository}.git`, commit);

    mkdirSync(demoDir, { recursive: true });
    const archive = `${id}_${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}.zip`;
    git('archive', '--format=zip', `--output=${join(demoDir, archive)}`, directory ? `${commit}:${directory}` : commit);

    const inspection = inspectArchive(join(demoDir, archive), { kind: 'node' });
    if (!inspection.ok) {
      throw new Error(`archive rejected (${inspection.problems.slice(0, 3).join('; ')})`);
    }
    return { archive, inspection };
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
}

function main() {
  const args = process.argv.slice(2);
  const planIndex = args.indexOf('--plan');
  const planFile = planIndex === -1 ? null : args[planIndex + 1];
  const [id, outRoot] = args.filter((_, index) => planIndex === -1 || (index !== planIndex && index !== planIndex + 1));

  if (!id || !outRoot) {
    console.error('Usage: upstream-archive.mjs <template-id> <out-dir> [--plan plan.json]');
    process.exit(1);
  }

  const entry = planFile ? readPlanEntry(planFile, id) : readCatalogEntry(id);
  const demoDir = join(resolve(outRoot), id);
  const { archive, inspection } = archiveUpstream(entry.source, demoDir, id);
  writeFileSync(
    join(demoDir, 'meta.json'),
    JSON.stringify(
      { id, kind: 'node', archive, title: null, deploy: entry.deploy ?? {}, routes: entry.routes ?? ['/'] },
      null,
      2,
    ),
  );
  console.log(
    `Archived ${entry.source.repository}@${entry.source.commit.slice(0, 7)} as ${archive} ` +
      `(${inspection.entries} entries, ${inspection.uncompressed} bytes uncompressed)`,
  );
}

function readCatalogEntry(id) {
  const catalog = JSON.parse(readFileSync('templates.json', 'utf8'));
  const entry = (catalog.upstream ?? []).find((template) => template.id === id);
  if (!entry) {
    fail(`templates.json has no upstream entry with id "${id}"`);
  }
  return entry;
}

function readPlanEntry(planFile, id) {
  const plan = JSON.parse(readFileSync(planFile, 'utf8'));
  const entry = plan.templates?.[id];
  if (!plan.upstream?.includes(id) || !entry?.source) {
    fail(`${id} is not an upstream template in this run's plan`);
  }
  return entry;
}

function fail(message) {
  console.log(`::error::${message}`);
  process.exit(1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    fail(error.message);
  }
}
