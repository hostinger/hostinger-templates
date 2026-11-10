import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHostingerApi } from './hostinger-api.mjs';
import { smoke } from './hostinger-smoke.mjs';

const TOKEN = process.env.HOSTINGER_API_TOKEN;
const PARENT_DOMAIN = process.env.DEMO_PARENT_DOMAIN;
const SUBDOMAIN_PREFIX = process.env.DEMO_SUBDOMAIN_PREFIX ?? '';
const ALLOWED = new Set(JSON.parse(process.env.TEMPLATES ?? '[]'));
const RESULTS_FILE = process.env.RESULTS_FILE;
const SMOKE_BASIC_AUTH = process.env.SMOKE_BASIC_AUTH || null;
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DEFAULT_NODE_VERSION = 22;
const UPLOAD_CHUNK_BYTES = 10 * 1024 * 1024;
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const BUILD_TIMEOUT = Number(process.env.BUILD_TIMEOUT_MINUTES ?? 20) * MINUTE;
const FIRST_ANSWER_TIMEOUT = Number(process.env.SMOKE_FIRST_ANSWER_MINUTES ?? 15) * MINUTE;
const SUBDOMAIN_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const demosDir = resolve(process.argv[2] ?? '');

if (!process.argv[2] || !TOKEN || !PARENT_DOMAIN) {
  console.error(
    'Usage: HOSTINGER_API_TOKEN=… DEMO_PARENT_DOMAIN=… TEMPLATES=[…] deploy-demos.mjs <demos-dir>',
  );
  process.exit(1);
}

const demos = readdirSync(demosDir)
  .filter((id) => existsSync(join(demosDir, id, 'meta.json')))
  .sort()
  .map((id) => ({
    dir: join(demosDir, id),
    ...JSON.parse(readFileSync(join(demosDir, id, 'meta.json'), 'utf8')),
  }));

const results = [];
const { api, resolveUsername } = createHostingerApi({
  token: TOKEN,
  baseUrl: process.env.HOSTINGER_API_BASE_URL,
});
const username = await resolveUsername(PARENT_DOMAIN);

for (const demo of demos) {
  const subdomain = `${SUBDOMAIN_PREFIX}${demo.id}`;
  const domain = `${subdomain}.${PARENT_DOMAIN}`;
  const url = `https://${domain}`;
  const started = Date.now();
  const result = { id: demo.id, url, ok: false, kind: demo.kind };
  console.log(`\n::group::${demo.id} (${demo.kind}) → ${url}`);
  try {
    if (!ID_PATTERN.test(demo.id) || !ALLOWED.has(demo.id)) {
      throw new Error(`"${demo.id}" was not selected for this run`);
    }
    if (!SUBDOMAIN_PATTERN.test(subdomain) || subdomain.length > 63) {
      throw new Error(`"${subdomain}" is not a valid subdomain label`);
    }
    await ensureSubdomain(subdomain, domain);
    await upload(domain, join(demo.dir, demo.archive), demo.archive);
    if (demo.kind === 'static') {
      await api('POST', `accounts/${username}/websites/${domain}/deploy`, {
        archive_path: demo.archive,
      });
    } else {
      await buildNodeApp(domain, demo, result);
    }
    result.buildSeconds = Math.round((Date.now() - started) / SECOND);
    result.smoke = await smoke({
      url,
      routes: demo.routes ?? ['/'],
      title: demo.title,
      isServer: demo.kind === 'node',
      auth: SMOKE_BASIC_AUTH,
      firstAnswerTimeoutMs: FIRST_ANSWER_TIMEOUT,
    });
    if (!result.smoke.ok) {
      throw new Error(`Smoke check failed: ${describeSmoke(result.smoke)}`);
    }
    result.ok = true;
    console.log(`Live: ${url}`);
  } catch (error) {
    result.error = error.message;
    console.log(`::error title=${demo.id} deploy failed::${error.message}`);
  }
  results.push(result);
  console.log('::endgroup::');
}

for (const id of ALLOWED) {
  if (!demos.some((demo) => demo.id === id)) {
    results.push({
      id,
      url: `https://${SUBDOMAIN_PREFIX}${id}.${PARENT_DOMAIN}`,
      ok: false,
      error: 'No build artifact (build failed?)',
    });
  }
}

