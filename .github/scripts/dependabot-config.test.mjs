import assert from 'node:assert/strict';
import { test } from 'node:test';
import { globMatches, parseNpmEntries, renderDependabotConfig, vendoredExclusionProblem } from './dependabot-config.mjs';

const GENERATED = renderDependabotConfig({ maintained: ['callout', 'drop'], vendored: ['astrowind'] });

test('the generated config lists maintained and vendored templates in separate npm entries', () => {
  assert.deepEqual(parseNpmEntries(GENERATED), [
    { ecosystem: 'npm', directories: ['/templates/callout', '/templates/drop'], ignoresAll: false },
    { ecosystem: 'npm', directories: ['/templates/astrowind'], ignoresAll: true },
  ]);
});

test('without vendored templates there is no ignore entry', () => {
  const text = renderDependabotConfig({ maintained: ['callout'], vendored: [] });
  assert.equal(parseNpmEntries(text).length, 1);
  assert.ok(!text.includes('ignore:'));
});

test('a vendored template listed only in the ignore entry passes', () => {
  assert.equal(vendoredExclusionProblem(GENERATED, 'astrowind'), null);
});

test('a vendored template matched by the security group glob is reported', () => {
  const globbed = `version: 2
updates:
  - package-ecosystem: npm
    directories:
      - "/templates/*"
    schedule:
      interval: daily
`;
  assert.match(vendoredExclusionProblem(globbed, 'astrowind'), /through "\/templates\/\*"/);
});

test('a vendored template missing from dependabot.yml is reported', () => {
  assert.match(vendoredExclusionProblem(GENERATED, 'screwfast'), /does not list \/templates\/screwfast/);
});

test('an ignore rule limited to some versions does not count as ignoring everything', () => {
  const partial = GENERATED.replace('      - dependency-name: "*"', '      - dependency-name: "*"\n        update-types: ["version-update:semver-major"]');
  assert.equal(parseNpmEntries(partial)[1].ignoresAll, false);
  assert.match(vendoredExclusionProblem(partial, 'astrowind'), /does not ignore "\*"/);
});

test('directory, comments and other ecosystems are handled', () => {
  const text = `version: 2
updates:
  - package-ecosystem: github-actions
    directory: "/templates/astrowind"
  - package-ecosystem: npm
    directory: /tools # comment
`;
  assert.deepEqual(parseNpmEntries(text), [{ ecosystem: 'npm', directories: ['/tools'], ignoresAll: false }]);
});

test('dependabot globs keep * inside one segment', () => {
  assert.ok(globMatches('/templates/*', '/templates/app'));
  assert.ok(!globMatches('/templates/*', '/templates/app/sub'));
  assert.ok(globMatches('/templates/**', '/templates/app/sub'));
  assert.ok(globMatches('templates/app/', '/templates/app'));
});
