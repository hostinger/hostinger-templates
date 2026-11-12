import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import {
  auditPolicy,
  catalogEntry,
  installArgs,
  packageManager,
  packageManagerCommand,
  previewArgs,
  previewPlan,
  staticOutputDir,
} from './template-commands.mjs';

const root = mkdtempSync(join(tmpdir(), 'template-commands-'));
after(() => rmSync(root, { recursive: true, force: true }));

const VENDORED = { id: 'app', source: { repository: 'owner/app' }, deploy: {} };
const OURS = { id: 'app', deploy: {} };

function template(name, files = {}) {
  const dir = join(root, name, 'app');
  mkdirSync(dir, { recursive: true });
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
}

test('the catalog entry is found by the folder name', () => {
  const catalog = join(root, 'templates.json');
  writeFileSync(catalog, JSON.stringify({ templates: [VENDORED] }));
  assert.deepEqual(catalogEntry(template('catalog'), catalog), VENDORED);
  assert.equal(catalogEntry(join(root, 'other'), catalog), null);
});

test('our templates always use npm; vendored ones follow their lockfile', () => {
  const pnpm = template('pnpm', { 'pnpm-lock.yaml': '' });
  assert.equal(packageManager(pnpm, OURS), 'npm');
  assert.equal(packageManager(pnpm, VENDORED), 'pnpm');
  assert.equal(packageManager(template('yarn', { 'yarn.lock': '' }), VENDORED), 'yarn');
  assert.equal(packageManager(template('npm', { 'package-lock.json': '{}', 'yarn.lock': '' }), VENDORED), 'npm');
  assert.throws(() => packageManager(template('none'), VENDORED), /no package-lock.json/);
});

test('pnpm and yarn run through corepack with a frozen lockfile', () => {
  assert.deepEqual(packageManagerCommand('npm', installArgs('npm')), ['npm', ['ci']]);
  assert.deepEqual(packageManagerCommand('pnpm', installArgs('pnpm')), ['corepack', ['pnpm', 'install', '--frozen-lockfile']]);
  assert.deepEqual(packageManagerCommand('yarn', installArgs('yarn')), ['corepack', ['yarn', 'install', '--frozen-lockfile']]);
});

test('static output is the configured directory or a fallback with index.html', () => {
  const dir = template('static', { 'build/index.html': '<html>', 'site/index.html': '<html>' });
  assert.equal(staticOutputDir(dir, {}), join(dir, 'build'));
  assert.equal(staticOutputDir(dir, { outputDirectory: 'site' }), join(dir, 'site'));
  assert.equal(staticOutputDir(dir, { entryFile: 'server.js' }), null);
  assert.equal(staticOutputDir(template('server'), {}), null);
});

test('preview flags go after "--" for npm only', () => {
  assert.deepEqual(previewArgs('astro preview', 4173), ['--', '--host', '127.0.0.1', '--port', '4173']);
  assert.deepEqual(previewArgs('astro preview', 4173, 'pnpm'), ['--host', '127.0.0.1', '--port', '4173']);
  assert.deepEqual(previewArgs('next start', 4173), []);
});

test('a preview script wins for every template', () => {
  const plan = previewPlan({ templateDir: template('preview'), pkg: { scripts: { preview: 'vite preview' } }, entry: VENDORED, pm: 'pnpm', port: 4173 });
  assert.equal(plan.command, 'corepack');
  assert.deepEqual(plan.args, ['pnpm', 'run', 'preview', '--host', '127.0.0.1', '--port', '4173']);
});

test('our templates still need a preview script', () => {
  const plan = previewPlan({ templateDir: template('ours', { 'dist/index.html': '' }), pkg: { scripts: {} }, entry: OURS, pm: 'npm', port: 4173 });
  assert.match(plan.error, /missing a preview script/);
});

test('vendored static output is served as files', () => {
  const dir = template('vendored-static', { 'build/index.html': '' });
  const plan = previewPlan({ templateDir: dir, pkg: { scripts: { start: 'vite' } }, entry: VENDORED, pm: 'npm', port: 4173 });
  assert.equal(plan.command, 'npx');
  assert.deepEqual(plan.args, ['--yes', 'serve@14', '-s', join(dir, 'build'), '-l', 'tcp://127.0.0.1:4173']);
});

test('a vendored Next.js app runs its start script', () => {
  const pkg = { scripts: { start: 'next start' }, dependencies: { next: '16.0.0' } };
  const plan = previewPlan({ templateDir: template('next'), pkg, entry: VENDORED, pm: 'npm', port: 4173 });
  assert.deepEqual([plan.command, plan.args], ['npm', ['run', 'start']]);
  const other = previewPlan({ templateDir: template('next'), pkg: { scripts: { start: 'node server.js' } }, entry: VENDORED, pm: 'npm', port: 4173 });
  assert.match(other.error, /not a Next.js app/);
});

test('audit policy depends on whether a vendored template deploys static files', () => {
  assert.equal(auditPolicy(template('policy-ours', { 'dist/index.html': '' }), OURS), 'regression');
  assert.equal(auditPolicy(template('policy-static', { 'dist/index.html': '' }), VENDORED), 'static-warn');
  assert.equal(auditPolicy(template('policy-server'), VENDORED), 'server-strict');
});
