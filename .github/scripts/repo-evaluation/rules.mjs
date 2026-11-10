// Decides whether a public GitHub repository can run as a Node.js app on
// Hostinger web hosting, from facts collected without running its code.
// The limits mirror hPanel's Node.js deploy settings
// (src/types/models/deploySettingsModels.ts) and the hosting platform.

export const SUPPORTED_NODE_MAJORS = [18, 20, 22, 24];
export const MAX_ARCHIVE_MB = 50;
export const STALE_AFTER_DAYS = 365;

const PERMISSIVE_LICENSES = new Set([
  'MIT',
  'MIT-0',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  '0BSD',
  'Unlicense',
  'CC0-1.0',
  'Zlib',
]);
const COPYLEFT_LICENSES = new Set(['GPL-2.0', 'GPL-3.0', 'AGPL-3.0', 'LGPL-2.1', 'LGPL-3.0', 'MPL-2.0', 'EPL-2.0']);

// Order matters: meta-frameworks before the libraries they're built on.
const FRAMEWORKS = [
  ['next', 'next', 'server'],
  ['nuxt', 'nuxt', 'server'],
  ['@sveltejs/kit', 'svelte-kit', 'static'],
  ['astro', 'astro', 'static'],
  ['@react-router/dev', 'react-router', 'static'],
  ['@remix-run/dev', 'react-router', 'server'],
  ['@angular/core', 'angular', 'static'],
  ['gatsby', 'gatsby', 'static'],
  ['@nestjs/core', 'nest', 'server'],
  ['fastify', 'fastify', 'server'],
  ['hono', 'hono', 'server'],
  ['express', 'express', 'server'],
  ['nitropack', 'nitro', 'server'],
  ['react-scripts', 'create-react-app', 'static'],
  ['@vue/cli-service', 'vue', 'static'],
  ['parcel', 'parcel', 'static'],
  ['vite', 'vite', 'static'],
];

const NOT_A_WEB_APP = [
  { deps: ['electron', 'electron-builder', '@electron-forge/cli'], reason: 'desktop app (Electron)' },
  { deps: ['@tauri-apps/api', '@tauri-apps/cli'], reason: 'desktop app (Tauri)' },
  { deps: ['react-native', 'expo', '@capacitor/core'], reason: 'mobile app' },
  { deps: ['wxt', 'plasmo', '@crxjs/vite-plugin', 'webextension-polyfill'], reason: 'browser extension' },
  { deps: ['vscode', '@types/vscode'], reason: 'editor extension' },
];

const UNSUPPORTED_SERVICES = [
  { deps: ['pg', 'postgres', '@neondatabase/serverless', '@vercel/postgres'], reason: 'PostgreSQL' },
  { deps: ['mongodb', 'mongoose'], reason: 'MongoDB' },
  { deps: ['redis', 'ioredis', '@upstash/redis', 'bullmq', 'bull'], reason: 'Redis' },
  { deps: ['@elastic/elasticsearch'], reason: 'Elasticsearch' },
  { deps: ['kafkajs', 'amqplib'], reason: 'a message broker' },
];

const HEADLESS_OR_NATIVE = [
  { deps: ['puppeteer', 'playwright', 'playwright-core', '@playwright/test-runtime'], reason: 'a headless browser' },
  { deps: ['canvas', 'node-pty', 'robotjs', '@nut-tree/nut-js'], reason: 'native system access' },
];

const EXCLUDED_TOPICS = new Map([
  ['agent-skills', 'agent skills'],
  ['claude-skills', 'agent skills'],
  ['skills', 'agent skills'],
  ['mcp-server', 'MCP server'],
  ['model-context-protocol', 'MCP server'],
  ['ai-agent', 'AI agent'],
  ['ai-agents', 'AI agent'],
  ['autonomous-agents', 'AI agent'],
  ['computer-use', 'computer-use agent'],
  ['cli', 'command-line tool'],
  ['desktop-app', 'desktop app'],
  ['electron', 'desktop app (Electron)'],
  ['chrome-extension', 'browser extension'],
  ['browser-extension', 'browser extension'],
  ['vscode-extension', 'editor extension'],
  ['awesome', 'link list'],
  ['awesome-list', 'link list'],
]);

