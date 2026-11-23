import { execFileSync } from 'node:child_process';
import { appendFileSync, chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from './repo-evaluation/github.mjs';
import { SUPPORTED_NODE_MAJORS, satisfiesMajor } from './repo-evaluation/rules.mjs';
import { latestPin } from './repo-evaluation/upstream.mjs';
import { staticOutputDir } from './template-commands.mjs';
import { dropFetchedCommit, expectedEntries, fetchCommit, hasLicense, inspectEntries, readBlob, templateRoot } from './upstream-copy.mjs';
import { MAX_BLOBS, createApi, toAsciiJson, uploadBlob } from './upstream-sync.mjs';

export const BRANCH_PREFIX = 'template-candidate/';
export const RELEASE_MAX_AGE_DAYS = 365;
const CATALOG = 'templates.json';
const LANDING_INDEX = 'landing-pages/index.json';
const DEPENDABOT = '.github/dependabot.yml';
const CANDIDATE_FILE = 'candidate.json';
const NOTES_FILE = 'candidate-notes.md';
const DEMO_DOMAIN = 'hostingertemplates.com';
const MAX_ID_LENGTH = 40;
const THUMBNAIL_WIDTHS = [480, 960];
const APPLICATIONS_LISTING_URL = 'https://www.hostinger.com/applications';
const COPY_FIELDS = ['name', 'summary', 'description', 'bucket', 'categories', 'whoItsFor', 'classification', 'features', 'technology', 'searchTerms'];
const DAY_MS = 24 * 60 * 60 * 1000;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_HOMEPAGE_HEIGHT = 20000;
const SECRET_PATTERN = /sk-ant-|gh[opsur]_[A-Za-z0-9]{20,}|github_pat_|-----BEGIN|AKIA[0-9A-Z]{16}|xox[abprs]-/;
const URL_PATTERN = /\b(?:[a-z][a-z0-9+.-]*:\/\/|www\.)[^\s"'<>()[\]`]+/gi;
const COPY_HOSTS = new Set(['hostinger.com', 'www.hostinger.com']);
export const AWAITING_COPY = 'Waiting for the catalog text and landing page. A private job writes them from the code and the screenshots, then marks this PR ready for review.';

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function candidateBranch(repository, appDir = null) {
  return `${BRANCH_PREFIX}${slugify(appDir ? `${repository}/${appDir}` : repository)}`;
}

export function candidateId(repository, appDir, taken) {
  const [owner, name] = repository.split('/').map(slugify);
  const leaf = appDir ? slugify(appDir.split('/').filter(Boolean).at(-1) ?? '') : '';
  const base = leaf ? `${name}-${leaf}` : name;
  const options = [base, `${owner}-${base}`].map((option) => option.slice(0, MAX_ID_LENGTH).replace(/-+$/, ''));
  const free = options.find((option) => option && !taken.has(option));
  if (free) {
    return free;
  }
  for (let suffix = 2; ; suffix++) {
    const option = `${options[0].slice(0, MAX_ID_LENGTH - String(suffix).length - 1).replace(/-+$/, '')}-${suffix}`;
    if (!taken.has(option)) {
      return option;
    }
  }
}

const sameSource = (repository, appDir) => (source) =>
  source.repository.toLowerCase() === repository.toLowerCase() &&
  (source.directory ?? '').replace(/\/+$/, '') === (appDir ?? '').replace(/\/+$/, '');

function pullState(pull) {
  if (pull.state === 'open') {
    return `#${pull.number} is open`;
  }
  return pull.merged_at ? `#${pull.number} was merged` : `#${pull.number} was closed without merging`;
}

export function pickCandidates({ results, deploys = [], catalog, pulls, takenIds = [], limit }) {
  const sources = catalog.templates.filter((entry) => entry.source).map((entry) => entry.source);
  const taken = new Set([...takenIds, ...catalog.templates.map((entry) => entry.id), ...(catalog.retired ?? []).map((entry) => entry.id)]);
  const eligible = [];
  const skipped = [];
  for (const result of results) {
    if (result.verdict !== 'deployable') {
      continue;
    }
    const appDir = result.appDir ?? null;
    const label = appDir ? `${result.repository}:${appDir}` : result.repository;
    const branch = candidateBranch(result.repository, appDir);
    const deploy = deploys.find((item) => item.repository === result.repository && (item.appDir ?? null) === appDir);
    const pull = pulls.find((item) => item.head.ref === branch);
    if (sources.some(sameSource(result.repository, appDir))) {
      skipped.push({ repository: label, reason: 'already a template' });
    } else if (pull) {
      skipped.push({ repository: label, reason: pullState(pull) });
    } else if (deploy && !deploy.ok) {
      skipped.push({ repository: label, reason: `failed to deploy on Hostinger: ${deploy.error ?? 'unknown error'}` });
    } else {
      eligible.push({ result, appDir, branch, deployed: Boolean(deploy?.ok) });
    }
  }
  eligible.sort((a, b) => Number(b.deployed) - Number(a.deployed) || (b.result.stars ?? 0) - (a.result.stars ?? 0));
  const picked = [];
  for (const [index, item] of eligible.entries()) {
    const label = item.appDir ? `${item.result.repository}:${item.appDir}` : item.result.repository;
    if (index >= limit) {
      skipped.push({ repository: label, reason: `over this run's limit of ${limit}` });
      continue;
    }
    const id = candidateId(item.result.repository, item.appDir, taken);
    taken.add(id);
    picked.push({
      id,
      repository: item.result.repository,
      appDir: item.appDir,
      branch: item.branch,
      stars: item.result.stars ?? null,
      framework: item.result.framework ?? null,
      deployed: item.deployed,
      findings: item.result.findings ?? [],
    });
  }
  return { picked, skipped };
}

export function chooseTrack({ releases, defaultBranch, now = new Date() }) {
  const published = releases.filter((release) => !release.draft);
  const stable = published.find((release) => !release.prerelease);
  const newest = stable ?? published[0];
  if (newest && now - new Date(newest.published_at) <= RELEASE_MAX_AGE_DAYS * DAY_MS) {
    return { track: 'releases', ...(stable ? {} : { prereleases: true }) };
  }
  return { track: 'branch', ref: defaultBranch };
}

export function nodeMajorFor(pkg) {
  const range = pkg?.engines?.node;
  const majors = [...SUPPORTED_NODE_MAJORS].sort((a, b) => b - a);
  if (!range) {
    return majors[0];
  }
  return majors.find((major) => satisfiesMajor(range, major)) ?? null;
}

export function nodeCompatibility(pkg, nodeMajor) {
  const match = String(pkg?.engines?.node ?? '').match(/(\d+)(?:\.(\d+))?/);
  const version = match ? `${match[1]}.${match[2] ?? 0}+` : `${nodeMajor}+`;
  return { runtimes: [{ name: 'Node.js', versions: [version] }] };
}

export function skeletonEntry({ id, name, source, deploy, compatibility }) {
  return {
    id,
    name,
    summary: '',
    description: '',
    bucket: 'Technical and SaaS',
    categories: [],
    whoItsFor: '',
    demoUrl: `https://${id}.${DEMO_DOMAIN}`,
    classification: { categories: [], useCases: [], frameworks: [] },
    features: [],
    technology: { languages: [], frameworks: [], styling: [], data: [], deployment: [] },
    compatibility,
    deploy,
    routes: ['/'],
    source,
    media: null,
    searchTerms: [],
  };
}

export function mediaFor(id, homepageHeight, repository = process.env.GITHUB_REPOSITORY ?? 'hostinger/hostinger-templates') {
  const folder = `${templateRoot(id)}/preview`;
  const url = (path) => `https://github.com/${repository}/blob/main/${path}?raw=true`;
  const thumbnail = `${folder}/${id}-thumbnail.png`;
  const homepage = `${folder}/${id}-homepage.png`;
  return {
    thumbnail: {
      path: thumbnail,
      url: url(thumbnail),
      source: 'viewport',
      width: 1440,
      height: 900,
      aspectRatio: '16:10',
      variants: THUMBNAIL_WIDTHS.map((width) => ({ width, path: `${folder}/${id}-thumbnail-${width}.webp` })),
    },
    preview: { path: homepage, url: url(homepage), source: 'fullPage', width: 1440, height: homepageHeight },
  };
}

export function pngSize(buffer) {
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

export function previewFiles(id) {
  return [`${id}-thumbnail.png`, `${id}-homepage.png`, ...THUMBNAIL_WIDTHS.map((width) => `${id}-thumbnail-${width}.webp`)];
}

export function webpWidth(buffer) {
  if (buffer.length < 30 || buffer.toString('latin1', 0, 4) !== 'RIFF' || buffer.toString('latin1', 8, 12) !== 'WEBP') {
    return null;
  }
  const chunk = buffer.toString('latin1', 12, 16);
  if (chunk === 'VP8 ') {
    return buffer.readUInt16LE(26) & 0x3fff;
  }
  if (chunk === 'VP8L') {
    return 1 + (buffer[21] | ((buffer[22] & 0x3f) << 8));
  }
  if (chunk === 'VP8X') {
    return 1 + buffer.readUIntLE(24, 3);
  }
  return null;
}

export function checkPreview(id, read) {
  const problems = [];
  const png = (name) => {
    const buffer = read(name);
    if (!buffer || buffer.length < 24 || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
      problems.push(`${name} is not a PNG`);
      return null;
    }
    return pngSize(buffer);
  };
  const thumbnail = png(`${id}-thumbnail.png`);
  if (thumbnail && (thumbnail.width !== 1440 || thumbnail.height !== 900)) {
    problems.push(`the thumbnail is ${thumbnail.width}×${thumbnail.height}, not 1440×900`);
  }
  const homepage = png(`${id}-homepage.png`);
  if (homepage && (homepage.width !== 1440 || homepage.height < 1 || homepage.height > MAX_HOMEPAGE_HEIGHT)) {
    problems.push(`the home page screenshot is ${homepage.width}×${homepage.height}`);
  }
  for (const width of THUMBNAIL_WIDTHS) {
    const name = `${id}-thumbnail-${width}.webp`;
    const buffer = read(name);
    if (!buffer || webpWidth(buffer) !== width) {
      problems.push(`${name} is not a ${width}px WebP`);
    }
  }
  return { problems, homepageHeight: problems.length ? null : homepage.height };
}

export function safeOutputDirectory(value) {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'string' || !/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/.test(value) || value.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error(`the build output directory ${JSON.stringify(value)} is not a plain relative path`);
  }
  return value;
}

function links(text) {
  return (text.match(URL_PATTERN) ?? []).map((link) => link.replace(/[.,;:!?]+$/, ''));
}

function strings(value) {
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(strings);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(strings);
  }
  return [];
}

function parseUrl(text) {
  try {
    return new URL(text.startsWith('www.') ? `https://${text}` : text);
  } catch {
    return null;
  }
}

function copyUrlAllowed(url) {
  return url?.protocol === 'https:' && COPY_HOSTS.has(url.hostname);
}

function noteUrlAllowed(url, source, demoUrl) {
  if (copyUrlAllowed(url) || (url?.protocol === 'https:' && url.host === parseUrl(demoUrl)?.host)) {
    return true;
  }
  const repository = `/${source.repository.toLowerCase()}`;
  const path = url?.pathname.toLowerCase() ?? '';
  return url?.protocol === 'https:' && url.hostname === 'github.com' && (path === repository || path.startsWith(`${repository}/`));
}

export function copyProblems({ entry, page, notes, source, demoUrl }) {
  const copy = [...strings(COPY_FIELDS.map((field) => entry?.[field])), ...strings(page)];
  const problems = [];
  if ([...copy, notes].some((text) => SECRET_PATTERN.test(text))) {
    problems.push('it contains text that looks like a credential');
  }
  for (const link of copy.flatMap(links)) {
    if (!copyUrlAllowed(parseUrl(link))) {
      problems.push(`the copy links to ${link}`);
    }
  }
  for (const link of links(notes)) {
    if (!noteUrlAllowed(parseUrl(link), source, demoUrl)) {
      problems.push(`the notes link to ${link}`);
    }
  }
  return [...new Set(problems)];
}

export function mergeCopy(entry, edited) {
  const merged = { ...entry };
  for (const field of COPY_FIELDS) {
    if (edited?.[field] !== undefined) {
      merged[field] = edited[field];
    }
  }
  return merged;
}

export function withEntry(catalogText, entry) {
  const catalog = JSON.parse(catalogText);
  const others = catalog.templates.filter((candidate) => candidate.id !== entry.id);
  return `${toAsciiJson({ ...catalog, templates: [...others, entry] })}\n`;
}

export function withLandingPage(indexText, id) {
  const index = JSON.parse(indexText);
  return `${JSON.stringify({ ...index, landingPages: [...new Set([...index.landingPages, id])].sort() }, null, 2)}\n`;
}

export function publishedPage(page) {
  return `${JSON.stringify({ ...page, landingPage: { ...page.landingPage, enabled: true } }, null, 2)}\n`;
}

export function addedEntries(baseCatalog, branchCatalog) {
  const baseIds = new Set(baseCatalog.templates.map((entry) => entry.id));
  return branchCatalog.templates.filter((entry) => !baseIds.has(entry.id));
}

export function rejection(notes) {
  const match = notes.match(/^\s*REJECT:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

export function pullTitle(entry) {
  return `Add the ${entry.name} template from ${entry.source.repository}`;
}

export function reviewNotes(notes) {
  return `Claude wrote the catalog text and the landing page copy from the code and the screenshots. Check that every claim matches the demo.\n\n${notes.trim() || '- Nothing flagged.'}`;
}

export function renderBody({ candidate, entry, notes, repository, branch }) {
  const { source } = entry;
  const raw = (path) => `https://github.com/${repository}/blob/${branch}/${path}?raw=true`;
  const findings = candidate.findings.filter((finding) => finding.level !== 'pass');
  const pin = `${source.ref}@${source.commit.slice(0, 7)}`;
  const lines = [
    `Adds **${entry.name}**, a copy of [${source.repository}](https://github.com/${source.repository})${source.directory ? ` (\`${source.directory}\`)` : ''} at [\`${pin}\`](https://github.com/${source.repository}/tree/${source.commit}), as \`templates/${entry.id}/\` with its catalog entry and an enabled landing page.`,
    '',
    '## Merging publishes it',
    '',
    `- The demo deploys to ${entry.demoUrl}.`,
    `- hPanel lists it, and hostinger.com builds \`/applications/${entry.id}\`, while the \`node-application-pages-release\` flag is on.`,
    '- Close this PR to decline the repository. The weekly scan will not propose it again; reopen the PR to reconsider it.',
    '',
    '## What was checked',
    '',
    `- Repository deployability scan: deployable${candidate.stars !== null ? `, ${candidate.stars} stars` : ''}${candidate.framework ? `, ${candidate.framework}` : ''}, ${source.license}.${candidate.deployed ? ' It deployed and passed the smoke check on Hostinger.' : ''}`,
    ...findings.map((finding) => `  - ${finding.level === 'fail' ? '❌' : '⚠️'} ${finding.message}`),
    `- Installed, built and audited on Node.js ${entry.deploy.nodeVersion}, served locally, and captured the screenshots below.`,
    '- The Template gate checks the copy against the upstream commit, builds and audits it again, and lints the landing page copy.',
    '',
    '## Review',
    '',
    notes === null ? AWAITING_COPY : reviewNotes(notes),
    '',
    `| Thumbnail | Home page |`,
    '| --- | --- |',
    `| ![thumbnail](${raw(entry.media.thumbnail.path)}) | ![home page](${raw(entry.media.preview.path)}) |`,
    '',
    'Opened by the `template-candidates` workflow, which never merges. It rebuilds this branch on the latest `main` when the PR has conflicts.',
  ];
  return `${lines.join('\n')}\n`;
}

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).replace(/\n$/, '');
}

function hashObject(content) {
  return execFileSync('git', ['hash-object', '--stdin'], { input: content, encoding: 'utf8' }).trim();
}

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

function report(markdown) {
  console.log(markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }
}

function optionValue(args, name) {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeVendoredTree(gitDir, entries, targetDir) {
  rmSync(targetDir, { recursive: true, force: true });
  for (const entry of entries) {
    const file = join(targetDir, entry.path);
    mkdirSync(dirname(file), { recursive: true });
    if (entry.mode === '120000') {
      symlinkSync(readBlob(gitDir, entry.sha).toString('utf8'), file);
      continue;
    }
    writeFileSync(file, readBlob(gitDir, entry.sha));
    if (entry.mode === '100755') {
      chmodSync(file, 0o755);
    }
  }
}

async function readApplicationSlugs() {
  try {
    const response = await fetch(APPLICATIONS_LISTING_URL, {
      headers: { 'User-Agent': 'hostinger-templates-ci (+https://github.com/hostinger/hostinger-templates)' },
    });
    const html = response.ok ? await response.text() : '';
    return [...html.matchAll(/href="\/applications\/([a-z0-9-]+)"/g)].map((match) => match[1]);
  } catch {
    return [];
  }
}

async function graphql(query, variables) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'hostinger-templates-candidates' },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (!response.ok || result.errors) {
    throw new Error(`GraphQL returned ${response.status}: ${JSON.stringify(result.errors ?? result).slice(0, 200)}`);
  }
  return result.data;
}

function loadCandidate(args, id) {
  const candidate = readJson(optionValue(args, '--candidates') ?? 'candidates.json').find((item) => item.id === id);
  if (!candidate) {
    throw new Error(`${id} is not in the picked candidates`);
  }
  return candidate;
}

async function copyCandidate(candidate, id) {
  const client = createClient(process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN);
  const repo = await client.json(`/repos/${candidate.repository}`);
  const releases = await client.json(`/repos/${candidate.repository}/releases?per_page=30`);
  const track = chooseTrack({ releases, defaultBranch: repo.default_branch });
  const pinned = await latestPin({ repository: repo.full_name, ...track }, client);
  const source = {
    repository: repo.full_name,
    ...(candidate.appDir ? { directory: candidate.appDir.replace(/\/+$/, '') } : {}),
    track: track.track,
    ...(track.prereleases ? { prereleases: true } : {}),
    ref: pinned.ref,
    commit: pinned.commit,
    license: repo.license?.spdx_id ?? 'NOASSERTION',
  };

  const gitDir = process.cwd();
  fetchCommit(gitDir, source.repository, source.commit);
  const entries = expectedEntries(gitDir, source.commit, source.directory, source.exclude);
  writeVendoredTree(gitDir, entries, join(gitDir, templateRoot(id)));
  const { problems } = inspectEntries(gitDir, entries);
  if (!hasLicense(entries)) {
    problems.push('no LICENSE file at the copy root');
  }
  if (entries.length > MAX_BLOBS) {
    problems.push(`${entries.length} files, more than the ${MAX_BLOBS} the bot uploads`);
  }
  const pkg = existsSync(join(templateRoot(id), 'package.json')) ? readJson(join(templateRoot(id), 'package.json')) : null;
  const nodeMajor = nodeMajorFor(pkg);
  if (!pkg) {
    problems.push('no package.json at the copy root');
  } else if (!nodeMajor) {
    problems.push(`engines.node "${pkg.engines.node}" excludes every supported Node.js version`);
  }
  if (problems.length) {
    dropFetchedCommit(gitDir, source.commit);
    throw new Error(`${candidate.repository} can't be copied: ${problems.join('; ')}`);
  }
  const entry = skeletonEntry({
    id,
    name: repo.name,
    source,
    deploy: { nodeVersion: nodeMajor },
    compatibility: nodeCompatibility(pkg, nodeMajor),
  });
  return { source, entries, entry };
}

async function pick(args) {
  const results = readJson(optionValue(args, '--results'));
  const deploysFile = optionValue(args, '--deploys');
  const deploys = deploysFile && existsSync(deploysFile) ? readJson(deploysFile) : [];
  const limit = Number(optionValue(args, '--limit') ?? 2);
  const api = createApi(process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN, process.env.GITHUB_REPOSITORY);
  const pulls = [];
  for (let page = 1; ; page++) {
    const batch = await api('GET', `/pulls?state=all&per_page=100&page=${page}`);
    pulls.push(...batch.filter((pull) => pull.head.ref.startsWith(BRANCH_PREFIX)));
    if (batch.length < 100) {
      break;
    }
  }
  const { picked, skipped } = pickCandidates({
    results,
    deploys,
    catalog: readJson(CATALOG),
    pulls,
    takenIds: await readApplicationSlugs(),
    limit,
  });
  writeFileSync('candidates.json', JSON.stringify(picked, null, 2));
  output('candidates', JSON.stringify(picked.map(({ id, branch }) => ({ id, branch }))));
  const lines = ['## Template candidates', ''];
  lines.push(picked.length ? `Preparing ${picked.map((item) => `\`${item.repository}\` as \`${item.id}\``).join(', ')}.` : 'No new deployable repositories.');
  if (skipped.length) {
    lines.push('', '| Deployable repository | Skipped because |', '| --- | --- |', ...skipped.map((item) => `| \`${item.repository}\` | ${item.reason.replace(/\|/g, '\\|')} |`));
  }
  report(lines.join('\n'));
}

