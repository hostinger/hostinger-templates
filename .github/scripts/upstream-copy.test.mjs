import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, before, test } from 'node:test';
import {
  actualEntries,
  dependabotDirectoriesCovering,
  dependabotNpmDirectories,
  diffEntries,
  expectedEntries,
  globMatches,
  hasLicense,
  inspectEntries,
  isExcluded,
  isIdentical,
  matchesPrefix,
  parseLsTree,
} from './upstream-copy.mjs';

let dir;
let upstream;

function git(...args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' } }).trim();
}

function write(path, content) {
  mkdirSync(dirname(join(dir, path)), { recursive: true });
  writeFileSync(join(dir, path), content);
}

function commit(message, { stage = true } = {}) {
  if (stage) {
    git('add', '-A');
  }
  git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', message);
  return git('rev-parse', 'HEAD');
}

// A repository whose first commit plays the upstream project and whose later
// commits vendor it into templates/app/ the way the initial import does.
before(() => {
  dir = mkdtempSync(join(tmpdir(), 'upstream-copy-'));
  git('init', '-q', '-b', 'main');
  write('LICENSE', 'MIT\n');
  write('package.json', '{}\n');
  write('src/index.js', 'export {};\n');
  write('.github/workflows/ci.yml', 'on: push\n');
  write('docs/guide.md', '# Guide\n');
  write('.env.example', 'KEY=\n');
  write('bin/run.sh', '#!/bin/sh\n');
  chmodSync(join(dir, 'bin/run.sh'), 0o755);
  upstream = commit('upstream');

  git('rm', '-r', '-q', '.');
  git('read-tree', '--prefix=templates/app/', '-u', upstream);
  git('rm', '-r', '-q', '--cached', 'templates/app/.github', 'templates/app/docs');
  rmSync(join(dir, 'templates/app/.github'), { recursive: true });
  rmSync(join(dir, 'templates/app/docs'), { recursive: true });
  write('templates/app/preview/app-thumbnail.png', 'png');
  commit('vendor');
});

after(() => rmSync(dir, { recursive: true, force: true }));

test('a faithful copy matches its upstream commit, ignoring .github/, exclusions and preview/', () => {
  const expected = expectedEntries(dir, upstream, null, ['docs']);
  const actual = actualEntries(dir, 'HEAD', 'app');
  assert.deepEqual(diffEntries(expected, actual), { added: [], changed: [], removed: [] });
  assert.ok(actual.some((entry) => entry.path === '.env.example'));
  assert.equal(actual.find((entry) => entry.path === 'bin/run.sh').mode, '100755');
  assert.ok(hasLicense(actual));
});

test('a copy that edits, adds, drops or re-modes a file differs', () => {
  write('templates/app/src/index.js', 'export const edited = true;\n');
  write('templates/app/src/extra.js', '\n');
  git('rm', '-q', 'templates/app/package.json');
  chmodSync(join(dir, 'templates/app/bin/run.sh'), 0o644);
  const head = commit('edit the copy');

  const diff = diffEntries(expectedEntries(dir, upstream, null, ['docs']), actualEntries(dir, head, 'app'));
  assert.equal(isIdentical(diff), false);
  assert.deepEqual(diff.added.map((entry) => entry.path), ['package.json']);
  assert.deepEqual(diff.changed.map((entry) => entry.path).sort(), ['bin/run.sh', 'src/index.js']);
  assert.deepEqual(diff.removed.map((entry) => entry.path), ['src/extra.js']);
  git('reset', '-q', '--hard', 'HEAD~1');
});

test('an excluded path left in the copy counts as not in upstream', () => {
  const diff = diffEntries(expectedEntries(dir, upstream, null, ['docs', 'src/']), actualEntries(dir, 'HEAD', 'app'));
  assert.deepEqual(diff.removed.map((entry) => entry.path), ['src/index.js']);
});

test('a directory source lists paths relative to that directory', () => {
  const paths = expectedEntries(dir, upstream, 'src').map((entry) => entry.path);
  assert.deepEqual(paths, ['index.js']);
});

test('submodules, LFS pointers and an upstream preview/ are problems; symlinks are notes', () => {
  git('checkout', '-q', '--detach', upstream);
  write('model.bin', 'version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 12\n');
  write('preview/shot.png', 'png');
  symlinkSync('src/index.js', join(dir, 'link.js'));
  git('add', '-A');
  git('update-index', '--add', '--cacheinfo', `160000,${upstream},vendor/lib`);
  const head = commit('awkward upstream', { stage: false });
  git('checkout', '-q', 'main');

  const { problems, notes } = inspectEntries(dir, expectedEntries(dir, head));
  assert.equal(problems.length, 3);
  assert.match(problems.join('\n'), /vendor\/lib is a git submodule/);
  assert.match(problems.join('\n'), /model\.bin is a Git LFS pointer/);
  assert.match(problems.join('\n'), /preview\/shot\.png clashes/);
  assert.deepEqual(notes, ['link.js is a symlink']);
});

test('prefix matching and exclusions', () => {
  assert.ok(matchesPrefix('docs', 'docs/'));
  assert.ok(matchesPrefix('docs/a.md', 'docs'));
  assert.ok(!matchesPrefix('docs-old/a.md', 'docs'));
  assert.ok(isExcluded('.github/workflows/ci.yml'));
  assert.ok(!isExcluded('.githubrc'));
});

test('ls-tree output parses paths with spaces and tree sizes', () => {
  const sha = 'a'.repeat(40);
  assert.deepEqual(parseLsTree(`100644 blob ${sha}      12\tsrc/a b.js\x00160000 commit ${sha}       -\tlib\x00`), [
    { mode: '100644', type: 'blob', sha, size: 12, path: 'src/a b.js' },
    { mode: '160000', type: 'commit', sha, size: null, path: 'lib' },
  ]);
});

test('license detection looks only at the copy root', () => {
  assert.ok(hasLicense([{ path: 'LICENSE.md' }]));
  assert.ok(hasLicense([{ path: 'license' }]));
  assert.ok(!hasLicense([{ path: 'docs/LICENSE' }]));
  assert.ok(!hasLicense([{ path: 'README.md' }]));
});

const DEPENDABOT = `version: 2
updates:
  - package-ecosystem: npm
    directories:
      - "/templates/*"
      - /tools # comment
    schedule:
      interval: daily
  - package-ecosystem: github-actions
    directory: "/templates/app"
`;

test('dependabot npm directories are read from directory and directories', () => {
  assert.deepEqual(dependabotNpmDirectories(DEPENDABOT), ['/templates/*', '/tools']);
});

test('a vendored directory matched by an npm glob is reported', () => {
  assert.deepEqual(dependabotDirectoriesCovering(DEPENDABOT, 'app'), ['/templates/*']);
  const explicit = DEPENDABOT.replace('"/templates/*"', '"/templates/callout"');
  assert.deepEqual(dependabotDirectoriesCovering(explicit, 'app'), []);
});

test('dependabot globs keep * inside one segment', () => {
  assert.ok(globMatches('/templates/*', '/templates/app'));
  assert.ok(!globMatches('/templates/*', '/templates/app/sub'));
  assert.ok(globMatches('/templates/**', '/templates/app/sub'));
  assert.ok(globMatches('templates/app/', '/templates/app'));
});
