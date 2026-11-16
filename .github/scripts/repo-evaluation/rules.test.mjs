import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { evaluateRepository, satisfiesMajor } from './rules.mjs';

const NOW = new Date('2026-11-10T00:00:00Z');

const facts = ({ repo, ...overrides } = {}) => ({
  repo: {
    fullName: 'acme/app',
    archived: false,
    pushedAt: '2026-11-01T00:00:00Z',
    stars: 1200,
    license: 'MIT',
    sizeKb: 2048,
    topics: [],
    ...repo,
  },
  commit: 'abc123',
  appDir: null,
  tree: ['package.json', 'package-lock.json', 'src/main.tsx'],
  packageJson: {
    scripts: { build: 'vite build', dev: 'vite' },
    dependencies: { react: '^19.0.0' },
    devDependencies: { vite: '^7.0.0' },
  },
  lockfiles: ['npm'],
  envExampleKeys: [],
  composeServices: [],
  ...overrides,
});

const messages = (result) => result.findings.filter((f) => f.level !== 'pass').map((f) => f.message).join(' ');

describe('evaluateRepository', () => {
  it('accepts a maintained, MIT-licensed Vite app with a lockfile', () => {
    const result = evaluateRepository(facts(), { now: NOW });
    assert.equal(result.verdict, 'deployable');
    assert.equal(result.framework, 'vite');
  });

  for (const [name, overrides, expected] of [
    ['agent skills', { tree: ['skills/a/SKILL.md', 'skills/b/SKILL.md', 'README.md'], packageJson: null }, /Agent skills/],
    ['an Electron app', { packageJson: { scripts: { start: 'electron .' }, devDependencies: { electron: '^33.0.0' } } }, /Desktop app/],
    ['a CLI', { packageJson: { bin: { tool: 'cli.js' }, dependencies: { commander: '^12.0.0' } } }, /Command-line tool/],
    ['a library', { packageJson: { main: 'index.js', dependencies: {} } }, /Library/],
    ['an MCP server', { packageJson: { scripts: { start: 'node server.js' }, dependencies: { '@modelcontextprotocol/sdk': '^1.0.0' } } }, /MCP server/],
    ['a Laravel app that uses Vite', { isPhpApp: true }, /PHP application/],
    ['a Postgres app', { packageJson: { scripts: { build: 'next build', start: 'next start' }, dependencies: { next: '^16.0.0', pg: '^8.0.0' } } }, /PostgreSQL/],
    ['a headless-browser app', { packageJson: { scripts: { start: 'node index.js' }, dependencies: { express: '^5.0.0', puppeteer: '^24.0.0' } } }, /headless browser/],
    ['an unlicensed repo', { repo: { license: null } }, /No OSI license/],
    ['an archived repo', { repo: { archived: true } }, /archived/],
    ['a Node 26-only app', { packageJson: { engines: { node: '>=26' }, scripts: { build: 'vite build' }, devDependencies: { vite: '^7.0.0' } } }, /excludes every supported/],
    ['a Bun-only app', { lockfiles: ['bun'], packageJson: { scripts: { build: 'vite build' }, devDependencies: { vite: '^7.0.0' } } }, /Bun only/],
    ['a repo with git submodules', { tree: ['package.json', 'package-lock.json', '.gitmodules', 'src/main.tsx'] }, /submodules/],
    ['a build that runs browser tests', { packageJson: { scripts: { prebuild: 'ng test --watch=false', build: 'ng build' }, dependencies: { '@angular/core': '^20.0.0' } } }, /"prebuild" script.*headless browser/],
    ['a source tree over the archive limit', { sourceSizeKb: 60 * 1024 }, /source is 60 MB/],
    ['a workspace app that needs other workspace packages', { appDir: 'apps/web', hasRootWorkspaces: true, packageJson: { scripts: { build: 'vite build' }, dependencies: { react: '^19.0.0', '@acme/ui': 'workspace:*' }, devDependencies: { vite: '^7.0.0' } } }, /apps\/web depends on other workspace packages/],
    ['a monorepo without an app directory', { hasPnpmWorkspace: true, packageJson: { scripts: { build: 'turbo build' } }, appCandidates: ['apps/web'] }, /Monorepo.*apps\/web/],
  ]) {
    it(`rejects ${name}`, () => {
      const result = evaluateRepository(facts(overrides), { now: NOW });
      assert.equal(result.verdict, 'not-deployable');
      assert.match(messages(result), expected);
    });
  }

  it('flags copyleft licenses and required secrets for review', () => {
    const result = evaluateRepository(facts({ repo: { license: 'AGPL-3.0' }, envExampleKeys: ['OPENAI_API_KEY', 'PORT'] }), { now: NOW });
    assert.equal(result.verdict, 'needs-review');
    assert.match(messages(result), /copyleft.*OPENAI_API_KEY/s);
  });

  it('accepts a web app that also ships agent skill files', () => {
    const result = evaluateRepository(facts({ tree: ['package.json', 'package-lock.json', '.claude/skills/a/SKILL.md', '.claude/skills/b/SKILL.md'] }), { now: NOW });
    assert.equal(result.verdict, 'deployable');
  });

  it('rejects a skills collection that has a package.json but no app', () => {
    const result = evaluateRepository(
      facts({ tree: ['package.json', 'skills/a/SKILL.md', 'skills/b/SKILL.md'], packageJson: { scripts: { test: 'node --test' } } }),
      { now: NOW },
    );
    assert.equal(result.verdict, 'not-deployable');
    assert.match(messages(result), /Agent skills/);
  });

  it('measures the source, not the history, when the file sizes are known', () => {
    const result = evaluateRepository(facts({ repo: { sizeKb: 99 * 1024 }, sourceSizeKb: 4 * 1024 }), { now: NOW });
    assert.equal(result.verdict, 'deployable');
  });

  it('flags content pulled from a CMS at build time for review', () => {
    const result = evaluateRepository(
      facts({ packageJson: { scripts: { build: 'gatsby build' }, dependencies: { gatsby: '^5.0.0', 'gatsby-source-contentful': '^8.0.0' } } }),
      { now: NOW },
    );
    assert.equal(result.verdict, 'needs-review');
    assert.match(messages(result), /Contentful credentials/);
  });

  it('flags a workspace app without workspace dependencies for review', () => {
    const result = evaluateRepository(facts({ appDir: 'apps/web', hasPnpmWorkspace: true }), { now: NOW });
    assert.equal(result.verdict, 'needs-review');
    assert.match(messages(result), /apps\/web is in a workspace/);
  });

  it('accepts an Express server using MySQL', () => {
    const result = evaluateRepository(
      facts({ packageJson: { scripts: { start: 'node server.js' }, dependencies: { express: '^5.0.0', mysql2: '^3.0.0' } } }),
      { now: NOW },
    );
    assert.equal(result.verdict, 'deployable');
    assert.equal(result.framework, 'express');
  });
});

describe('satisfiesMajor', () => {
  for (const [range, major, expected] of [
    ['>=18', 22, true],
    ['^20.9.0 || >=22', 24, true],
    ['^20.9.0 || >=22', 18, false],
    ['>=18 <21', 22, false],
    ['22.x', 22, true],
    ['~20.10', 20, true],
    ['>= 26.2.0', 24, false],
    ['>= 16', 22, true],
    ['> 14 < 20', 22, false],
    ['16 - 22', 22, true],
    ['16 - 20', 22, false],
    ['18.0.0 - 21.9.0', 22, false],
  ]) {
    it(`${range} ${expected ? 'allows' : 'excludes'} Node.js ${major}`, () => {
      assert.equal(satisfiesMajor(range, major), expected);
    });
  }
});
