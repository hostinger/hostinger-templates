import { appendFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const API_BASE_URL = process.env.HOSTINGER_API_BASE_URL ?? 'https://developers.hostinger.com';
const TOKEN = process.env.HOSTINGER_API_TOKEN;
const PARENT_DOMAIN = process.env.DEMO_PARENT_DOMAIN;
const ALLOWED = new Set(JSON.parse(process.env.TEMPLATES ?? '[]'));
const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DEFAULT_NODE_VERSION = 22;
const UPLOAD_CHUNK_BYTES = 10 * 1024 * 1024;
const SECOND = 1000;
const MINUTE = 60 * SECOND;

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
const username = await resolveUsername();

for (const demo of demos) {
  const domain = `${demo.id}.${PARENT_DOMAIN}`;
  const url = `https://${domain}`;
  console.log(`\n::group::${demo.id} (${demo.kind}) → ${url}`);
  try {
    if (!ID_PATTERN.test(demo.id) || !ALLOWED.has(demo.id)) {
      throw new Error(`"${demo.id}" was not selected for this run`);
    }
    await ensureSubdomain(demo.id, domain);
    await upload(domain, join(demo.dir, demo.archive), demo.archive);
    if (demo.kind === 'static') {
      await api('POST', `accounts/${username}/websites/${domain}/deploy`, {
        archive_path: demo.archive,
      });
    } else {
      await buildNodeApp(domain, demo);
    }
    await verifyLive(url, demo.title);
    results.push({ id: demo.id, url, ok: true });
    console.log(`Live: ${url}`);
  } catch (error) {
    results.push({ id: demo.id, url, ok: false, error: error.message });
    console.log(`::error title=${demo.id} deploy failed::${error.message}`);
  }
  console.log('::endgroup::');
}

for (const id of ALLOWED) {
  if (!demos.some((demo) => demo.id === id)) {
    results.push({ id, url: `https://${id}.${PARENT_DOMAIN}`, ok: false, error: 'No build artifact (build failed?)' });
  }
}

writeSummary(results);

if (results.some((result) => !result.ok)) {
  process.exit(1);
}

async function resolveUsername() {
  const { data } = await api(
    'GET',
    `websites?domain=${encodeURIComponent(PARENT_DOMAIN)}&per_page=100`,
  );
  const parent = data.find(
    (website) => website.domain === PARENT_DOMAIN && website.vhost_type !== 'subdomain',
  );
  if (!parent?.username) {
    throw new Error(`The API token cannot see the ${PARENT_DOMAIN} website`);
  }
  return parent.username;
}

async function ensureSubdomain(id, domain) {
  const path = `accounts/${username}/websites/${PARENT_DOMAIN}/subdomains`;
  const exists = async () => (await api('GET', path)).some((sub) => sub.domain === domain);

  if (await exists()) {
    console.log(`Subdomain ${domain} already exists`);
    return;
  }

  console.log(`Creating subdomain ${domain}`);
  await api('POST', path, { subdomain: id, directory: id });
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

async function buildNodeApp(domain, demo) {
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

  const finished = await waitFor(`build ${build.uuid}`, 20 * MINUTE, 15 * SECOND, async () => {
    const current = await api('GET', `${base}/${build.uuid}`);
    return ['completed', 'failed'].includes(current.state) ? current : null;
  });

  if (finished.state !== 'completed') {
    const { logs } = await api('GET', `${base}/${build.uuid}/logs?from_line=0`).catch(() => ({}));
    console.log((logs ?? '').split('\n').slice(-80).join('\n'));
    throw new Error(`Node.js build ${build.uuid} ${finished.state}`);
  }
}

function catalogBuildSettings(deploy = {}) {
  const mapping = {
    appType: 'app_type',
    buildCommand: 'build_script',
    outputDirectory: 'output_directory',
    entryFile: 'entry_file',
  };
  return Object.fromEntries(
    Object.entries(mapping)
      .filter(([key]) => deploy[key])
      .map(([key, field]) => [field, deploy[key]]),
  );
}

async function verifyLive(url, title) {
  await waitFor(url, 15 * MINUTE, 20 * SECOND, async () => {
    const response = await fetch(url, { redirect: 'follow' }).catch(() => null);
    if (response?.status !== 200) {
      return false;
    }
    const body = await response.text();
    return title ? body.includes(title) : body.length > 50;
  });
}

async function api(method, path, body) {
  const response = await fetch(`${API_BASE_URL}/api/hosting/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${path} returned ${response.status}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
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