writeSummary(results);
if (RESULTS_FILE) {
  writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

if (results.some((result) => !result.ok)) {
  process.exit(1);
}

async function ensureSubdomain(subdomain, domain) {
  const path = `accounts/${username}/websites/${PARENT_DOMAIN}/subdomains`;
  const exists = async () => (await api('GET', path)).some((sub) => sub.domain === domain);

  if (await exists()) {
    console.log(`Subdomain ${domain} already exists`);
    return;
  }

  console.log(`Creating subdomain ${domain}`);
  await api('POST', path, { subdomain, directory: subdomain });
  await waitFor(`subdomain ${domain}`, 5 * MINUTE, 10 * SECOND, exists);
}

async function upload(domain, file, name) {
  const credentials = await retry(`upload credentials for ${domain}`, 4, 15 * SECOND, () =>
    api('POST', 'files/upload-urls', { username, domain }),
  );
  const target = `${credentials.url.replace(/\/$/, '')}/${name}?override=true`;
  const auth = {
    'X-Auth': credentials.auth_key,
    'X-Auth-Rest': credentials.rest_auth_key,
  };
  const data = readFileSync(file);

  const create = await fetch(target, {
    method: 'POST',
    headers: { ...auth, 'upload-length': String(data.length), 'upload-offset': '0' },
  });
  if (create.status !== 201) {
    throw new Error(`Upload create returned ${create.status}: ${await create.text()}`);
  }

  let offset = 0;
  while (offset < data.length) {
    const chunk = data.subarray(offset, offset + UPLOAD_CHUNK_BYTES);
    const response = await fetch(target, {
      method: 'PATCH',
      headers: {
        ...auth,
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': String(offset),
        'Content-Type': 'application/offset+octet-stream',
      },
      body: chunk,
    });
    if (response.status !== 204) {
      throw new Error(`Upload chunk at ${offset} returned ${response.status}: ${await response.text()}`);
    }
    offset = Number(response.headers.get('upload-offset') ?? offset + chunk.length);
  }
  console.log(`Uploaded ${name} (${data.length} bytes)`);
}

async function buildNodeApp(domain, demo, result) {
  const base = `accounts/${username}/websites/${domain}/nodejs/builds`;
  const { available_scripts: _scripts, ...detected } = await api(
    'GET',
    `${base}/settings/from-archive?archive_path=${encodeURIComponent(demo.archive)}`,
  );
  const settings = {
    ...detected,
    node_version: detected.node_version ?? DEFAULT_NODE_VERSION,
    ...catalogBuildSettings(demo.deploy),
  };
  console.log(`Build settings: ${JSON.stringify(settings)}`);

  const build = await api('POST', base, {
    ...settings,
    source_type: 'archive',
    source_options: { archive_path: demo.archive },
  });

  const finished = await waitFor(`build ${build.uuid}`, BUILD_TIMEOUT, 15 * SECOND, async () => {
    const current = await api('GET', `${base}/${build.uuid}`);
    return ['completed', 'failed'].includes(current.state) ? current : null;
  });

  if (finished.state !== 'completed') {
    const { logs } = await api('GET', `${base}/${build.uuid}/logs?from_line=0`).catch(() => ({}));
    const analysis = await api('GET', `${base}/${build.uuid}/analysis`).catch(() => null);
    result.buildLogTail = (logs ?? '').split('\n').slice(-80).join('\n');
    result.buildAnalysis = analysis ? { analysis: analysis.analysis, solution: analysis.solution } : null;
    console.log(result.buildLogTail);
    throw new Error(`Node.js build ${build.uuid} ${finished.state}`);
  }
}

function catalogBuildSettings(deploy = {}) {
  const mapping = {
    appType: 'app_type',
    buildCommand: 'build_script',
    outputDirectory: 'output_directory',
    entryFile: 'entry_file',
    nodeVersion: 'node_version',
  };
  return Object.fromEntries(
    Object.entries(mapping)
      .filter(([key]) => deploy[key])
      .map(([key, field]) => [field, deploy[key]]),
  );
}

function describeSmoke(result) {
  const failures = [
    ...result.routes.filter((route) => !route.ok).map((route) => `${route.path} ${route.detail}`),
    ...(result.asset && !result.asset.ok ? [`asset ${result.asset.url} ${result.asset.detail}`] : []),
    ...(result.burst && !result.burst.ok ? [result.burst.detail] : []),
  ];
  return failures.join('; ');
}

async function waitFor(label, timeout, interval, check) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const result = await check();
    if (result) {
      return result;
    }
    await sleep(interval);
  }
  throw new Error(`Timed out after ${timeout / MINUTE} min waiting for ${label}`);
}

async function retry(label, attempts, delay, action) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      if (attempt >= attempts) {
        throw error;
      }
      console.log(`${label} failed (attempt ${attempt}/${attempts}): ${error.message}`);
      await sleep(delay);
    }
  }
}

function sleep(ms) {
  return new Promise((done) => setTimeout(done, ms));
}

function writeSummary(rows) {
  const lines = [
    '## Template demo deploys',
    '',
    '| Template | Demo | Result |',
    '| --- | --- | --- |',
    ...rows.map(
      (row) =>
        `| \`${row.id}\` | ${row.url} | ${row.ok ? '✅ live' : `❌ ${row.error.replace(/\|/g, '\\|')}`} |`,
    ),
    '',
  ];
  console.log(`\n${lines.join('\n')}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'));
  }
}
