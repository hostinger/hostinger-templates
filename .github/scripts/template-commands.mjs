import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The commands the Template gate runs for one template. Our own templates
// follow a fixed contract: package-lock.json, and lint, build and preview
// scripts. Vendored templates (templates.json entries with a source) are
// upstream code we don't edit, so they get these exceptions and no others:
//   install  by whichever lockfile upstream ships (npm, or pnpm through
//            corepack, which honours packageManager); check-vendored.mjs
//            refuses a copy with neither, since audit-regression.mjs can
//            audit only these two
//   lint     skipped with a notice when there is no lint script
//   preview  without a preview script: static output is served as files,
//            a Next.js app runs its start script
//   audit    see auditPolicy
//
//   template-commands.mjs <install|lint|build> <template-dir>

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const STATIC_OUTPUT_FALLBACKS = ['dist', 'build', 'out'];
const LOCKFILES = [
  ['package-lock.json', 'npm'],
  ['pnpm-lock.yaml', 'pnpm'],
];

export function catalogEntry(templateDir, catalogFile = join(scriptsDir, '..', '..', 'templates.json')) {
  const id = basename(resolve(templateDir));
  const catalog = JSON.parse(readFileSync(catalogFile, 'utf8'));
  return catalog.templates.find((template) => template.id === id) ?? null;
}

export function isVendored(entry) {
  return Boolean(entry?.source);
}

export function readPackage(templateDir) {
  return JSON.parse(readFileSync(join(templateDir, 'package.json'), 'utf8'));
}

// Our templates always install with npm ci, so a missing package-lock.json
// fails there as before.
export function packageManager(templateDir, entry) {
  if (!isVendored(entry)) {
    return 'npm';
  }
  const found = LOCKFILES.find(([file]) => existsSync(join(templateDir, file)));
  if (!found) {
    throw new Error(`${basename(templateDir)} has no package-lock.json or pnpm-lock.yaml`);
  }
  return found[1];
}

// [command, args] that runs the package manager.
export function packageManagerCommand(pm, args) {
  return pm === 'npm' ? ['npm', args] : ['corepack', [pm, ...args]];
}

export function installArgs(pm) {
  return pm === 'npm' ? ['ci'] : ['install', '--frozen-lockfile'];
}

// Where a build left a static site, or null for a server app. Shared with
// package-demo.mjs, which deploys the same directory.
export function staticOutputDir(templateDir, deploy = {}) {
  if (deploy.entryFile) {
    return null;
  }
  return (
    [deploy.outputDirectory, ...STATIC_OUTPUT_FALLBACKS]
      .filter(Boolean)
      .map((dir) => join(templateDir, dir))
      .find((dir) => existsSync(join(dir, 'index.html'))) ?? null
  );
}

// Flags that make a preview server listen where the health check looks.
// npm needs "--" before them; pnpm passes everything after the script name on,
// "--" included, which some CLIs would read as the end of their options.
export function previewArgs(script, port, pm = 'npm') {
  let args = [];
  if (/\bserve\b/.test(script)) {
    args = ['-l', `tcp://127.0.0.1:${port}`];
  } else if (/\bnuxt preview\b/.test(script)) {
    args = ['--port', String(port)];
  } else if (/\bvite preview\b/.test(script) || /\bastro preview\b/.test(script)) {
    args = ['--host', '127.0.0.1', '--port', String(port)];
  }
  if (!args.length) {
    return [];
  }
  return pm === 'pnpm' ? args : ['--', ...args];
}

function dependsOn(pkg, name) {
  return Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
}

// How the health check starts the template: { command, args, how } or
// { error }.
export function previewPlan({ templateDir, pkg, entry, pm, port }) {
  const script = pkg.scripts?.preview;
  if (script) {
    const [command, args] = packageManagerCommand(pm, ['run', 'preview', ...previewArgs(script, port, pm)]);
    return { command, args, how: `${pm} run preview` };
  }
  if (!isVendored(entry)) {
    return { error: 'package.json is missing a preview script' };
  }
  const staticDir = staticOutputDir(templateDir, entry.deploy);
  if (staticDir) {
    return {
      command: 'npx',
      args: ['--yes', 'serve@14', '-s', staticDir, '-l', `tcp://127.0.0.1:${port}`],
      how: `serve ${staticDir}`,
    };
  }
  if (dependsOn(pkg, 'next') && pkg.scripts?.start) {
    const [command, args] = packageManagerCommand(pm, ['run', 'start']);
    return { command, args, how: `${pm} run start (Next.js)` };
  }
  return { error: 'vendored template has no preview script, no static build output and is not a Next.js app with a start script' };
}

// Audit policy:
//   regression     our templates fail only on high/critical production
//                  advisories the base commit did not have
//   static-warn    a vendored template that deploys as static files: its
//                  dependencies run only at build time, so advisories are
//                  warnings
//   server-strict  a vendored template that runs as a server fails on any
//                  high/critical production advisory, old or new, because we
//                  can't patch it and must re-pin or drop it
export function auditPolicy(templateDir, entry) {
  if (!isVendored(entry)) {
    return 'regression';
  }
  return staticOutputDir(templateDir, entry.deploy) ? 'static-warn' : 'server-strict';
}

// Corepack must not stop at an interactive download prompt in CI.
export function commandEnv(extra = {}) {
  return { ...process.env, COREPACK_ENABLE_DOWNLOAD_PROMPT: '0', ...extra };
}

function run(command, args, cwd) {
  console.log(`$ ${[command, ...args].join(' ')}`);
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: commandEnv() });
  if (result.error) {
    throw result.error;
  }
  return result.status ?? 1;
}

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

function main() {
  const [step, dir] = process.argv.slice(2);
  if (!['install', 'lint', 'build'].includes(step) || !dir) {
    console.error('Usage: template-commands.mjs <install|lint|build> <template-dir>');
    process.exit(1);
  }
  const templateDir = resolve(dir);
  const entry = catalogEntry(templateDir);
  const pm = packageManager(templateDir, entry);

  if (step === 'install') {
    const [command, args] = packageManagerCommand(pm, installArgs(pm));
    process.exit(run(command, args, templateDir));
  }
  if (step === 'lint' && isVendored(entry) && !readPackage(templateDir).scripts?.lint) {
    console.log(`::notice::${basename(templateDir)} is vendored and upstream has no lint script; lint skipped.`);
    output('skipped', 'true');
    return;
  }
  const [command, args] = packageManagerCommand(pm, ['run', step]);
  process.exit(run(command, args, templateDir));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.log(`::error::${error.message}`);
    process.exit(1);
  }
}
