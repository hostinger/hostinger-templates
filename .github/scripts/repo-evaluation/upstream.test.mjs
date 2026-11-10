import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkPin, latestPin } from './upstream.mjs';

const COMMIT = 'a'.repeat(40);
const OTHER = 'b'.repeat(40);
const deployable = async () => ({ verdict: 'deployable', findings: [] });

function fakeClient(routes) {
  return {
    async json(path) {
      if (!(path in routes)) {
        throw new Error(`GET ${path} returned 404`);
      }
      return routes[path];
    },
  };
}

const repo = { archived: false, license: { spdx_id: 'MIT' } };
const releaseSource = { repository: 'o/r', track: 'releases', ref: 'v2.0.0', commit: COMMIT, license: 'MIT' };
const branchSource = { repository: 'o/r', track: 'branch', ref: 'main', commit: COMMIT, license: 'MIT' };

test('a release pin whose tag points at the commit passes', async () => {
  const client = fakeClient({
    '/repos/o/r': repo,
    '/repos/o/r/releases/tags/v2.0.0': { draft: false, prerelease: false },
    '/repos/o/r/commits/v2.0.0': { sha: COMMIT },
  });
  assert.deepEqual((await checkPin(releaseSource, client, { evaluateAt: deployable })).problems, []);
});

test('a release pin whose tag moved fails', async () => {
  const client = fakeClient({
    '/repos/o/r': repo,
    '/repos/o/r/releases/tags/v2.0.0': { draft: false, prerelease: false },
    '/repos/o/r/commits/v2.0.0': { sha: OTHER },
  });
  const { problems } = await checkPin(releaseSource, client, { evaluateAt: deployable });
  assert.match(problems.join(), /points at bbbbbbb/);
});

test('a prerelease needs prereleases: true', async () => {
  const routes = {
    '/repos/o/r': repo,
    '/repos/o/r/releases/tags/v2.0.0': { draft: false, prerelease: true },
    '/repos/o/r/commits/v2.0.0': { sha: COMMIT },
  };
  const strict = await checkPin(releaseSource, fakeClient(routes), { evaluateAt: deployable });
  assert.match(strict.problems.join(), /prerelease/);
  const allowed = await checkPin({ ...releaseSource, prereleases: true }, fakeClient(routes), { evaluateAt: deployable });
  assert.deepEqual(allowed.problems, []);
});

test('a missing release fails', async () => {
  const client = fakeClient({ '/repos/o/r': repo, '/repos/o/r/commits/v2.0.0': { sha: COMMIT } });
  const { problems } = await checkPin(releaseSource, client, { evaluateAt: deployable });
  assert.match(problems.join(), /not a published release/);
});

test('a branch pin passes when the branch contains the commit', async () => {
  for (const status of ['identical', 'ahead']) {
    const client = fakeClient({ '/repos/o/r': repo, [`/repos/o/r/compare/${COMMIT}...main`]: { status } });
    assert.deepEqual((await checkPin(branchSource, client, { evaluateAt: deployable })).problems, []);
  }
});

test('a branch pin fails when the commit is not on the branch', async () => {
  for (const status of ['diverged', 'behind']) {
    const client = fakeClient({ '/repos/o/r': repo, [`/repos/o/r/compare/${COMMIT}...main`]: { status } });
    const { problems } = await checkPin(branchSource, client, { evaluateAt: deployable });
    assert.match(problems.join(), /not on the main branch/);
  }
});

test('a changed license or an archived repository fails', async () => {
  const client = fakeClient({
    '/repos/o/r': { archived: true, license: { spdx_id: 'GPL-3.0' } },
    [`/repos/o/r/compare/${COMMIT}...main`]: { status: 'identical' },
  });
  const { problems } = await checkPin(branchSource, client, { evaluateAt: deployable });
  assert.equal(problems.length, 2);
  assert.match(problems.join(), /archived/);
  assert.match(problems.join(), /GPL-3.0, not MIT/);
});

test('a pin the rules no longer pass fails with the reasons', async () => {
  const client = fakeClient({ '/repos/o/r': repo, [`/repos/o/r/compare/${COMMIT}...main`]: { status: 'identical' } });
  const needsReview = async () => ({
    verdict: 'needs-review',
    findings: [
      { level: 'pass', message: 'has a build script' },
      { level: 'warn', message: 'no lockfile' },
    ],
  });
  const { problems } = await checkPin(branchSource, client, { evaluateAt: needsReview });
  assert.equal(problems.length, 1);
  assert.match(problems[0], /needs-review at aaaaaaa: no lockfile$/);
});

test('latestPin follows the newest stable release unless prereleases are allowed', async () => {
  const client = fakeClient({
    '/repos/o/r/releases?per_page=30': [
      { tag_name: 'v3.0.0-rc.1', prerelease: true, draft: false },
      { tag_name: 'v2.1.0-draft', prerelease: false, draft: true },
      { tag_name: 'v2.0.0', prerelease: false, draft: false },
    ],
    '/repos/o/r/commits/v3.0.0-rc.1': { sha: OTHER },
    '/repos/o/r/commits/v2.0.0': { sha: COMMIT },
  });
  assert.deepEqual(
    [(await latestPin(releaseSource, client)).ref, (await latestPin(releaseSource, client)).commit],
    ['v2.0.0', COMMIT],
  );
  assert.equal((await latestPin({ ...releaseSource, prereleases: true }, client)).ref, 'v3.0.0-rc.1');
});

test('latestPin follows the branch head', async () => {
  const client = fakeClient({ '/repos/o/r/commits/main': { sha: OTHER } });
  assert.deepEqual(await latestPin(branchSource, client), {
    ref: 'main',
    commit: OTHER,
    publishedAt: null,
    url: `https://github.com/o/r/commit/${OTHER}`,
  });
});

test('latestPin fails when there is no release to follow', async () => {
  const client = fakeClient({ '/repos/o/r/releases?per_page=30': [{ tag_name: 'v1-beta', prerelease: true, draft: false }] });
  await assert.rejects(latestPin(releaseSource, client), /no stable release/);
});
