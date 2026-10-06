import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

/**
 * Fail only when a pull request introduces a high or critical advisory in a
 * template's production dependencies that the base commit did not already
 * have. Pre-existing findings are reported, not blocking: they belong to
 * dependency-update work, and letting them fail every unrelated PR froze
 * Dependabot's security group behind advisories nobody could fix yet.
 *
 *   node audit-regression.mjs <template-dir> <base-sha>
 *
 * Writes <template-dir>/.audit-regression.json for the PR comment.
 */

const BLOCKING = new Set(['high', 'critical']);
const templateDir = process.argv[2] ?? process.cwd();
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

const head = audit(templateDir);
const base = auditBase();

const headKeys = new Map(head.map((finding) => [finding.key, finding]));
const baseKeys = new Set(base.map((finding) => finding.key));

const introduced = [...headKeys.values()].filter((finding) => !baseKeys.has(finding.key));
const preexisting = [...headKeys.values()].filter((finding) => baseKeys.has(finding.key));
const resolved = base.filter((finding) => !headKeys.has(finding.key));

const result = {
  template: templateId,
  baseSha,
  ok: introduced.length === 0,
  introduced,
  preexisting,
  resolved,
};
writeFileSync(join(templateDir, '.audit-regression.json'), JSON.stringify(result, null, 2));

printSection('Introduced by this change (blocking)', introduced);
printSection('Pre-existing on base (informational)', preexisting);
printSection('Resolved by this change', resolved);

if (!result.ok) {
  console.error(
    `\n${introduced.length} high/critical production advisor${introduced.length === 1 ? 'y' : 'ies'} introduced in templates/${templateId}.`,
  );
  process.exit(1);
}

console.log(`\nNo new high/critical production advisories in templates/${templateId}.`);

/**
 * Audit the base commit's manifest and lockfile for this template without
 * checking anything out: write them to a scratch directory and run npm
 * audit against the lockfile only.
 */
function auditBase() {
  const manifest = show(`${baseSha}:${templatePath}/package.json`);
  const lockfile = show(`${baseSha}:${templatePath}/package-lock.json`);

  if (manifest === null || lockfile === null) {
    // New template, or no lockfile on base: everything on head counts as new.
    return [];
  }

  const scratch = mkdtempSync(join(tmpdir(), `audit-base-${templateId}-`));
  try {
    writeFileSync(join(scratch, 'package.json'), manifest);
    writeFileSync(join(scratch, 'package-lock.json'), lockfile);
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
 * production dependencies. npm audit exits non-zero when it finds anything,
 * so read stdout regardless of status.
 */
function audit(cwd) {
  const output = spawnSync(
    'npm',
    ['audit', '--omit=dev', '--package-lock-only', '--json', '--no-fund'],
    { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );

  let report;
  try {
    report = JSON.parse(output.stdout);
  } catch {
    throw new Error(`npm audit produced no JSON in ${cwd}:\n${output.stderr}`);
  }

  if (report.error) {
    throw new Error(`npm audit failed in ${cwd}: ${report.error.summary ?? report.error.code}`);
  }

  const findings = new Map();
  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via !== 'object' || !BLOCKING.has(via.severity)) {
        continue;
      }

      const advisory = via.url?.match(/GHSA-[\w-]+/)?.[0] ?? `npm-${via.source}`;
      const key = `${advisory} ${via.name}`;
      if (!findings.has(key)) {
        findings.set(key, {
          key,
          advisory,
          package: via.name,
          severity: via.severity,
          range: via.range,
          title: via.title,
          url: via.url,
        });
      }
    }
  }

  return [...findings.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function printSection(title, findings) {
  console.log(`\n${title}: ${findings.length}`);
  for (const finding of findings) {
    console.log(`  ${finding.severity.padEnd(8)} ${finding.package} ${finding.range ?? ''}  ${finding.advisory}  ${finding.title}`);
  }
}
