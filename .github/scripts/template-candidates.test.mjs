import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AWAITING_COPY,
  addedEntries,
  candidateBranch,
  candidateId,
  checkPreview,
  chooseTrack,
  copyProblems,
  mediaFor,
  mergeCopy,
  nodeCompatibility,
  nodeMajorFor,
  pickCandidates,
  publishedPage,
  rejection,
  renderBody,
  safeOutputDirectory,
  skeletonEntry,
  webpWidth,
  withEntry,
  withLandingPage,
} from './template-candidates.mjs';

const result = (repository, overrides = {}) => ({
  repository,
  appDir: null,
  stars: 1000,
  framework: 'astro',
  verdict: 'deployable',
  findings: [{ level: 'pass', check: 'license', message: 'MIT allows snapshotting it as a template.' }],
  ...overrides,
});

const catalog = (templates = [], retired = []) => ({ templates, retired });

const png = (width, height) => {
  const buffer = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer);
  buffer.write('IHDR', 12, 'latin1');
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
};

const webp = (width) => {
  const buffer = Buffer.alloc(30);
  buffer.write('RIFF', 0, 'latin1');
  buffer.write('WEBP', 8, 'latin1');
  buffer.write('VP8 ', 12, 'latin1');
  buffer.writeUInt16LE(width, 26);
  return buffer;
};

test('candidate branches are stable per repository and app directory', () => {
  assert.equal(candidateBranch('Acme/Shop_Site'), 'template-candidate/acme-shop-site');
  assert.equal(candidateBranch('acme/mono', 'apps/web/'), 'template-candidate/acme-mono-apps-web');
});

test('candidate ids avoid taken ids, then fall back to the owner and a number', () => {
  assert.equal(candidateId('acme/Shop', null, new Set()), 'shop');
  assert.equal(candidateId('acme/mono', 'apps/web', new Set()), 'mono-web');
  assert.equal(candidateId('acme/shop', null, new Set(['shop'])), 'acme-shop');
  assert.equal(candidateId('acme/shop', null, new Set(['shop', 'acme-shop'])), 'shop-2');
  assert.ok(candidateId(`acme/${'x'.repeat(80)}`, null, new Set()).length <= 40);
});

test('pickCandidates skips templates, existing PRs, failed deploys and anything not deployable', () => {
  const { picked, skipped } = pickCandidates({
    results: [
      result('acme/astrowind'),
      result('acme/open'),
      result('acme/declined'),
      result('acme/broken'),
      result('acme/cli', { verdict: 'not-deployable' }),
      result('acme/fresh'),
    ],
    deploys: [{ repository: 'acme/broken', appDir: null, ok: false, error: 'Build failed' }],
    catalog: catalog([{ id: 'astrowind', source: { repository: 'ACME/astrowind' } }]),
    pulls: [
      { number: 7, state: 'open', merged_at: null, head: { ref: 'template-candidate/acme-open' } },
      { number: 8, state: 'closed', merged_at: null, head: { ref: 'template-candidate/acme-declined' } },
    ],
    limit: 5,
  });

  assert.deepEqual(picked.map((item) => item.repository), ['acme/fresh']);
  assert.deepEqual(skipped, [
    { repository: 'acme/astrowind', reason: 'already a template' },
    { repository: 'acme/open', reason: '#7 is open' },
    { repository: 'acme/declined', reason: '#8 was closed without merging' },
    { repository: 'acme/broken', reason: 'failed to deploy on Hostinger: Build failed' },
  ]);
});

test('pickCandidates prefers repositories that deployed, then stars, and keeps to the limit', () => {
  const { picked, skipped } = pickCandidates({
    results: [result('acme/small', { stars: 10 }), result('acme/big', { stars: 9000 }), result('acme/deployed', { stars: 5 })],
    deploys: [{ repository: 'acme/deployed', ok: true }],
    catalog: catalog([{ id: 'big' }], [{ id: 'small', retiredAt: '2026-11-01' }]),
    pulls: [],
    takenIds: ['deployed'],
    limit: 2,
  });

  assert.deepEqual(
    picked.map((item) => [item.repository, item.id, item.deployed]),
    [
      ['acme/deployed', 'acme-deployed', true],
      ['acme/big', 'acme-big', false],
    ],
  );
  assert.deepEqual(skipped, [{ repository: 'acme/small', reason: "over this run's limit of 2" }]);
});

