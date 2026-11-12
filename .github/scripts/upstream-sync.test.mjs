import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { MAX_BLOBS, declinedPull, foreignCommits, planSync, renderBody, updateCatalog } from './upstream-sync.mjs';

const sha = (char) => char.repeat(40);

const diff = {
  added: [{ path: 'src/new.js', mode: '100644', sha: sha('a') }],
  changed: [
    { path: 'bin/run.sh', mode: '100755', sha: sha('b'), from: { mode: '100644', sha: sha('c') } },
    { path: 'src/copy.js', mode: '100644', sha: sha('a'), from: { mode: '100644', sha: sha('d') } },
  ],
  removed: [{ path: 'old/link', mode: '120000', sha: sha('e') }],
};

test('a sync sets added and changed paths, deletes removed ones and replaces templates.json', () => {
  const plan = planSync({ id: 'app', diff, catalogSha: sha('f') });
  assert.deepEqual(plan.tree, [
    { path: 'templates/app/src/new.js', mode: '100644', type: 'blob', sha: sha('a') },
    { path: 'templates/app/bin/run.sh', mode: '100755', type: 'blob', sha: sha('b') },
    { path: 'templates/app/src/copy.js', mode: '100644', type: 'blob', sha: sha('a') },
    { path: 'templates/app/old/link', mode: '120000', type: 'blob', sha: null },
    { path: 'templates.json', mode: '100644', type: 'blob', sha: sha('f') },
  ]);
  assert.deepEqual(plan.counts, { added: 1, changed: 2, removed: 1 });
  assert.equal(plan.tooLarge, false);
});

test('a blob used at two paths is uploaded once', () => {
  const plan = planSync({ id: 'app', diff, catalogSha: sha('f') });
  assert.deepEqual(plan.uploads.map((upload) => upload.sha), [sha('a'), sha('b')]);
});

test('a mode-only change uploads nothing new but still sets the path', () => {
  const modeOnly = { added: [], changed: [{ path: 'bin/run.sh', mode: '100755', sha: sha('b'), from: { mode: '100644', sha: sha('b') } }], removed: [] };
  const plan = planSync({ id: 'app', diff: modeOnly, catalogSha: sha('f') });
  assert.equal(plan.tree[0].mode, '100755');
  assert.equal(plan.uploads.length, 0);
});

test('more distinct blobs than the limit marks the sync too large', () => {
  const many = (count) => ({
    added: Array.from({ length: count }, (_, index) => ({ path: `f${index}`, mode: '100644', sha: index.toString(16).padStart(40, '0') })),
    changed: [],
    removed: [],
  });
  assert.equal(planSync({ id: 'app', diff: many(MAX_BLOBS), catalogSha: sha('f') }).tooLarge, false);
  assert.equal(planSync({ id: 'app', diff: many(MAX_BLOBS + 1), catalogSha: sha('f') }).tooLarge, true);
});

test('the catalog update moves only the pin and keeps the file format', () => {
  const catalog = {
    templates: [
      { id: 'app', title: 'Café', source: { repository: 'o/r', track: 'branch', ref: 'main', commit: sha('1'), license: 'MIT' } },
      { id: 'own', title: 'Own' },
    ],
  };
  const before = `${JSON.stringify(catalog, null, 2).replace('é', '\\u00e9')}\n`;
  const after = updateCatalog(before, 'app', { ref: 'main', commit: sha('2') });
  const changed = after.split('\n').filter((line, index) => line !== before.split('\n')[index]);
  assert.deepEqual(changed, [`        "commit": "${sha('2')}",`]);
  assert.match(after, /Caf\\u00e9/);
  assert.throws(() => updateCatalog(before, 'own', { ref: 'main', commit: sha('2') }), /not a vendored template/);
});

test('the PR body links the upstream compare and counts the files', () => {
  const body = renderBody({
    id: 'app',
    repository: 'o/r',
    from: { ref: 'v1', commit: sha('1') },
    to: { ref: 'v2', commit: sha('2'), publishedAt: '2026-11-01T00:00:00Z', url: 'https://github.com/o/r/releases/tag/v2' },
    counts: { added: 1, changed: 2, removed: 3 },
  });
  assert.match(body, new RegExp(`https://github.com/o/r/compare/${sha('1')}\\.\\.\\.${sha('2')}`));
  assert.match(body, /1 added, 2 changed, 3 removed/);
  assert.match(body, /published 2026-11-01/);
});

