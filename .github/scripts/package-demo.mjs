import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';

const MAX_NODE_ARCHIVE_BYTES = 50 * 1024 * 1024;
const STATIC_OUTPUT_FALLBACKS = ['dist', 'build', 'out'];

const templateDir = resolve(process.argv[2] ?? '');
const outRoot = resolve(process.argv[3] ?? '');
const id = basename(templateDir);

if (!process.argv[2] || !process.argv[3]) {
  console.error('Usage: package-demo.mjs <template-dir> <out-dir>');
  process.exit(1);
}

const catalog = JSON.parse(readFileSync('templates.json', 'utf8'));
const entry = catalog.templates.find((template) => template.id === id);

if (!entry) {
  console.error(`templates.json has no entry with id "${id}"`);
  process.exit(1);
}

const deploy = entry.deploy ?? {};
const outDir = join(outRoot, id);
mkdirSync(outDir, { recursive: true });

const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const archive = join(outDir, `${id}_${stamp}.zip`);

const staticDir = deploy.entryFile
  ? null
  : [deploy.outputDirectory, ...STATIC_OUTPUT_FALLBACKS]
      .filter(Boolean)
      .map((dir) => join(templateDir, dir))
      .find((dir) => existsSync(join(dir, 'index.html')));

let kind;
let title = null;

if (staticDir) {
  kind = 'static';
  title = readTitle(join(staticDir, 'index.html'));
  execFileSync('zip', ['-qr', archive, '.'], { cwd: staticDir, stdio: 'inherit' });
} else {
  kind = 'node';
  const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: templateDir,
    encoding: 'utf8',
  }).trim();
  execFileSync(
    'git',
    [
      'archive',
      '--format=zip',
      `--output=${archive}`,
      `HEAD:${relative(repoRoot, templateDir)}`,
      '--',
      ':(exclude)preview',
    ],
    { cwd: repoRoot, stdio: 'inherit' },
  );
  if (statSync(archive).size > MAX_NODE_ARCHIVE_BYTES) {
    console.error(`${basename(archive)} is over the 50 MB Node.js deploy limit`);
    process.exit(1);
  }
}

writeFileSync(
  join(outDir, 'meta.json'),
  JSON.stringify({ id, kind, archive: basename(archive), title, deploy }, null, 2),
);

console.log(`Packaged ${id} as ${kind}: ${basename(archive)}`);

function readTitle(file) {
  const match = readFileSync(file, 'utf8').match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1].trim() || null;
}
