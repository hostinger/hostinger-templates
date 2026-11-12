import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { DEPENDABOT_FILE, vendoredExclusionProblem } from './dependabot-config.mjs';
import { checkPin, createUpstreamClient } from './repo-evaluation/upstream.mjs';
import {
  actualEntries,
  diffEntries,
  dropFetchedCommit,
  expectedEntries,
  fetchCommit,
  hasLicense,
  inspectEntries,
  isIdentical,
  previewProblems,
  templateRoot,
} from './upstream-copy.mjs';

// Template gate check for vendored templates (templates.json entries with a
// source): for each one whose source or templates/<id>/ changed, checks
//   pin         the ref points at the commit, the license and archive state
//               GitHub reports, and the deployability rules at the commit
//   copy        templates/<id>/ at --ref is the upstream tree at the commit,
//               byte for byte, minus .github/ and source.exclude, plus preview/
//               holding only .png and .webp screenshots, and keeps the
//               upstream LICENSE
//   dependabot  .github/dependabot.yml lists templates/<id>/ only in an npm
//               entry that ignores every dependency, because updates come
//               from upstream syncs
//
//   check-vendored.mjs [--base <sha>] [--all] [--ref <tree-ish>]
//
// Without --base, or with --all, every vendored template is checked. --ref is
// the commit whose templates/ is checked (default HEAD).

const MAX_LISTED_PATHS = 20;

const args = process.argv.slice(2);
const base = optionValue('--base');
const ref = optionValue('--ref') ?? 'HEAD';
const all = args.includes('--all') || !base;

const gitDir = process.cwd();
let baseSourceCache;
const vendored = JSON.parse(gitShow(ref, 'templates.json')).templates.filter((entry) => entry.source);
const selected = all ? vendored : vendored.filter((entry) => changedSince(base, entry));

if (!selected.length) {
  console.log('No vendored template was added, re-pinned or changed.');
  process.exit(0);
}

const client = createUpstreamClient();
const dependabot = existsSync(DEPENDABOT_FILE) ? readFileSync(DEPENDABOT_FILE, 'utf8') : '';
const rows = [];
for (const entry of selected) {
  const pin = await checkPin(entry.source, client)
    .then(({ problems }) => problems)
    .catch((error) => [error.message]);
  const { problems: copy, notes } = checkCopy(entry);
  const dependabotProblems = [vendoredExclusionProblem(dependabot, entry.id)].filter(Boolean);
  rows.push({ entry, pin, copy, notes, dependabot: dependabotProblems });

  for (const [check, problems] of [['pin', pin], ['copy', copy], ['dependabot', dependabotProblems]]) {
    for (const problem of problems) {
      console.log(`::error file=templates.json::vendored "${entry.id}" (${check}): ${problem}`);
    }
  }
  for (const note of notes) {
    console.log(`::notice file=templates.json::vendored "${entry.id}": ${note}`);
  }
}

const summary = [
  '## Vendored templates',
  '',
  '| Template | Source | Pin | Copy | Dependabot |',
  '| --- | --- | --- | --- | --- |',
  ...rows.map(({ entry, pin, copy, notes, dependabot: dependabotProblems }) => {
    const { repository, ref: sourceRef, commit, directory } = entry.source;
    const path = directory ? `/${directory}` : '';
    const where = `[${repository}${path}@${sourceRef}](https://github.com/${repository}/tree/${commit}${path}) \`${commit.slice(0, 7)}\``;
    return `| \`${entry.id}\` | ${where} | ${cell(pin, 'ref, license and rules')} | ${cell(copy, 'identical', notes)} | ${cell(dependabotProblems, 'excluded')} |`;
  }),
].join('\n');

console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
}

if (rows.some((row) => row.pin.length || row.copy.length || row.dependabot.length)) {
  process.exit(1);
}

function checkCopy(entry) {
  const { repository, commit, directory, exclude = [] } = entry.source;
  try {
    fetchCommit(gitDir, repository, commit);
  } catch (error) {
    return { problems: [`could not fetch ${commit.slice(0, 7)} from ${repository}: ${firstLine(error)}`], notes: [] };
  }
  try {
    const expected = expectedEntries(gitDir, commit, directory, exclude);
    const actual = actualEntries(gitDir, ref, entry.id);
    const { problems, notes } = inspectEntries(gitDir, expected);
    const diff = diffEntries(expected, actual);
    if (!isIdentical(diff)) {
      problems.push(describeDiff(diff, entry));
    }
    if (!hasLicense(actual)) {
      problems.push(`${templateRoot(entry.id)}/ has no LICENSE file at its root`);
    }
    problems.push(...previewProblems(gitDir, ref, entry.id));
    return { problems, notes };
  } catch (error) {
    return { problems: [firstLine(error)], notes: [] };
  } finally {
    dropFetchedCommit(gitDir, commit);
  }
}

function describeDiff({ added, changed, removed }, entry) {
  const parts = [
    ['missing from the copy', added],
    ['differ from upstream', changed],
    ['not in upstream (or excluded)', removed],
  ]
    .filter(([, entries]) => entries.length)
    .map(([label, entries]) => {
      const shown = entries.slice(0, MAX_LISTED_PATHS).map((item) => item.path);
      const more = entries.length > shown.length ? ` and ${entries.length - shown.length} more` : '';
      return `${entries.length} ${label}: ${shown.join(', ')}${more}`;
    });
  return `${templateRoot(entry.id)}/ is not the upstream tree at ${entry.source.commit.slice(0, 7)}; ${parts.join('; ')}`;
}

function changedSince(baseRef, entry) {
  const before = baseSources(baseRef).get(entry.id);
  if (JSON.stringify(before) !== JSON.stringify(entry.source)) {
    return true;
  }
  const files = execFileSync('git', ['diff', '--name-only', baseRef, ref, '--', `${templateRoot(entry.id)}/`], { encoding: 'utf8' });
  return files.trim() !== '';
}

function baseSources(baseRef) {
  if (!baseSourceCache) {
    let catalog = {};
    try {
      catalog = JSON.parse(gitShow(baseRef, 'templates.json'));
    } catch {
      // A base without templates.json has no vendored templates.
    }
    baseSourceCache = new Map((catalog.templates ?? []).map((entry) => [entry.id, entry.source]));
  }
  return baseSourceCache;
}

function gitShow(treeish, path) {
  return execFileSync('git', ['show', `${treeish}:${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
}

function cell(problems, ok, notes = []) {
  const text = problems.length ? `❌ ${problems.join('; ')}` : `✅ ${ok}${notes.length ? ` (${notes.join('; ')})` : ''}`;
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function firstLine(error) {
  return String(error.stderr || error.message)
    .trim()
    .split('\n')[0];
}

function optionValue(name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}