test('a closed, unmerged PR for the same pin declines it; merged ones and other pins do not', () => {
  const title = 'Sync app with o/r v2@2222222';
  const pulls = [
    { number: 1, state: 'closed', merged_at: '2026-11-01T00:00:00Z', title },
    { number: 2, state: 'closed', merged_at: null, title: 'Sync app with o/r v1@1111111' },
  ];
  assert.equal(declinedPull(pulls, title), null);
  assert.equal(declinedPull([...pulls, { number: 3, state: 'closed', merged_at: null, title }], title).number, 3);
  assert.equal(declinedPull([{ number: 4, state: 'open', merged_at: null, title }], title), null);
});

test('only single-parent sync commits for the template belong to the bot', () => {
  const commit = (char, message, parents = 1) => ({ sha: sha(char), commit: { message }, parents: Array(parents).fill({}) });
  assert.deepEqual(foreignCommits([commit('1', 'Sync app with o/r v2@2222222')], 'app'), []);
  assert.deepEqual(
    foreignCommits(
      [
        commit('1', 'Sync app with o/r v2@2222222'),
        commit('2', 'Re-capture app screenshots'),
        commit('3', "Merge branch 'main' into upstream-sync/app", 2),
        commit('4', 'Sync other with o/r v2@2222222'),
      ],
      'app',
    ),
    [sha('2'), sha('3'), sha('4')],
  );
});

test('push --dry-run plans the sync from a local upstream commit without calling GitHub', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'upstream-sync-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GITHUB_OUTPUT: '', GITHUB_STEP_SUMMARY: '' };
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', env }).trim();
  const write = (path, content) => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  };
  const commit = (message) => {
    git('add', '-A');
    git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', message);
    return git('rev-parse', 'HEAD');
  };

  git('init', '-q', '-b', 'main');
  write('LICENSE', 'MIT\n');
  write('src/a.js', 'a\n');
  write('src/gone.js', 'gone\n');
  const v1 = commit('upstream v1');
  git('rm', '-q', 'src/gone.js');
  write('src/a.js', 'a2\n');
  write('src/b.js', 'b\n');
  write('.github/ci.yml', 'on: push\n');
  const v2 = commit('upstream v2');

  git('rm', '-r', '-q', '.');
  git('read-tree', '--prefix=templates/app/', '-u', v1);
  write('templates/app/preview/shot.png', 'png');
  const source = { repository: 'o/r', track: 'branch', ref: 'main', commit: v1, license: 'MIT' };
  write('templates.json', `${JSON.stringify({ templates: [{ id: 'app', source }] }, null, 2)}\n`);
  commit('vendor v1');
  write('upstream-sync.json', JSON.stringify([{ id: 'app', repository: 'o/r', status: 'update', from: { ref: 'main', commit: v1 }, to: { ref: 'main', commit: v2, url: 'u' } }]));

  const script = join(dirname(fileURLToPath(import.meta.url)), 'upstream-sync.mjs');
  const stdout = execFileSync('node', [script, 'push', 'app', '--dry-run'], { cwd: dir, encoding: 'utf8', env });
  const plan = JSON.parse(stdout.slice(0, stdout.lastIndexOf('}') + 1));
  const blob = (path) => git('rev-parse', `${v2}:${path}`);

  assert.equal(plan.branch, 'upstream-sync/app');
  assert.equal(plan.parent, git('rev-parse', 'HEAD'));
  assert.deepEqual(plan.counts, { added: 1, changed: 1, removed: 1 });
  assert.deepEqual(plan.uploads.map((upload) => upload.sha).sort(), [blob('src/a.js'), blob('src/b.js')].sort());
  assert.deepEqual(
    plan.tree.map(({ path, sha }) => [path, sha]),
    [
      ['templates/app/src/b.js', blob('src/b.js')],
      ['templates/app/src/a.js', blob('src/a.js')],
      ['templates/app/src/gone.js', null],
      ['templates.json', plan.tree.at(-1).sha],
    ],
  );
  assert.match(readFileSync(join(dir, 'pr-body.md'), 'utf8'), /1 added, 1 changed, 1 removed/);
  assert.equal(git('for-each-ref', 'refs/vendored'), '');
});