test('chooseTrack follows recent releases and otherwise the default branch', () => {
  const now = new Date('2026-11-17T00:00:00Z');
  const release = (overrides) => ({ draft: false, prerelease: false, published_at: '2026-10-01T00:00:00Z', ...overrides });

  assert.deepEqual(chooseTrack({ releases: [release()], defaultBranch: 'main', now }), { track: 'releases' });
  assert.deepEqual(chooseTrack({ releases: [release({ prerelease: true })], defaultBranch: 'main', now }), {
    track: 'releases',
    prereleases: true,
  });
  assert.deepEqual(chooseTrack({ releases: [release({ published_at: '2024-01-01T00:00:00Z' })], defaultBranch: 'main', now }), {
    track: 'branch',
    ref: 'main',
  });
  assert.deepEqual(chooseTrack({ releases: [release({ draft: true })], defaultBranch: 'trunk', now }), { track: 'branch', ref: 'trunk' });
});

test('the Node.js version is the newest one engines allows', () => {
  assert.equal(nodeMajorFor({}), 24);
  assert.equal(nodeMajorFor({ engines: { node: '^20.19.0 || ^22.12.0' } }), 22);
  assert.equal(nodeMajorFor({ engines: { node: '<18' } }), null);
  assert.deepEqual(nodeCompatibility({ engines: { node: '>=20.19.0' } }, 24).runtimes[0].versions, ['20.19+']);
  assert.deepEqual(nodeCompatibility({}, 24).runtimes[0].versions, ['24+']);
});

test('only the copy fields are taken from what Claude wrote', () => {
  const entry = { ...skeletonEntry({ id: 'shop', name: 'shop', source: { repository: 'acme/shop' }, deploy: { nodeVersion: 24 }, compatibility: {} }), media: mediaFor('shop', 4000, 'hostinger/hostinger-templates') };
  const merged = mergeCopy(entry, { ...entry, name: 'Shop', summary: 'A shop.', demoUrl: 'https://evil.example', source: { repository: 'evil/repo' }, routes: ['/admin'] });

  assert.equal(merged.name, 'Shop');
  assert.equal(merged.summary, 'A shop.');
  assert.equal(merged.demoUrl, 'https://shop.hostingertemplates.com');
  assert.deepEqual(merged.source, { repository: 'acme/shop' });
  assert.deepEqual(merged.routes, ['/']);
  assert.equal(merged.media.preview.height, 4000);
  assert.equal(merged.media.thumbnail.variants[1].path, 'templates/shop/preview/shop-thumbnail-960.webp');
});

test('the catalog, landing index and page are written the way the files are kept', () => {
  const text = `${JSON.stringify(catalog([{ id: 'a', name: 'A' }, { id: 'shop', name: 'Old' }]), null, 2)}\n`;
  const updated = JSON.parse(withEntry(text, { id: 'shop', name: 'Café' }));
  assert.deepEqual(updated.templates.map((entry) => entry.id), ['a', 'shop']);
  assert.match(withEntry(text, { id: 'shop', name: 'Café' }), /Caf\\u00e9/);

  assert.equal(withLandingPage('{"landingPages":["b","d"]}', 'c'), '{\n  "landingPages": [\n    "b",\n    "c",\n    "d"\n  ]\n}\n');
  assert.equal(JSON.parse(withLandingPage('{"landingPages":["c"]}', 'c')).landingPages.length, 1);
  assert.equal(JSON.parse(publishedPage({ landingPage: { enabled: false, heroTitle: 'x' } })).landingPage.enabled, true);
});

test('a REJECT line in the notes declines the repository', () => {
  assert.equal(rejection('REJECT: A personal portfolio with real photos.\n'), 'A personal portfolio with real photos.');
  assert.equal(rejection('- Check the pricing copy.\n'), null);
});

test('addedEntries finds the entry a candidate branch adds', () => {
  assert.deepEqual(addedEntries(catalog([{ id: 'a' }]), catalog([{ id: 'a' }, { id: 'shop' }])), [{ id: 'shop' }]);
});

test('the PR body links the pin, the screenshots and the reviewer notes', () => {
  const entry = {
    ...skeletonEntry({
      id: 'shop',
      name: 'Shop',
      source: { repository: 'acme/shop', ref: 'v1.2.0', commit: 'c'.repeat(40), license: 'MIT' },
      deploy: { nodeVersion: 22 },
      compatibility: {},
    }),
    media: mediaFor('shop', 4000, 'hostinger/hostinger-templates'),
  };
  const body = renderBody({
    candidate: { stars: 1200, framework: 'astro', deployed: true, findings: [{ level: 'warn', message: 'Large repository.' }] },
    entry,
    notes: '- Replace the sample prices.',
    repository: 'hostinger/hostinger-templates',
    branch: 'template-candidate/acme-shop',
  });

  assert.match(body, /\[`v1\.2\.0@ccccccc`\]\(https:\/\/github\.com\/acme\/shop\/tree\/c{40}\)/);
  assert.match(body, /deployable, 1200 stars, astro, MIT\. It deployed and passed the smoke check on Hostinger\./);
  assert.match(body, /⚠️ Large repository\./);
  assert.match(body, /Node\.js 22/);
  assert.match(body, /- Replace the sample prices\./);
  assert.match(body, /blob\/template-candidate\/acme-shop\/templates\/shop\/preview\/shop-thumbnail\.png\?raw=true/);
});

