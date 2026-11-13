import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { auditPolicy, catalogEntry, commandEnv, packageManager, packageManagerCommand } from './template-commands.mjs';

/**
 * Audits a template's production dependencies for high and critical
 * advisories, head against the base commit, under the policy
 * template-commands.mjs auditPolicy picks:
 *
 *   regression     (our templates) fail only on advisories the base did not
 *                  have. Pre-existing findings are reported, not blocking:
 *                  they belong to dependency-update work, and letting them
 *                  fail every unrelated PR froze Dependabot's security group
 *                  behind advisories nobody could fix yet.
 *   static-warn    (vendored, deployed as static files) report as warnings.
 *   server-strict  (vendored, runs as a server) fail on any finding.
 *
 *   node audit-regression.mjs <template-dir> <base-sha>
 *
 * Run it after the build: the policy depends on the build output. Writes
 * <template-dir>/.audit-regression.json for the PR comment.
 */

const BLOCKING = new Set(['high', 'critical']);
// What each package manager audits from, besides package.json.
const AUDIT_FILES = {
  npm: ['package-lock.json'],
  pnpm: ['pnpm-lock.yaml', 'pnpm-workspace.yaml'],
};
const templateDir = resolve(process.argv[2] ?? process.cwd());
const baseSha = process.argv[3];
const templateId = basename(templateDir);
// Path of the template inside the repository, as git sees it (handles
// worktrees and symlinked parents such as macOS /tmp).
const templatePath = execFileSync('git', ['rev-parse', '--show-prefix'], {
  cwd: templateDir,
  encoding: 'utf8',
})
  .trim()
  .replace(/\/$/, '');

if (!baseSha) {
  console.error('Usage: audit-regression.mjs <template-dir> <base-sha>');
  process.exit(1);
}

const entry = catalogEntry(templateDir);
const pm = packageManager(templateDir, entry);
const policy = auditPolicy(templateDir, entry);
if (!AUDIT_FILES[pm]) {
  console.error(`No audit for ${pm} projects; use npm or pnpm.`);
  process.exit(1);
}

const head = audit(templateDir);
const base = auditBase();

const headKeys = new Map(head.map((finding) => [finding.key, finding]));
const baseKeys = new Set(base.map((finding) => finding.key));

const introduced = [...headKeys.values()].filter((finding) => !baseKeys.has(finding.key));
const preexisting = [...headKeys.values()].filter((finding) => baseKeys.has(finding.key));
const resolved = base.filter((finding) => !headKeys.has(finding.key));

const ok = { regression: introduced.length === 0, 'static-warn': true, 'server-strict': head.length === 0 }[policy];
const result = {
  template: templateId,
  baseSha,
  packageManager: pm,
  policy,
  ok,
  introduced,
  preexisting,
  resolved,
};
writeFileSync(join(templateDir, '.audit-regression.json'), JSON.stringify(result, null, 2));

console.log(`Audit policy: ${policy} (${pm})`);
printSection(policy === 'regression' ? 'Introduced by this change (blocking)' : 'Introduced by this change', introduced);
printSection(policy === 'regression' ? 'Pre-existing on base (informational)' : 'Pre-existing on base', preexisting);
printSection('Resolved by this change', resolved);

const count = (findings) => `${findings.length} high/critical production advisor${findings.length === 1 ? 'y' : 'ies'}`;
if (policy === 'static-warn' && head.length) {
  console.log(
    `::warning::templates/${templateId} is vendored and deployed as static files, so its ${count(head)} affect the build only. Re-pin upstream when a fix lands.`,
  );
}
if (!ok) {
  console.error(
    policy === 'server-strict'
      ? `\n${count(head)} in templates/${templateId}, a vendored template that runs as a server. Re-pin it to an upstream commit without them.`
      : `\n${count(introduced)} introduced in templates/${templateId}.`,
  );
  process.exit(1);
}

console.log(`\nAudit passed for templates/${templateId}.`);

/**
 * Audit the base commit's manifest and lockfile for this template without
 * checking anything out: write them to a scratch directory and audit the
 * lockfile only.
 */
function auditBase() {
  const manifest = show(`${baseSha}:${templatePath}/package.json`);
  const [lockfile, ...extras] = AUDIT_FILES[pm];
  const lock = show(`${baseSha}:${templatePath}/${lockfile}`);

  if (manifest === null || lock === null) {
    // New template, or no lockfile on base: everything on head counts as new.
    return [];
  }

  const scratch = mkdtempSync(join(tmpdir(), `audit-base-${templateId}-`));
  try {
    writeFileSync(join(scratch, 'package.json'), manifest);
    writeFileSync(join(scratch, lockfile), lock);
    for (const file of extras) {
      const content = show(`${baseSha}:${templatePath}/${file}`);
      if (content !== null) {
        writeFileSync(join(scratch, file), content);
      }
    }
    return audit(scratch);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function show(spec) {
  const output = spawnSync('git', ['show', spec], {
    cwd: templateDir,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return output.status === 0 ? output.stdout : null;
}

/**
 * Returns one entry per (advisory, package) pair at a blocking severity in
 * production dependencies. Audits exit non-zero when they find anything, so
 * read stdout regardless of status.
 */
function audit(cwd) {
  const args =
    pm === 'npm'
      ? ['audit', '--omit=dev', '--package-lock-only', '--json', '--no-fund']
      : ['audit', '--prod', '--json'];
  const [command, commandArgs] = packageManagerCommand(pm, args);
  const output = spawnSync(command, commandArgs, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: commandEnv() });

  let report;
  try {
    report = JSON.parse(output.stdout);
  } catch {
    throw new Error(`${pm} audit produced no JSON in ${cwd}:\n${output.stderr}`);
  }

  if (report.error) {
    throw new Error(`${pm} audit failed in ${cwd}: ${report.error.summary ?? report.error.code}`);
  }

  const findings = new Map();
  for (const finding of pm === 'npm' ? npmFindings(report) : pnpmFindings(report)) {
    if (BLOCKING.has(finding.severity) && !findings.has(finding.key)) {
      findings.set(finding.key, finding);
    }
  }

  return [...findings.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function npmFindings(report) {
  return Object.values(report.vulnerabilities ?? {})
    .flatMap((vulnerability) => vulnerability.via ?? [])
    .filter((via) => typeof via === 'object')
    .map((via) => finding(via.url?.match(/GHSA-[\w-]+/)?.[0] ?? `npm-${via.source}`, via.name, via));
}

// pnpm reports the npm v6 shape: advisories keyed by id.
function pnpmFindings(report) {
  return Object.values(report.advisories ?? {}).map((advisory) =>
    finding(advisory.github_advisory_id ?? `npm-${advisory.id}`, advisory.module_name, {
      severity: advisory.severity,
      range: advisory.vulnerable_versions,
      title: advisory.title,
      url: advisory.url,
    }),
  );
}

function finding(advisory, name, { severity, range, title, url }) {
  return { key: `${advisory} ${name}`, advisory, package: name, severity, range, title, url };
}

function printSection(title, findings) {
  console.log(`\n${title}: ${findings.length}`);
  for (const finding of findings) {
    console.log(`  ${finding.severity.padEnd(8)} ${finding.package} ${finding.range ?? ''}  ${finding.advisory}  ${finding.title}`);
  }
}
