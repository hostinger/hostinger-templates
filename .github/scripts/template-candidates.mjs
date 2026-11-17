import { execFileSync } from 'node:child_process';
import { appendFileSync, chmodSync, existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
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
    'Claude wrote the catalog text and the landing page copy from the code and the screenshots. Check that every claim matches the demo.',
    '',
    notes.trim() || '- Nothing flagged.',
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

function vendor(gitDir, source, id) {
  fetchCommit(gitDir, source.repository, source.commit);
  const entries = expectedEntries(gitDir, source.commit, source.directory, source.exclude);
  writeVendoredTree(gitDir, entries, join(gitDir, templateRoot(id)));
  return entries;
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
  const candidate = readJson(optionValue(args, '--candidates') ?? 'candidates.json').find((item) => item.id === id);
  if (!candidate) {
    throw new Error(`${id} is not in the picked candidates`);
  }
  const client = createClient(process.env.GITHUB_TOKEN);
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
  const entries = vendor(gitDir, source, id);
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
    throw new Error(`${candidate.repository} can't be copied: ${problems.join('; ')}`);
  }

  const entry = skeletonEntry({
    id,
    name: repo.name,
    source,
    deploy: { nodeVersion: nodeMajor },
    compatibility: nodeCompatibility(pkg, nodeMajor),
  });
  writeFileSync(CATALOG, withEntry(readFileSync(CATALOG, 'utf8'), entry));
  writeFileSync(CANDIDATE_FILE, JSON.stringify({ ...candidate, source, entry }, null, 2));
  output('node-version', String(nodeMajor));
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
  const thumbnail = readFileSync(join(shots, 'actual-thumbnail.png'));
  const homepage = readFileSync(join(shots, 'actual-homepage.png'));
  writeFileSync(join(folder, `${id}-thumbnail.png`), thumbnail);
  writeFileSync(join(folder, `${id}-homepage.png`), homepage);
  for (const width of THUMBNAIL_WIDTHS) {
    execFileSync('cwebp', ['-quiet', '-q', '82', '-m', '6', '-af', '-resize', String(width), '0', join(folder, `${id}-thumbnail.png`), '-o', join(folder, `${id}-thumbnail-${width}.webp`)]);
  }
  const { width, height } = pngSize(thumbnail);
  if (width !== 1440 || height !== 900) {
    throw new Error(`the thumbnail is ${width}×${height}, not 1440×900`);
  }
  state.entry = { ...state.entry, media: mediaFor(id, pngSize(homepage).height) };
  writeFileSync(join(out, CANDIDATE_FILE), JSON.stringify(state, null, 2));
  console.log(`Captured ${id}'s screenshots`);
}

