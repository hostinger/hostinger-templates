import { execFileSync } from 'node:child_process';

// A vendored template is templates/<id>/ holding an upstream repository's tree
// at source.commit (the source.directory subtree when set), byte for byte:
// same paths, blob SHAs and modes. Two things differ on purpose: paths under
// DEFAULT_EXCLUDE and source.exclude are left out, and preview/ holds our
// catalog screenshots. Shared by check-vendored.mjs (the Template gate) and
// the weekly upstream sync.

const DEFAULT_EXCLUDE = ['.github/'];
const OWNED_DIRECTORY = 'preview/';
// All preview/ may hold: catalog screenshots, plain files directly inside it.
const PREVIEW_IMAGE = /^preview\/[^/]+\.(png|webp)$/;
const PLAIN_FILE = '100644';

const GITLINK = '160000';
const SYMLINK = '120000';
const LFS_POINTER = 'version https://git-lfs.github.com/spec/v1';
const MAX_BUFFER = 256 * 1024 * 1024;

export function templateRoot(id) {
  return `templates/${id}`;
}

// True when path is prefix itself or lies under it. A prefix may end in "/".
export function matchesPrefix(path, prefix) {
  const bare = prefix.replace(/\/+$/, '');
  return path === bare || path.startsWith(`${bare}/`);
}

export function isExcluded(path, exclude = []) {
  return [...DEFAULT_EXCLUDE, ...exclude].some((prefix) => matchesPrefix(path, prefix));
}

// `git ls-tree -r -l -z` output: "<mode> <type> <sha> <size>\t<path>\0".
export function parseLsTree(output) {
  return output
    .split('\0')
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf('\t');
      const [mode, type, sha, size] = line.slice(0, tab).trim().split(/\s+/);
      return { mode, type, sha, size: size === '-' ? null : Number(size), path: line.slice(tab + 1) };
    });
}

function listTree(gitDir, treeish) {
  const output = execFileSync('git', ['ls-tree', '-r', '-l', '-z', treeish], {
    cwd: gitDir,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return parseLsTree(output);
}

function treeish(commit, directory) {
  return directory ? `${commit}:${directory}` : `${commit}^{tree}`;
}

// What templates/<id>/ must hold (preview/ aside) for this upstream commit.
export function expectedEntries(gitDir, commit, directory = null, exclude = []) {
  return listTree(gitDir, treeish(commit, directory)).filter((entry) => !isExcluded(entry.path, exclude));
}

// What templates/<id>/ holds at ref, without our preview/ folder.
export function actualEntries(gitDir, ref, id) {
  return listTree(gitDir, `${ref}:${templateRoot(id)}`).filter((entry) => !matchesPrefix(entry.path, OWNED_DIRECTORY));
}

// Anything in our preview/ folder at ref other than plain .png or .webp files
// directly inside it: no code, subfolders, symlinks, submodules or executables.
export function previewProblems(gitDir, ref, id) {
  return listTree(gitDir, `${ref}:${templateRoot(id)}`)
    .filter((entry) => matchesPrefix(entry.path, OWNED_DIRECTORY))
    .filter((entry) => entry.type !== 'blob' || entry.mode !== PLAIN_FILE || !PREVIEW_IMAGE.test(entry.path))
    .map((entry) => `${entry.path} (${entry.mode}) is not a plain .png or .webp screenshot directly in ${OWNED_DIRECTORY}`);
}

// What turns actual into expected: paths to add, paths whose blob or mode
// differs, and paths to remove.
export function diffEntries(expected, actual) {
  const before = new Map(actual.map((entry) => [entry.path, entry]));
  const after = new Map(expected.map((entry) => [entry.path, entry]));
  const added = [];
  const changed = [];
  for (const entry of expected) {
    const old = before.get(entry.path);
    if (!old) {
      added.push(entry);
    } else if (old.sha !== entry.sha || old.mode !== entry.mode) {
      changed.push({ ...entry, from: { mode: old.mode, sha: old.sha } });
    }
  }
  const removed = actual.filter((entry) => !after.has(entry.path));
  return { added, changed, removed };
}

export function isIdentical({ added, changed, removed }) {
  return !added.length && !changed.length && !removed.length;
}

// Upstream content a copy can't hold faithfully. problems fail the check;
// notes are worth a look but are not errors.
export function inspectEntries(gitDir, expected) {
  const problems = [];
  const notes = [];
  for (const entry of expected) {
    if (entry.mode === GITLINK) {
      problems.push(`${entry.path} is a git submodule; a copy can't include it`);
    } else if (matchesPrefix(entry.path, OWNED_DIRECTORY)) {
      problems.push(`${entry.path} clashes with our ${OWNED_DIRECTORY} folder; add "${OWNED_DIRECTORY}" to source.exclude`);
    } else if (entry.mode === SYMLINK) {
      notes.push(`${entry.path} is a symlink`);
    } else if (entry.type === 'blob' && entry.size < 1024 && readBlob(gitDir, entry.sha).toString('utf8').startsWith(LFS_POINTER)) {
      problems.push(`${entry.path} is a Git LFS pointer, not the file itself`);
    }
  }
  return { problems, notes };
}

// MIT and friends need their notice shipped with the code.
export function hasLicense(entries) {
  return entries.some((entry) => !entry.path.includes('/') && /^(LICEN[CS]E|COPYING)(\.|$)/i.test(entry.path));
}

export function readBlob(gitDir, sha) {
  return execFileSync('git', ['cat-file', 'blob', sha], { cwd: gitDir, maxBuffer: MAX_BUFFER });
}

function hasCommit(gitDir, commit) {
  try {
    execFileSync('git', ['cat-file', '-e', `${commit}^{commit}`], { cwd: gitDir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Brings one upstream commit's objects into gitDir without touching the
// worktree. The temporary ref keeps them from being pruned mid-run.
export function fetchCommit(gitDir, repository, commit) {
  if (hasCommit(gitDir, commit)) {
    return;
  }
  execFileSync(
    'git',
    ['fetch', '--quiet', '--depth=1', '--no-tags', '--no-write-fetch-head', `https://github.com/${repository}.git`, `${commit}:refs/vendored/${commit}`],
    { cwd: gitDir, stdio: ['ignore', 'ignore', 'pipe'] },
  );
}

export function dropFetchedCommit(gitDir, commit) {
  try {
    execFileSync('git', ['update-ref', '-d', `refs/vendored/${commit}`], { cwd: gitDir, stdio: 'ignore' });
  } catch {
    // Nothing was fetched for this commit.
  }
}