test('the prepared screenshots must be real images of the expected sizes', () => {
  const files = {
    'shop-thumbnail.png': png(1440, 900),
    'shop-homepage.png': png(1440, 5200),
    'shop-thumbnail-480.webp': webp(480),
    'shop-thumbnail-960.webp': webp(960),
  };
  assert.deepEqual(checkPreview('shop', (name) => files[name] ?? null), { problems: [], homepageHeight: 5200 });
  assert.equal(webpWidth(Buffer.from('<svg onload="alert(1)"></svg>')), null);

  const tampered = { ...files, 'shop-thumbnail.png': png(1440, 901), 'shop-homepage.png': Buffer.from('#!/bin/sh'), 'shop-thumbnail-960.webp': webp(480) };
  assert.deepEqual(checkPreview('shop', (name) => tampered[name] ?? null), {
    problems: ['the thumbnail is 1440×901, not 1440×900', 'shop-homepage.png is not a PNG', 'shop-thumbnail-960.webp is not a 960px WebP'],
    homepageHeight: null,
  });
});

test('the build output directory must be a plain relative path', () => {
  assert.equal(safeOutputDirectory(undefined), null);
  assert.equal(safeOutputDirectory('dist/client'), 'dist/client');
  assert.throws(() => safeOutputDirectory('../../.github'));
  assert.throws(() => safeOutputDirectory('/etc'));
  assert.throws(() => safeOutputDirectory({ path: 'dist' }));
});

test('copy with credentials or outside links is never pushed', () => {
  const source = { repository: 'acme/shop' };
  const demoUrl = 'https://shop.hostingertemplates.com';
  const page = { landingPage: { heroTitle: 'Launch a shop', kbUrl: 'https://www.hostinger.com/support/123-nodejs' } };
  const notes = '- Compare the pricing table with https://shop.hostingertemplates.com/pricing and https://github.com/Acme/shop/blob/main/README.md.\n- Check https://shop.hostingertemplates.com.';

  assert.deepEqual(copyProblems({ entry: { summary: 'A shop.' }, page, notes, source, demoUrl }), []);
  assert.deepEqual(
    copyProblems({
      entry: { summary: 'Get it at www.cheap-pills.example', features: ['sk-ant-api03-abc'], demoUrl: 'https://ignored.example' },
      page: { landingPage: { heroTitle: 'See javascript://evil.example' } },
      notes: '- Read https://github.com/acme/shop-fork and https://shop.hostingertemplates.com.evil.example',
      source,
      demoUrl,
    }),
    [
      'it contains text that looks like a credential',
      'the copy links to www.cheap-pills.example',
      'the copy links to javascript://evil.example',
      'the notes link to https://github.com/acme/shop-fork',
      'the notes link to https://shop.hostingertemplates.com.evil.example',
    ],
  );
});

test('a candidate PR opens as a draft that waits for its copy', () => {
  const entry = {
    ...skeletonEntry({ id: 'shop', name: 'shop', source: { repository: 'acme/shop', ref: 'main', commit: 'c'.repeat(40), license: 'MIT' }, deploy: { nodeVersion: 24 }, compatibility: {} }),
    media: mediaFor('shop', 4000, 'hostinger/hostinger-templates'),
  };
  const body = renderBody({ candidate: { stars: null, framework: null, deployed: false, findings: [] }, entry, notes: null, repository: 'hostinger/hostinger-templates', branch: 'template-candidate/acme-shop' });
  assert.ok(body.includes(AWAITING_COPY));
  assert.doesNotMatch(body, /Claude wrote/);
});

test('a repository that failed to prepare is skipped until it has a new commit', () => {
  const { picked, skipped } = pickCandidates({
    results: [result('acme/broken', { commit: 'a'.repeat(40) }), result('acme/fixed', { commit: 'c'.repeat(40) })],
    failures: [
      { repository: 'ACME/broken', appDir: null, commit: 'a'.repeat(40) },
      { repository: 'acme/fixed', appDir: null, commit: 'b'.repeat(40) },
    ],
    catalog: catalog(),
    pulls: [],
    limit: 5,
  });

  assert.deepEqual(picked.map((item) => [item.repository, item.commit]), [['acme/fixed', 'c'.repeat(40)]]);
  assert.deepEqual(skipped, [{ repository: 'acme/broken', reason: 'failed to prepare at aaaaaaa; tried again after a new commit' }]);
});