export function evaluateRepository(facts, { now = new Date() } = {}) {
  const findings = [];
  const fail = (check, message) => findings.push({ level: 'fail', check, message });
  const warn = (check, message) => findings.push({ level: 'warn', check, message });
  const pass = (check, message) => findings.push({ level: 'pass', check, message });

  const { repo, tree, packageJson, appDir } = facts;
  const deps = { ...packageJson?.dependencies, ...packageJson?.devDependencies };
  const runtimeDeps = packageJson?.dependencies ?? {};
  const has = (names, from = deps) => names.find((name) => name in from);

  if (repo.archived) fail('activity', 'The repository is archived.');
  const idleDays = Math.floor((now - new Date(repo.pushedAt)) / 86_400_000);
  if (idleDays > STALE_AFTER_DAYS) fail('activity', `No push for ${idleDays} days.`);
  else pass('activity', `Last push ${idleDays} days ago.`);

  const license = repo.license ?? 'NOASSERTION';
  if (PERMISSIVE_LICENSES.has(license)) pass('license', `${license} allows snapshotting it as a template.`);
  else if (COPYLEFT_LICENSES.has(license)) warn('license', `${license} is copyleft; legal must approve vendoring it.`);
  else fail('license', `No OSI license we can vendor (${license}).`);

  const topicReason = repo.topics.map((topic) => EXCLUDED_TOPICS.get(topic)).find(Boolean);
  if (topicReason) fail('kind', `Tagged as ${topicReason}, not a web app.`);

  const skillFiles = tree.filter((path) => /(^|\/)SKILL\.md$/.test(path)).length;
  if (skillFiles >= 2 || tree.some((path) => path.startsWith('.claude-plugin/'))) {
    fail('kind', `Agent skills collection (${skillFiles} SKILL.md files).`);
  }

  if (!packageJson) {
    fail('node', appDir ? `No package.json in ${appDir}.` : 'No package.json at the root: not a Node.js project.');
    return summarize(facts, findings, null);
  }

  if (facts.isPhpApp) fail('kind', 'PHP application (composer.json); it deploys as a PHP site, not a Node.js app.');
  const nonWebApp = NOT_A_WEB_APP.find(({ deps: names }) => has(names));
  if (nonWebApp) fail('kind', `${capitalize(nonWebApp.reason)}, not a web app.`);
  if (tree.some((path) => path.startsWith(`${prefix(appDir)}src-tauri/`))) fail('kind', 'Desktop app (Tauri).');
  if (isExtensionManifest(facts.manifestJson)) fail('kind', 'Browser extension (manifest.json).');
  if (has(['@modelcontextprotocol/sdk'], runtimeDeps) && !detectFramework(deps)) {
    fail('kind', 'MCP server, not a web app.');
  }

  const framework = detectFramework(deps);
  const scripts = packageJson.scripts ?? {};
  const isKnownNonWebApp = findings.some((finding) => finding.level === 'fail' && finding.check === 'kind');

  const workspaces = packageJson.workspaces || facts.hasPnpmWorkspace || facts.hasTurboOrNx;
  if (workspaces && !appDir && framework && scripts.build) {
    warn('layout', 'Workspaces: the app is at the root, but its workspace packages must build in the same archive.');
  } else if (workspaces && !appDir) {
    fail('layout', `Monorepo. Re-run with one app directory${
      facts.appCandidates?.length ? ` (${facts.appCandidates.join(', ')})` : ''
    }.`);
  }

  if (isKnownNonWebApp) {
    return summarize(facts, findings, framework);
  } else if (framework) {
    pass('framework', `${framework.key} (${framework.kind}) is a supported framework.`);
  } else if (scripts.start && !packageJson.bin) {
    warn('framework', 'No supported framework detected; deploys as "Other" with npm start.');
  } else if (packageJson.bin) {
    fail('kind', 'Command-line tool (package.json "bin"), not a web app.');
  } else if (packageJson.main || packageJson.exports) {
    fail('kind', 'Library (exports code, no app to run).');
  } else {
    fail('framework', 'No supported framework and no start script.');
  }

  if (framework?.kind === 'static' && !scripts.build) fail('scripts', 'No build script for a frontend app.');
  if (framework?.kind === 'server' && !scripts.start && !scripts.build) fail('scripts', 'No build or start script.');
  if (scripts.build || scripts.start) pass('scripts', `Scripts: ${['build', 'start'].filter((name) => scripts[name]).join(', ')}.`);

  const engines = packageJson.engines?.node;
  if (engines) {
    const majors = SUPPORTED_NODE_MAJORS.filter((major) => satisfiesMajor(engines, major));
    if (majors.length) pass('node', `engines.node "${engines}" runs on Node.js ${majors.join(', ')}.`);
    else fail('node', `engines.node "${engines}" excludes every supported Node.js version (${SUPPORTED_NODE_MAJORS.join(', ')}).`);
  }
  if (packageJson.engines?.bun || facts.lockfiles.includes('bun')) {
    if (!facts.lockfiles.some((lock) => ['npm', 'yarn', 'pnpm'].includes(lock))) fail('packages', 'Bun only; Hostinger installs with npm, yarn or pnpm.');
  }
  if (facts.hasDeno) fail('packages', 'Deno project.');
  const managers = facts.lockfiles.filter((lock) => ['npm', 'yarn', 'pnpm'].includes(lock));
  if (managers.length) pass('packages', `Lockfile: ${managers.join(', ')}.`);
  else warn('packages', 'No lockfile; installs will drift.');

  const service = UNSUPPORTED_SERVICES.find(({ deps: names }) => has(names, runtimeDeps));
  if (service) fail('services', `Needs ${service.reason}; Hostinger Node.js hosting only offers MySQL.`);
  if (facts.prismaProvider && !['mysql', 'sqlite'].includes(facts.prismaProvider)) {
    fail('services', `Prisma uses ${facts.prismaProvider}; only MySQL is available.`);
  }
  const composeServices = (facts.composeServices ?? []).filter((name) => /postgres|mongo|redis|elastic|rabbit|kafka|minio|clickhouse/i.test(name));
  if (composeServices.length) fail('services', `docker-compose needs ${composeServices.join(', ')}.`);
  if (has(['better-sqlite3', 'sqlite3'], runtimeDeps)) warn('services', 'SQLite: a native module, and the data lives in a file on the server.');
  if (has(['mysql2', 'mysql', '@prisma/client', 'drizzle-orm', 'knex', 'sequelize', 'typeorm'], runtimeDeps) && !service) {
    pass('services', 'Uses a database layer that can target MySQL.');
  }

  const native = HEADLESS_OR_NATIVE.find(({ deps: names }) => has(names, runtimeDeps));
  if (native) fail('runtime', `Needs ${native.reason}, which shared hosting can't run.`);

  const sizeMb = Math.round(repo.sizeKb / 1024);
  if (sizeMb > MAX_ARCHIVE_MB) warn('size', `Repository is ${sizeMb} MB with history; the source archive must stay under ${MAX_ARCHIVE_MB} MB.`);

  const secrets = (facts.envExampleKeys ?? []).filter((key) => /KEY|SECRET|TOKEN|PASSWORD|CLIENT_ID|DSN/.test(key));
  if (secrets.length > 5) warn('config', `${secrets.length} secrets to set before it starts (${secrets.slice(0, 5).join(', ')}…).`);
  else if (secrets.length) warn('config', `Needs ${secrets.join(', ')}.`);

  return summarize(facts, findings, framework);
}

