// Checks a template deployed on Hostinger the way a visitor would hit it.
// Every route must answer 2xx without redirects, the page title must match,
// one same-origin asset must load, and server apps must survive a burst.

const SECOND = 1000;
const COLD_START_TIMEOUT_MS = 3 * 60 * SECOND;
const REQUEST_TIMEOUT_MS = 20 * SECOND;
const BURST_REQUESTS = 10;
const BURST_SETTLE_MS = 30 * SECOND;

export async function smoke({
  url,
  routes = ['/'],
  title = null,
  isServer = false,
  auth = null,
  firstAnswerTimeoutMs = COLD_START_TIMEOUT_MS,
}) {
  const base = url.replace(/\/$/, '');
  const headers = auth ? { Authorization: `Basic ${Buffer.from(auth).toString('base64')}` } : {};
  const paths = routes.length ? routes : ['/'];

  const first = await waitForFirstAnswer(`${base}${paths[0]}`, headers, firstAnswerTimeoutMs);
  if (!first.ok) {
    return { ok: false, routes: [{ path: paths[0], ...first }], asset: null, burst: null };
  }

  const routeResults = [{ path: paths[0], ...first }];
  for (const path of paths.slice(1)) {
    routeResults.push({ path, ...(await checkPage(`${base}${path}`, headers)) });
  }

  for (const result of routeResults) {
    if (result.ok && title && result.title !== title) {
      result.ok = false;
      result.detail = `title is ${JSON.stringify(result.title)}, expected ${JSON.stringify(title)}`;
    }
    if (result.ok && !title && !result.title) {
      result.ok = false;
      result.detail = 'page has no <title>';
    }
  }

  const asset = await checkAsset(base, first.body, headers);

  let burst = null;
  if (isServer) {
    burst = await checkBurst(base, paths, headers);
  }

  const ok = routeResults.every((result) => result.ok) && asset.ok && (burst?.ok ?? true);
  return { ok, routes: routeResults.map(({ body: _body, ...result }) => result), asset, burst };
}

async function waitForFirstAnswer(url, headers, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let delay = 5 * SECOND;
  let last;
  while (Date.now() < deadline) {
    last = await checkPage(url, headers);
    if (last.ok || (last.status && last.status >= 300 && last.status < 500 && last.status !== 404)) {
      return last;
    }
    await sleep(delay);
    delay = Math.min(delay * 2, 30 * SECOND);
  }
  return last;
}

async function checkPage(url, headers) {
  const started = Date.now();
  try {
    const response = await fetch(url, { headers, redirect: 'manual', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    const body = await response.text();
    const ms = Date.now() - started;
    if (response.status < 200 || response.status >= 300) {
      const location = response.headers.get('location');
      return {
        ok: false,
        status: response.status,
        ms,
        detail: location ? `redirects to ${location}` : `HTTP ${response.status}`,
      };
    }
    return { ok: true, status: response.status, ms, title: readTitle(body), body, detail: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, status: null, ms: Date.now() - started, detail: error.message };
  }
}

async function checkAsset(base, html, headers) {
  const origin = new URL(base).origin;
  const candidates = [
    ...html.matchAll(/<script[^>]+src="([^"]+)"/gi),
    ...html.matchAll(/<link[^>]+rel="(?:stylesheet|modulepreload)"[^>]*href="([^"]+)"/gi),
    ...html.matchAll(/<link[^>]+href="([^"]+)"[^>]*rel="(?:stylesheet|modulepreload)"/gi),
  ].map((match) => match[1]);

  const asset = candidates
    .map((src) => {
      try {
        return new URL(src, `${base}/`);
      } catch {
        return null;
      }
    })
    .find((candidate) => candidate && candidate.origin === origin);

  if (!asset) {
    return { ok: true, url: null, detail: 'no same-origin script or stylesheet on the page' };
  }

  const result = await checkPage(asset.href, headers);
  return { ok: result.ok, url: asset.pathname, detail: result.detail };
}

async function checkBurst(base, paths, headers) {
  const urls = Array.from({ length: BURST_REQUESTS }, (_, index) => `${base}${paths[index % paths.length]}`);
  const burst = await Promise.all(urls.map((url) => checkPage(url, headers)));
  const burstFailures = burst.filter((result) => !result.ok).length;

  await sleep(BURST_SETTLE_MS);

  const after = [];
  for (const path of paths) {
    after.push({ path, ...(await checkPage(`${base}${path}`, headers)) });
  }
  const afterFailures = after.filter((result) => !result.ok);

  return {
    ok: burstFailures === 0 && afterFailures.length === 0,
    detail:
      burstFailures || afterFailures.length
        ? `${burstFailures}/${BURST_REQUESTS} burst requests failed; after 30 s: ${
            afterFailures.map((result) => `${result.path} ${result.detail}`).join(', ') || 'all routes answer'
          }`
        : `${BURST_REQUESTS} requests answered and every route still answers 30 s later`,
  };
}

function readTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function sleep(ms) {
  return new Promise((done) => setTimeout(done, ms));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [url, ...rest] = process.argv.slice(2);
  if (!url) {
    console.error('Usage: hostinger-smoke.mjs <url> [--routes / /about] [--title "Title"] [--server]');
    process.exit(1);
  }
  const routesIndex = rest.indexOf('--routes');
  const titleIndex = rest.indexOf('--title');
  const routes = routesIndex === -1 ? ['/'] : rest.slice(routesIndex + 1).filter((arg) => arg.startsWith('/'));
  const result = await smoke({
    url,
    routes,
    title: titleIndex === -1 ? null : rest[titleIndex + 1],
    isServer: rest.includes('--server'),
    auth: process.env.SMOKE_BASIC_AUTH || null,
  });
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}