async function prepare(id, args) {
  const candidate = loadCandidate(args, id);
  const { source, entries, entry } = await copyCandidate(candidate, id);
  writeFileSync(CATALOG, withEntry(readFileSync(CATALOG, 'utf8'), entry));
  writeFileSync(CANDIDATE_FILE, JSON.stringify({ ...candidate, source, entry }, null, 2));
  output('node-version', String(entry.deploy.nodeVersion));
  console.log(`Copied ${source.repository} ${source.ref}@${source.commit.slice(0, 7)} into ${templateRoot(id)}/ (${entries.length} files)`);
}

function settle(id) {
  const state = readJson(CANDIDATE_FILE);
  const dir = templateRoot(id);
  const staticDir = staticOutputDir(dir, {});
  const deploy = staticDir ? { outputDirectory: staticDir.slice(dir.length + 1), nodeVersion: state.entry.deploy.nodeVersion } : { nodeVersion: state.entry.deploy.nodeVersion };
  state.entry = { ...state.entry, deploy };
  writeFileSync(CATALOG, withEntry(readFileSync(CATALOG, 'utf8'), state.entry));
  writeFileSync(CANDIDATE_FILE, JSON.stringify(state, null, 2));
  console.log(staticDir ? `${id} builds to static files in ${deploy.outputDirectory}/` : `${id} runs as a Node.js server`);
}

