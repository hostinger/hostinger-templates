import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { renderDependabotConfig, templateDirectories } from './dependabot-config.mjs';

test('every template is listed in the one npm entry, with no ignore rules', () => {
  const text = renderDependabotConfig(['astrowind', 'callout']);
  assert.equal(text.match(/package-ecosystem: npm/g).length, 1);
  assert.match(text, /directories:\n\s+- "\/templates\/astrowind"\n\s+- "\/templates\/callout"\n/);
  assert.ok(!text.includes('ignore:'));
});

test('security updates open one PR per vulnerable package', () => {
  assert.match(renderDependabotConfig(['callout']), /applies-to: security-updates\n\s+group-by: dependency-name\n/);
});

test('template directories are the folders with a package.json, sorted', () => {
  const root = mkdtempSync(join(tmpdir(), 'dependabot-config-'));
  try {
    for (const [id, hasPackage] of [['drop', true], ['astrowind', true], ['notes', false]]) {
      mkdirSync(join(root, 'templates', id), { recursive: true });
      if (hasPackage) {
        writeFileSync(join(root, 'templates', id, 'package.json'), '{}\n');
      }
    }
    assert.deepEqual(templateDirectories(root), ['astrowind', 'drop']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