function summarize(facts, findings, framework) {
  const failed = findings.some((finding) => finding.level === 'fail');
  const warned = findings.some((finding) => finding.level === 'warn');
  return {
    repository: facts.repo.fullName,
    appDir: facts.appDir ?? null,
    stars: facts.repo.stars,
    commit: facts.commit,
    ref: facts.ref ?? null,
    framework: framework?.key ?? null,
    verdict: failed ? 'not-deployable' : warned ? 'needs-review' : 'deployable',
    findings,
  };
}

export function detectFramework(deps) {
  const match = FRAMEWORKS.find(([dependency]) => dependency in deps);
  return match ? { key: match[1], kind: match[2] } : null;
}

// Minimal semver range check for engines.node: ||, spaces (AND), ^ ~ >= > <= < =, x and partial versions.
export function satisfiesMajor(range, major) {
  const candidates = [`${major}.0.0`, `${major}.10.0`, `${major}.99.0`].map(parseVersion);
  return range
    .split('||')
    .map((part) => part.trim())
    .some((part) => candidates.some((version) => part.split(/\s+/).filter(Boolean).every((comparator) => matches(comparator, version))));
}

function matches(comparator, version) {
  const match = comparator.match(/^(\^|~|>=|<=|>|<|=)?v?(\d+|x|\*)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?/);
  if (!match) return true;
  const [, operator = '', ...parts] = match;
  const wanted = parts.map((part) => (part === undefined || part === 'x' || part === '*' ? null : Number(part)));
  const floor = wanted.map((part) => part ?? 0);
  const cmp = compare(version, floor);
  switch (operator) {
    case '>=':
      return cmp >= 0;
    case '>':
      return cmp > 0;
    case '<=':
      return cmp <= 0;
    case '<':
      return cmp < 0;
    case '^':
      return cmp >= 0 && version[0] === floor[0];
    case '~':
      return cmp >= 0 && version[0] === floor[0] && (wanted[1] === null || version[1] === floor[1]);
    default:
      return wanted.every((part, index) => part === null || part === version[index]);
  }
}

function parseVersion(text) {
  return text.split('.').map(Number);
}

function compare(a, b) {
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

function isExtensionManifest(manifest) {
  return Boolean(manifest && typeof manifest.manifest_version === 'number' && (manifest.background || manifest.content_scripts || manifest.action || manifest.browser_action));
}

function prefix(appDir) {
  return appDir ? `${appDir.replace(/\/$/, '')}/` : '';
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}