function capture(id, args) {
  const shots = resolve(optionValue(args, '--from'));
  const out = resolve(optionValue(args, '--out'));
  const state = readJson(CANDIDATE_FILE);
  const result = existsSync(join(shots, 'result.json')) ? readJson(join(shots, 'result.json')) : null;
  if (!result || result.status >= 400) {
    throw new Error(`${id} did not answer on / in the local preview`);
  }
  const folder = join(out, 'preview');
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, `${id}-thumbnail.png`), readFileSync(join(shots, 'actual-thumbnail.png')));
  writeFileSync(join(folder, `${id}-homepage.png`), readFileSync(join(shots, 'actual-homepage.png')));
  for (const width of THUMBNAIL_WIDTHS) {
    execFileSync('cwebp', ['-quiet', '-q', '82', '-m', '6', '-af', '-resize', String(width), '0', join(folder, `${id}-thumbnail.png`), '-o', join(folder, `${id}-thumbnail-${width}.webp`)]);
  }
  const { problems } = checkPreview(id, (name) => readFileSync(join(folder, name)));
  if (problems.length) {
    throw new Error(problems.join('; '));
  }
  writeFileSync(join(out, CANDIDATE_FILE), JSON.stringify({ commit: state.source.commit, outputDirectory: state.entry.deploy.outputDirectory ?? null }, null, 2));
  console.log(`Captured ${id}'s screenshots`);
}

