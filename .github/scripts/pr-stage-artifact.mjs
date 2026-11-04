import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { inspectArchive } from './inspect-archive.mjs';

// Turns one downloaded PR artifact into a deploy input deploy-demos.mjs can
// trust. The artifact was built from untrusted PR code, so only two things
// come from it: the archive bytes (inspected, never extracted or run here)
// and the page title (used only for comparison). Everything else comes from
// plan.json, which the trusted plan job read from the GitHub API.
// Usage: pr-stage-artifact.mjs <incoming-dir> <plan.json> <template-id> <out-dir>

const [incomingDir, planFile, id, outDir] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planFile, 'utf8'));

if (!plan.ids.includes(id) || !plan.templates[id]) {
  fail(`${id} is not in this run's plan`);
}

const files = readdirSync(incomingDir);
const archives = files.filter((name) => name.endsWith('.zip'));
const archivePattern = new RegExp(`^${id}_\\d{14}\\.zip$`);
if (archives.length !== 1 || !archivePattern.test(archives[0])) {
  fail(`expected exactly one ${id}_<timestamp>.zip, found ${JSON.stringify(archives)}`);
}
if (files.some((name) => name !== 'meta.json' && name !== archives[0])) {
  fail(`unexpected files in the artifact: ${JSON.stringify(files)}`);
}

let meta;
try {
  meta = JSON.parse(readFileSync(join(incomingDir, 'meta.json'), 'utf8'));
} catch (error) {
  fail(`unreadable meta.json: ${error.message}`);
}

if (meta.id !== id || !['static', 'node'].includes(meta.kind) || meta.archive !== archives[0]) {
  fail('meta.json does not describe this template and archive');
}
if (meta.kind === 'static' && plan.templates[id].deploy.entryFile) {
  fail('the catalog gives this template an entry file, so it cannot be a static archive');
}

const title =
  typeof meta.title === 'string' && meta.title.length <= 300 && !/[\u0000-\u001f]/.test(meta.title) ? meta.title : null;

const inspection = inspectArchive(join(incomingDir, archives[0]), { kind: meta.kind });
if (!inspection.ok) {
  fail(`the archive was rejected: ${inspection.problems.join('; ')}`);
}

const target = join(outDir, id);
mkdirSync(target, { recursive: true });
copyFileSync(join(incomingDir, archives[0]), join(target, archives[0]));
writeFileSync(
  join(target, 'meta.json'),
  JSON.stringify(
    {
      id,
      kind: meta.kind,
      archive: archives[0],
      title,
      deploy: plan.templates[id].deploy,
      routes: plan.templates[id].routes,
    },
    null,
    2,
  ),
);
console.log(`Staged ${id} (${meta.kind}, ${inspection.entries} entries, ${inspection.uncompressed} bytes uncompressed)`);

function fail(message) {
  console.log(`::error title=${id} artifact rejected::${message}`);
  process.exit(1);
}