function restore(id, args) {
  const from = resolve(optionValue(args, '--from'));
  const state = readJson(join(from, CANDIDATE_FILE));
  const entries = vendor(process.cwd(), state.source, id);
  const folder = join(templateRoot(id), 'preview');
  mkdirSync(folder, { recursive: true });
  for (const name of [`${id}-thumbnail.png`, `${id}-homepage.png`, ...THUMBNAIL_WIDTHS.map((width) => `${id}-thumbnail-${width}.webp`)]) {
    writeFileSync(join(folder, name), readFileSync(join(from, 'preview', name)));
  }
  writeFileSync(CATALOG, withEntry(readFileSync(CATALOG, 'utf8'), state.entry));
  writeFileSync(LANDING_INDEX, withLandingPage(readFileSync(LANDING_INDEX, 'utf8'), id));
  execFileSync('node', ['.github/scripts/dependabot-config.mjs', '--write'], { stdio: 'inherit' });
  writeFileSync(CANDIDATE_FILE, JSON.stringify(state, null, 2));
  return entries;
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

async function commitTree(api, { base, tree, message, branch }) {
  const baseTree = (await api('GET', `/git/commits/${base}`)).tree.sha;
  const created = await api('POST', '/git/trees', { base_tree: baseTree, tree });
  const commit = await api('POST', '/git/commits', { message, tree: created.sha, parents: [base] });
  if (await api('GET', `/git/ref/heads/${branch}`, null, { allow404: true })) {
    await api('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha, force: true });
  } else {
    await api('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commit.sha });
  }
  return commit.sha;
}

async function uploadFiles(api, paths) {
  const tree = [];
  for (const path of paths) {
    const content = readFileSync(path);
    const sha = hashObject(content);
    await uploadBlob(api, content, sha);
    tree.push({ path, mode: '100644', type: 'blob', sha });
  }
  return tree;
}

async function publish(id, args) {
  const prepared = resolve(optionValue(args, '--prepared'));
  const copy = resolve(optionValue(args, '--copy'));
  const gitDir = process.cwd();
  const base = git(gitDir, 'rev-parse', 'HEAD');
  const entries = restore(id, ['--from', prepared]);
  const state = readJson(CANDIDATE_FILE);
  const notes = existsSync(join(copy, NOTES_FILE)) ? readFileSync(join(copy, NOTES_FILE), 'utf8') : '';
  const dryRun = args.includes('--dry-run');
  const api = dryRun ? null : createApi(process.env.GH_TOKEN, process.env.GITHUB_REPOSITORY);
  const declined = rejection(notes);
  const entry = mergeCopy(state.entry, existsSync(join(copy, 'entry.json')) ? readJson(join(copy, 'entry.json')) : {});
  const title = pullTitle(entry);

  try {
    const pageFile = `landing-pages/${id}.json`;
    if (!declined) {
      if (!existsSync(join(copy, 'landing-page.json'))) {
        throw new Error(`Claude wrote no ${pageFile}`);
      }
      writeFileSync(pageFile, publishedPage(readJson(join(copy, 'landing-page.json'))));
    } else {
      execFileSync('git', ['checkout', '--', LANDING_INDEX]);
    }
    writeFileSync(CATALOG, withEntry(readFileSync(CATALOG, 'utf8'), entry));
    execFileSync('node', ['.github/scripts/dependabot-config.mjs', '--write'], { stdio: 'inherit' });
    if (!declined) {
      execFileSync('node', ['.github/scripts/validate-catalog.mjs'], { stdio: 'inherit' });
    }

    const preview = [`${id}-thumbnail.png`, `${id}-homepage.png`, ...THUMBNAIL_WIDTHS.map((width) => `${id}-thumbnail-${width}.webp`)];
    const files = [CATALOG, DEPENDABOT, ...preview.map((name) => `${templateRoot(id)}/preview/${name}`)];
    if (!declined) {
      files.push(LANDING_INDEX, pageFile);
    }
    if (dryRun) {
      writeFileSync('pr-body.md', renderBody({ candidate: state, entry, notes, repository: process.env.GITHUB_REPOSITORY ?? 'hostinger/hostinger-templates', branch: state.branch }));
      report(`Dry run: would ${declined ? `decline ${state.source.repository} (${declined})` : `open "${title}"`} from ${state.branch} with ${entries.length} copied files and ${files.join(', ')}. The files are written here and pr-body.md holds the PR body.`);
      return;
    }

    const tree = [];
    for (const item of entries) {
      await uploadBlob(api, readBlob(gitDir, item.sha), item.sha);
      tree.push({ path: `${templateRoot(id)}/${item.path}`, mode: item.mode, type: 'blob', sha: item.sha });
    }
    tree.push(...(await uploadFiles(api, files)));
    const sha = await commitTree(api, { base, tree, message: title, branch: state.branch });
    console.log(`Pointed ${state.branch} at ${sha}`);

    const body = renderBody({ candidate: state, entry, notes, repository: process.env.GITHUB_REPOSITORY, branch: state.branch });
    const pull = await api('POST', '/pulls', { title, head: state.branch, base: 'main', body });
    if (declined) {
      await api('POST', `/issues/${pull.number}/comments`, { body: `Claude declined this repository: ${declined}\n\nReopen the PR if it should still become a template; the branch then needs its landing page.` });
      await api('PATCH', `/pulls/${pull.number}`, { state: 'closed' });
      report(`Claude declined \`${state.source.repository}\` (${declined}); recorded as closed #${pull.number}.`);
      return;
    }
    report(`Opened #${pull.number}: ${title}`);
  } finally {
    if (!dryRun) {
      dropFetchedCommit(gitDir, state.source.commit);
    }
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
    git(gitDir, 'checkout', remote, '--', templateRoot(entry.id), pageFile);
    writeFileSync(CATALOG, withEntry(baseCatalogText, entry));
    writeFileSync(LANDING_INDEX, withLandingPage(baseIndexText, entry.id));
    execFileSync('node', ['.github/scripts/dependabot-config.mjs', '--write'], { stdio: 'inherit' });
    const tree = [
      { path: templateRoot(entry.id), mode: '040000', type: 'tree', sha: git(gitDir, 'rev-parse', `${remote}:${templateRoot(entry.id)}`) },
      { path: pageFile, mode: '100644', type: 'blob', sha: git(gitDir, 'rev-parse', `${remote}:${pageFile}`) },
      ...(await uploadFiles(api, [CATALOG, LANDING_INDEX, DEPENDABOT])),
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
  restore: (id, args) => {
    restore(id, args);
  },
  'collect-copy': collectCopy,
  publish,
  restack: () => restack(),
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...rest] = process.argv.slice(2);
  const id = rest[0] && !rest[0].startsWith('--') ? rest[0] : null;
  try {
    if (!COMMANDS[command]) {
      throw new Error(
        'Usage: template-candidates.mjs pick --results results.json [--deploys deploy-outcomes.json] [--limit 2] | prepare <id> | settle <id> | capture <id> --from <dir> --out <dir> | restore <id> --from <dir> | collect-copy <id> --out <dir> | publish <id> --prepared <dir> --copy <dir> [--dry-run] | restack',
      );
    }
    await COMMANDS[command](id, rest);
  } catch (error) {
    console.log(`::error::${error.message}`);
    process.exitCode = 1;
  }
}