async function commitTree(api, { base, tree, message, branch, force = true }) {
  const baseTree = (await api('GET', `/git/commits/${base}`)).tree.sha;
  const created = await api('POST', '/git/trees', { base_tree: baseTree, tree });
  const commit = await api('POST', '/git/commits', { message, tree: created.sha, parents: [base] });
  if (await api('GET', `/git/ref/heads/${branch}`, null, { allow404: true })) {
    await api('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha, force });
  } else {
    await api('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commit.sha });
  }
  return commit.sha;
}

async function uploadFiles(api, paths, root = '.') {
  const tree = [];
  for (const path of paths) {
    const content = readFileSync(join(root, path));
    const sha = hashObject(content);
    await uploadBlob(api, content, sha);
    tree.push({ path, mode: '100644', type: 'blob', sha });
  }
  return tree;
}

async function open(id, args) {
  const candidate = loadCandidate(args, id);
  const prepared = resolve(optionValue(args, '--prepared'));
  const dryRun = args.includes('--dry-run');
  const repository = process.env.GITHUB_REPOSITORY ?? 'hostinger/hostinger-templates';
  const branch = candidateBranch(candidate.repository, candidate.appDir);
  const gitDir = process.cwd();
  const base = git(gitDir, 'rev-parse', 'HEAD');
  const { source, entries, entry: skeleton } = await copyCandidate(candidate, id);

  try {
    const built = readJson(join(prepared, CANDIDATE_FILE));
    if (built.commit !== source.commit) {
      throw new Error(`${source.repository} moved to ${source.commit.slice(0, 7)} after it was built; the next run picks it up again`);
    }
    const read = (name) => {
      const file = join(prepared, 'preview', name);
      return existsSync(file) ? readFileSync(file) : null;
    };
    const { problems, homepageHeight } = checkPreview(id, read);
    if (problems.length) {
      throw new Error(`the prepared screenshots were rejected: ${problems.join('; ')}`);
    }
    const outputDirectory = safeOutputDirectory(built.outputDirectory);
    const entry = {
      ...skeleton,
      deploy: { ...(outputDirectory ? { outputDirectory } : {}), nodeVersion: skeleton.deploy.nodeVersion },
      media: mediaFor(id, homepageHeight, repository),
    };

    const folder = join(templateRoot(id), 'preview');
    mkdirSync(folder, { recursive: true });
    for (const name of previewFiles(id)) {
      writeFileSync(join(folder, name), read(name));
    }
    writeFileSync(CATALOG, withEntry(readFileSync(CATALOG, 'utf8'), entry));
    execFileSync('node', ['.github/scripts/dependabot-config.mjs', '--write'], { stdio: 'inherit' });
    const files = [CATALOG, DEPENDABOT, ...previewFiles(id).map((name) => `${folder}/${name}`)];
    const title = pullTitle(entry);
    const body = renderBody({ candidate, entry, notes: null, repository, branch });

    if (dryRun) {
      writeFileSync('pr-body.md', body);
      report(`Dry run: would open the draft "${title}" from ${branch} with ${entries.length} copied files and ${files.join(', ')}. pr-body.md holds the PR body.`);
      return;
    }

    const api = createApi(process.env.GH_TOKEN, repository);
    const tree = [];
    for (const item of entries) {
      await uploadBlob(api, readBlob(gitDir, item.sha), item.sha);
      tree.push({ path: `${templateRoot(id)}/${item.path}`, mode: item.mode, type: 'blob', sha: item.sha });
    }
    tree.push(...(await uploadFiles(api, files)));
    const sha = await commitTree(api, { base, tree, message: title, branch });
    const pull = await api('POST', '/pulls', { title, head: branch, base: 'main', body, draft: true });
    report(`Opened the draft #${pull.number} from ${branch} at ${sha.slice(0, 7)}: ${title}`);
  } finally {
    if (!dryRun) {
      dropFetchedCommit(gitDir, source.commit);
    }
  }
}

function brief(_id, args) {
  const base = optionValue(args, '--base') ?? 'origin/main';
  const added = addedEntries(JSON.parse(git('.', 'show', `${base}:${CATALOG}`)), readJson(CATALOG));
  if (added.length !== 1) {
    throw new Error(`the branch adds ${added.length} catalog entries, not one`);
  }
  const [entry] = added;
  const { source } = entry;
  writeFileSync(
    CANDIDATE_FILE,
    JSON.stringify(
      {
        id: entry.id,
        repository: source.repository,
        directory: source.directory ?? null,
        ref: source.ref,
        commit: source.commit,
        license: source.license,
        demoUrl: entry.demoUrl,
        screenshots: previewFiles(entry.id).slice(0, 2).map((name) => `${templateRoot(entry.id)}/preview/${name}`),
      },
      null,
      2,
    ),
  );
  writeFileSync(LANDING_INDEX, withLandingPage(readFileSync(LANDING_INDEX, 'utf8'), entry.id));
  output('id', entry.id);
  console.log(`Writing the copy for ${entry.id} from ${source.repository}`);
}

function collectCopy(id, args) {
  const out = resolve(optionValue(args, '--out'));
  mkdirSync(out, { recursive: true });
  const edited = readJson(CATALOG).templates.find((entry) => entry.id === id);
  writeFileSync(join(out, 'entry.json'), JSON.stringify(edited ?? {}, null, 2));
  const page = `landing-pages/${id}.json`;
  if (existsSync(page)) {
    writeFileSync(join(out, 'landing-page.json'), readFileSync(page));
  }
  writeFileSync(join(out, NOTES_FILE), existsSync(NOTES_FILE) ? readFileSync(NOTES_FILE) : '');
}

async function applyCopy(_id, args) {
  const number = Number(optionValue(args, '--pull'));
  const copy = resolve(optionValue(args, '--copy'));
  const dryRun = args.includes('--dry-run');
  const repository = process.env.TEMPLATES_REPOSITORY ?? 'hostinger/hostinger-templates';
  const api = createApi(process.env.GH_TOKEN, repository);
  const gitDir = process.cwd();
  const pull = await api('GET', `/pulls/${number}`);
  const branch = pull.head.ref;
  if (pull.state !== 'open' || !pull.draft || !branch.startsWith(BRANCH_PREFIX) || pull.head.repo?.full_name !== repository) {
    throw new Error(`#${number} is not an open draft candidate PR from this repository`);
  }
  const head = pull.head.sha;
  git(gitDir, 'fetch', '--quiet', 'origin', head);
  const added = addedEntries(readJson(CATALOG), JSON.parse(git(gitDir, 'show', `${head}:${CATALOG}`)));
  if (added.length !== 1) {
    throw new Error(`#${number} adds ${added.length} catalog entries, not one`);
  }
  const [branchEntry] = added;
  const { id } = branchEntry;
  if (branch !== candidateBranch(branchEntry.source.repository, branchEntry.source.directory ?? null)) {
    throw new Error(`#${number} comes from ${branch}, not the branch for ${branchEntry.source.repository}`);
  }

  const notes = existsSync(join(copy, NOTES_FILE)) ? readFileSync(join(copy, NOTES_FILE), 'utf8') : '';
  const declined = rejection(notes);
  if (declined) {
    report(`Declined \`${branchEntry.source.repository}\` (#${number}): ${declined}`);
    if (!dryRun) {
      await api('POST', `/issues/${number}/comments`, {
        body: 'Declined by the automated review of the template content. Reopen this PR to reconsider the repository; it then needs its catalog text and landing page.',
      });
      await api('PATCH', `/pulls/${number}`, { state: 'closed' });
    }
    return;
  }

  if (!existsSync(join(copy, 'landing-page.json'))) {
    throw new Error(`no landing page was written for ${id}`);
  }
  const entry = mergeCopy(branchEntry, readJson(join(copy, 'entry.json')));
  const page = readJson(join(copy, 'landing-page.json'));
  const problems = copyProblems({ entry, page, notes, source: entry.source, demoUrl: entry.demoUrl });
  if (problems.length) {
    throw new Error(`the copy for #${number} was not pushed: ${problems.join('; ')}`);
  }

  const pageFile = `landing-pages/${id}.json`;
  const work = mkdtempSync(join(tmpdir(), 'candidate-'));
  try {
    git(gitDir, 'worktree', 'add', '--quiet', '--detach', work, head);
    writeFileSync(join(work, CATALOG), withEntry(readFileSync(join(work, CATALOG), 'utf8'), entry));
    writeFileSync(join(work, LANDING_INDEX), withLandingPage(readFileSync(join(work, LANDING_INDEX), 'utf8'), id));
    writeFileSync(join(work, pageFile), publishedPage(page));
    execFileSync('node', [join(gitDir, '.github/scripts/validate-catalog.mjs'), work], { stdio: 'inherit' });
    const title = pullTitle(entry);
    const current = pull.body ?? '';
    const body = current.includes(AWAITING_COPY) ? current.replace(AWAITING_COPY, reviewNotes(notes)) : `${current}\n\n${reviewNotes(notes)}\n`;

    if (dryRun) {
      writeFileSync('pr-body.md', body);
      report(`Dry run: would push ${CATALOG}, ${LANDING_INDEX} and ${pageFile} to ${branch}, retitle #${number} "${title}" and mark it ready for review. pr-body.md holds the PR body.`);
      return;
    }

    const tree = await uploadFiles(api, [CATALOG, LANDING_INDEX, pageFile], work);
    const sha = await commitTree(api, { base: head, tree, message: `Write the ${entry.name} catalog text and landing page`, branch, force: false });
    await api('PATCH', `/pulls/${number}`, { title, body });
    await graphql('mutation($id: ID!) { markPullRequestReadyForReview(input: { pullRequestId: $id }) { clientMutationId } }', { id: pull.node_id });
    report(`Pushed the copy for ${id} to ${branch} as ${sha.slice(0, 7)} and marked #${number} ready for review`);
  } finally {
    git(gitDir, 'worktree', 'remove', '--force', work);
  }
}

async function restack() {
  const api = createApi(process.env.GH_TOKEN, process.env.GITHUB_REPOSITORY);
  const gitDir = process.cwd();
  const base = git(gitDir, 'rev-parse', 'HEAD');
  const open = (await api('GET', '/pulls?state=open&per_page=100')).filter((pull) => pull.head.ref.startsWith(BRANCH_PREFIX));
  const baseCatalogText = readFileSync(CATALOG, 'utf8');
  const baseIndexText = readFileSync(LANDING_INDEX, 'utf8');
  for (const summary of open) {
    let pull = await api('GET', `/pulls/${summary.number}`);
    for (let attempt = 0; pull.mergeable === null && attempt < 5; attempt++) {
      await new Promise((done) => setTimeout(done, 3000));
      pull = await api('GET', `/pulls/${summary.number}`);
    }
    if (pull.mergeable !== false) {
      continue;
    }
    const branch = pull.head.ref;
    git(gitDir, 'fetch', '--quiet', 'origin', `+refs/heads/${branch}:refs/remotes/origin/${branch}`);
    const remote = `origin/${branch}`;
    const added = addedEntries(JSON.parse(baseCatalogText), JSON.parse(git(gitDir, 'show', `${remote}:${CATALOG}`)));
    if (added.length !== 1) {
      console.log(`::warning::#${pull.number} adds ${added.length} catalog entries; left for a person to rebase`);
      continue;
    }
    const [entry] = added;
    const pageFile = `landing-pages/${entry.id}.json`;
    const hasPage = git(gitDir, 'ls-tree', '--name-only', remote, pageFile) === pageFile;
    git(gitDir, 'checkout', remote, '--', templateRoot(entry.id), ...(hasPage ? [pageFile] : []));
    writeFileSync(CATALOG, withEntry(baseCatalogText, entry));
    if (hasPage) {
      writeFileSync(LANDING_INDEX, withLandingPage(baseIndexText, entry.id));
    }
    execFileSync('node', ['.github/scripts/dependabot-config.mjs', '--write'], { stdio: 'inherit' });
    const tree = [
      { path: templateRoot(entry.id), mode: '040000', type: 'tree', sha: git(gitDir, 'rev-parse', `${remote}:${templateRoot(entry.id)}`) },
      ...(hasPage ? [{ path: pageFile, mode: '100644', type: 'blob', sha: git(gitDir, 'rev-parse', `${remote}:${pageFile}`) }] : []),
      ...(await uploadFiles(api, [CATALOG, DEPENDABOT, ...(hasPage ? [LANDING_INDEX] : [])])),
    ];
    const sha = await commitTree(api, { base, tree, message: pullTitle(entry), branch });
    report(`Rebuilt #${pull.number} (${branch}) on ${base.slice(0, 7)} as ${sha.slice(0, 7)}`);
    git(gitDir, 'reset', '--quiet', '--hard', base);
    git(gitDir, 'clean', '-fdq', '--', 'templates', 'landing-pages');
  }
}

const COMMANDS = {
  pick: (_id, args) => pick(args),
  prepare,
  settle,
  capture,
  open,
  brief,
  'collect-copy': collectCopy,
  'apply-copy': applyCopy,
  restack: () => restack(),
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...rest] = process.argv.slice(2);
  const id = rest[0] && !rest[0].startsWith('--') ? rest[0] : null;
  try {
    if (!COMMANDS[command]) {
      throw new Error(
        'Usage: template-candidates.mjs pick --results results.json [--deploys deploy-outcomes.json] [--limit 2] | prepare <id> | settle <id> | capture <id> --from <dir> --out <dir> | open <id> --prepared <dir> [--dry-run] | brief | collect-copy <id> --out <dir> | apply-copy --pull <number> --copy <dir> [--dry-run] | restack',
      );
    }
    await COMMANDS[command](id, rest);
  } catch (error) {
    console.log(`::error::${error.message}`);
    process.exitCode = 1;
  }
}
