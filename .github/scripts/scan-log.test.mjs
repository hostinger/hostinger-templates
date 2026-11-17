import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { HISTORY_LIMIT, entryPath, recordScan, renderIndex, updateLog } from './scan-log.mjs';

const result = (overrides = {}) => ({
  repository: 'acme/shop',
  appDir: null,
  stars: 1200,
  commit: 'a'.repeat(40),
  ref: null,
  framework: 'next',
  verdict: 'deployable',
  findings: [{ level: 'pass', check: 'license', message: 'MIT allows snapshotting it as a template.' }],
  ...overrides,
});

test('entryPath keeps one file per repository and app directory', () => {
  assert.equal(entryPath('acme/shop', null), join('repositories', 'acme', 'shop.json'));
  assert.equal(entryPath('acme/mono', 'apps/web/'), join('repositories', 'acme', 'mono__apps__web.json'));
});

test('a first scan without a deploy is recorded as not tried on Hostinger', () => {
  const entry = recordScan(null, result(), undefined, { date: '2026-11-17', runUrl: 'run/1' });

  assert.equal(entry.firstScanned, '2026-11-17');
  assert.equal(entry.hostinger, 'not-tried');
  assert.equal(entry.deploy, null);
  assert.deepEqual(entry.history, [{ date: '2026-11-17', commit: 'a'.repeat(40), verdict: 'deployable', deployed: null, run: 'run/1' }]);
});

test('a failed deploy is kept with its error until a later deploy replaces it', () => {
  const failed = recordScan(
    null,
    result(),
    { repository: 'acme/shop', commit: 'a'.repeat(40), ok: false, error: 'Build failed', buildAnalysis: 'GLIBC_2.30 not found', buildSeconds: 80 },
    { date: '2026-11-10', runUrl: 'run/1' },
  );
  assert.equal(failed.hostinger, 'fails');
  assert.equal(failed.deploy.buildAnalysis, 'GLIBC_2.30 not found');

  const rescanned = recordScan(failed, result({ commit: 'b'.repeat(40) }), undefined, { date: '2026-11-17', runUrl: 'run/2' });
  assert.equal(rescanned.firstScanned, '2026-11-10');
  assert.equal(rescanned.hostinger, 'fails');
  assert.equal(rescanned.deploy.run, 'run/1');
  assert.deepEqual(
    rescanned.history.map((item) => [item.run, item.deployed]),
    [
      ['run/2', null],
      ['run/1', false],
    ],
  );

  const fixed = recordScan(rescanned, result(), { repository: 'acme/shop', commit: 'c'.repeat(40), ok: true }, { date: '2026-11-24', runUrl: 'run/3' });
  assert.equal(fixed.hostinger, 'deploys');
  assert.equal(fixed.deploy.error, null);
});

test('rerunning the same workflow run replaces its history item and history is capped', () => {
  let entry = null;
  for (let index = 0; index < HISTORY_LIMIT + 5; index += 1) {
    entry = recordScan(entry, result(), undefined, { date: '2026-11-17', runUrl: `run/${index}` });
  }
  entry = recordScan(entry, result({ verdict: 'needs-review' }), undefined, { date: '2026-11-17', runUrl: `run/${HISTORY_LIMIT + 4}` });

  assert.equal(entry.history.length, HISTORY_LIMIT);
  assert.equal(entry.history[0].verdict, 'needs-review');
  assert.equal(entry.history.filter((item) => item.run === `run/${HISTORY_LIMIT + 4}`).length, 1);
});

test('renderIndex lists deployable repositories first with their reasons and deploy errors', () => {
  const blocked = recordScan(
    null,
    result({
      repository: 'acme/cli',
      stars: 9000,
      verdict: 'not-deployable',
      findings: [{ level: 'fail', check: 'kind', message: 'Command-line tool | not a web app.' }],
    }),
    undefined,
    { date: '2026-11-17', runUrl: 'run/1' },
  );
  const failing = recordScan(
    null,
    result(),
    { repository: 'acme/shop', commit: 'a'.repeat(40), ok: false, error: 'Build failed' },
    { date: '2026-11-17', runUrl: 'run/1' },
  );

  const index = renderIndex([blocked, failing]);
  const rows = index.split('\n').filter((line) => line.startsWith('| ['));

  assert.match(rows[0], /acme\/shop.*✅ deployable \| ❌ fails .*Deploy: Build failed/);
  assert.match(rows[1], /acme\/cli.*❌ not-deployable \| — .*Command-line tool \\\| not a web app\./);
  assert.match(index, /2 repositories: 1 deployable, 0 needs-review, 1 not-deployable, 0 error\. 0 deployed on Hostinger\./);
});

test('updateLog writes entries and the index, and reports only files that changed', () => {
  const dir = mkdtempSync(join(tmpdir(), 'scan-log-'));
  try {
    const first = updateLog(dir, [result(), result({ repository: 'acme/mono', appDir: 'apps/web' })], [], { date: '2026-11-17', runUrl: 'run/1' });
    assert.deepEqual(first.map((file) => file.slice(dir.length + 1)).sort(), [
      'README.md',
      join('repositories', 'acme', 'mono__apps__web.json'),
      join('repositories', 'acme', 'shop.json'),
    ]);

    const again = updateLog(dir, [result()], [], { date: '2026-11-17', runUrl: 'run/1' });
    assert.deepEqual(again, []);

    const deployed = updateLog(
      dir,
      [result()],
      [{ repository: 'acme/shop', appDir: null, commit: 'a'.repeat(40), ok: true }],
      { date: '2026-11-17', runUrl: 'run/2' },
    );
    assert.equal(deployed.length, 2);
    const entry = JSON.parse(readFileSync(join(dir, 'repositories', 'acme', 'shop.json'), 'utf8'));
    assert.equal(entry.hostinger, 'deploys');
    assert.match(readFileSync(join(dir, 'README.md'), 'utf8'), /1 deployed on Hostinger/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
