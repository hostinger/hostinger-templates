import { appendFileSync } from 'node:fs';
import { createHostingerApi } from './hostinger-api.mjs';

// Deletes PR preview subdomains (pr-<PR>-<id>) from the preview account.
// With CLOSED_PR it deletes that PR's previews. Without it, it deletes the
// previews of PRs that are closed or haven't been updated for 14 days. The
// subdomain list has no creation date, so the PR's activity stands in for it.

const STALE_AFTER_MS = 14 * 24 * 60 * 60 * 1000;
const PREVIEW_PATTERN = /^pr-(\d+)-[a-z0-9]+(-[a-z0-9]+)*$/;

const { HOSTINGER_API_TOKEN, DEMO_PARENT_DOMAIN, GITHUB_TOKEN, GITHUB_REPOSITORY, CLOSED_PR } = process.env;
if (!HOSTINGER_API_TOKEN || !DEMO_PARENT_DOMAIN) {
  console.error('HOSTINGER_API_TOKEN and DEMO_PARENT_DOMAIN are required');
  process.exit(1);
}

const { api, resolveUsername } = createHostingerApi({
  token: HOSTINGER_API_TOKEN,
  baseUrl: process.env.HOSTINGER_API_BASE_URL,
});
const username = await resolveUsername(DEMO_PARENT_DOMAIN);
const path = `accounts/${username}/websites/${DEMO_PARENT_DOMAIN}/subdomains`;

const previews = (await api('GET', path))
  .map((sub) => ({ label: sub.subdomain ?? sub.domain?.split('.')[0], domain: sub.domain }))
  .map((sub) => ({ ...sub, pr: Number(sub.label?.match(PREVIEW_PATTERN)?.[1]) }))
  .filter((sub) => sub.pr);

const prs = [...new Set(previews.map((sub) => sub.pr))];
const deletable = new Map();
for (const pr of prs) {
  if (CLOSED_PR) {
    deletable.set(pr, pr === Number(CLOSED_PR) ? 'PR closed' : null);
    continue;
  }
  deletable.set(pr, await staleReason(pr));
}

const deleted = [];
const failed = [];
for (const sub of previews) {
  const reason = deletable.get(sub.pr);
  if (!reason) {
    continue;
  }
  try {
    await api('DELETE', `${path}/${encodeURIComponent(sub.label)}`);
    deleted.push(`${sub.domain} (${reason})`);
  } catch (error) {
    failed.push(`${sub.domain}: ${error.message}`);
  }
}

const summary = [
  '## PR preview cleanup',
  '',
  `${previews.length} preview(s) found, ${deleted.length} deleted.`,
  ...deleted.map((line) => `- deleted ${line}`),
  ...failed.map((line) => `- ❌ ${line}`),
  '',
].join('\n');
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
if (failed.length) {
  process.exit(1);
}

async function staleReason(pr) {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/${pr}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
  });
  if (response.status === 404) {
    return 'PR not found';
  }
  if (!response.ok) {
    throw new Error(`GET pulls/${pr} returned ${response.status}`);
  }
  const pull = await response.json();
  if (pull.state !== 'open') {
    return 'PR closed';
  }
  if (Date.now() - Date.parse(pull.updated_at) > STALE_AFTER_MS) {
    return 'no PR activity for 14 days';
  }
  return null;
}
