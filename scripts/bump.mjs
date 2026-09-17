#!/usr/bin/env node
/**
 * Bump a catalog package across standalone templates.
 *
 *   node scripts/bump.mjs nuxt 4.5.1
 *   node scripts/bump.mjs nuxt            # apply catalog version
 *   node scripts/bump.mjs nuxt 4.5.1 --dry-run
 *   node scripts/bump.mjs nuxt 4.5.1 --major
 *
 * Templates stay standalone (own package.json + lockfile). Different majors
 * are skipped unless --major. Then run `npm install` in each changed dir.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = join(root, 'versions', 'catalog.json')
const templatesDir = join(root, 'templates')
const args = process.argv.slice(2).filter((arg) => arg !== '--')
const dryRun = args.includes('--dry-run')
const allowMajor = args.includes('--major')
const skipInstall = args.includes('--no-install')
const positional = args.filter((arg) => !arg.startsWith('--'))
const [packageName, requestedVersion] = positional

if (!packageName) {
  console.error('Usage: node scripts/bump.mjs <package> [version] [--dry-run] [--major] [--no-install]')
  process.exit(1)
}

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
const packages = catalog.packages ?? {}

function parseSpec(spec) {
  const match = String(spec)
    .trim()
    .match(/^(~|\^|>=|<=|>|<|=)?\s*v?(\d+)\.(\d+)\.(\d+)/)
  if (!match) {
    return null
  }

  return {
    prefix: match[1] ?? '',
    major: Number(match[2]),
    minor: Number(match[3]),
    patch: Number(match[4]),
    bare: `${match[2]}.${match[3]}.${match[4]}`,
  }
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

const currentEntry = packages[packageName] ?? {}
const targetSpec = requestedVersion
  ? requestedVersion.startsWith('^') || requestedVersion.startsWith('~')
    ? requestedVersion
    : `^${requestedVersion}`
  : currentEntry.version

if (!targetSpec) {
  console.error(`No version given and ${packageName} is not in versions/catalog.json`)
  process.exit(1)
}

const target = parseSpec(targetSpec)
if (!target) {
  console.error(`Cannot parse version: ${targetSpec}`)
  process.exit(1)
}

const nextEntry = {
  ...currentEntry,
  version: targetSpec,
}
packages[packageName] = nextEntry
catalog.packages = packages

if (!dryRun) {
  writeJson(catalogPath, catalog)
}

const templateIds = readdirSync(templatesDir).filter((id) =>
  existsSync(join(templatesDir, id, 'package.json')),
)

const changed = []
const skipped = []

for (const id of templateIds) {
  const pkgPath = join(templatesDir, id, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const sections = ['dependencies', 'devDependencies']
  const section = sections.find((key) => pkg[key]?.[packageName])

  if (!section) {
    continue
  }

  const currentSpec = pkg[section][packageName]
  const current = parseSpec(currentSpec)

  if (!current) {
    skipped.push({ id, reason: `unparseable spec ${currentSpec}` })
    continue
  }

  if (current.major !== target.major && !allowMajor) {
    skipped.push({ id, reason: `major ${current.major} → ${target.major} (pass --major)` })
    continue
  }

  const already = currentSpec === targetSpec && (!nextEntry.engines || pkg.engines?.node === nextEntry.engines)
  if (already) {
    skipped.push({ id, reason: `already ${targetSpec}` })
    continue
  }

  pkg[section][packageName] = targetSpec
  if (nextEntry.engines) {
    pkg.engines = { ...pkg.engines, node: nextEntry.engines }
  }

  if (!dryRun) {
    writeJson(pkgPath, pkg)
  }

  changed.push(id)
}

for (const id of changed) {
  if (dryRun || skipInstall) {
    continue
  }

  console.log(`npm install in templates/${id}`)
  execFileSync('npm', ['install'], {
    cwd: join(templatesDir, id),
    stdio: 'inherit',
  })
}

console.log(
  JSON.stringify(
    {
      package: packageName,
      version: targetSpec,
      dryRun,
      changed,
      skipped,
    },
    null,
    2,
  ),
)
