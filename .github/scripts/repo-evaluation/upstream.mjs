import { collectFacts, createClient } from './github.mjs';
import { evaluateRepository } from './rules.mjs';

// Shared by the Template gate (check-vendored.mjs) and the weekly upstream sync
// (upstream-sync.mjs): where a vendored template's source should point, and
// whether a pin is consistent and still passes the deployability rules.

export function createUpstreamClient(token = process.env.GITHUB_TOKEN) {
  return createClient(token);
}

// The newest release (track: releases) or branch head (track: branch).
export async function latestPin(source, client = createUpstreamClient()) {
  const { repository } = source;
  if (source.track === 'releases') {
    const releases = await client.json(`/repos/${repository}/releases?per_page=30`);
    const release = releases.find((candidate) => !candidate.draft && (source.prereleases || !candidate.prerelease));
    if (!release) {
      throw new Error(`${repository} has no ${source.prereleases ? 'published' : 'stable'} release`);
    }
    const commit = (await client.json(`/repos/${repository}/commits/${encodeURIComponent(release.tag_name)}`)).sha;
    return { ref: release.tag_name, commit, publishedAt: release.published_at, url: release.html_url };
  }
  const commit = (await client.json(`/repos/${repository}/commits/${encodeURIComponent(source.ref)}`)).sha;
  return { ref: source.ref, commit, publishedAt: null, url: `https://github.com/${repository}/commit/${commit}` };
}

// Problems with a pin: the ref doesn't match the commit, the license changed,
// or the rules no longer pass at the commit. An empty list means it's fine.
export async function checkPin(source, client = createUpstreamClient(), { evaluateAt = evaluate } = {}) {
  const problems = [];
  const { repository, ref, commit } = source;

  const repo = await client.json(`/repos/${repository}`);
  if (repo.archived) {
    problems.push(`${repository} is archived`);
  }
  if ((repo.license?.spdx_id ?? null) !== source.license) {
    problems.push(`GitHub reports the license as ${repo.license?.spdx_id ?? 'none'}, not ${source.license}`);
  }

  if (source.track === 'releases') {
    const release = await client.json(`/repos/${repository}/releases/tags/${encodeURIComponent(ref)}`).catch(() => null);
    if (!release || release.draft) {
      problems.push(`${ref} is not a published release of ${repository}`);
    } else if (release.prerelease && !source.prereleases) {
      problems.push(`${ref} is a prerelease; set "prereleases": true to follow prereleases`);
    }
    const tagged = await client.json(`/repos/${repository}/commits/${encodeURIComponent(ref)}`).catch(() => null);
    if (tagged && tagged.sha !== commit) {
      problems.push(`${ref} points at ${tagged.sha.slice(0, 7)}, not the pinned ${commit.slice(0, 7)}`);
    }
  } else {
    const comparison = await client
      .json(`/repos/${repository}/compare/${commit}...${encodeURIComponent(ref)}`)
      .catch(() => null);
    if (!comparison || !['identical', 'ahead'].includes(comparison.status)) {
      problems.push(`${commit.slice(0, 7)} is not on the ${ref} branch of ${repository}`);
    }
  }

  const evaluation = await evaluateAt(source);
  if (evaluation.verdict !== 'deployable') {
    const reasons = evaluation.findings
      .filter((finding) => finding.level !== 'pass')
      .map((finding) => finding.message)
      .slice(0, 5);
    problems.push(`the deployability rules say ${evaluation.verdict} at ${commit.slice(0, 7)}: ${reasons.join('; ')}`);
  }

  return { problems, evaluation };
}

export async function evaluate(source) {
  try {
    return evaluateRepository(await collectFacts(source.repository, { appDir: source.directory ?? null, ref: source.commit }));
  } catch (error) {
    return { verdict: 'error', findings: [{ level: 'fail', check: 'api', message: error.message }] };
  }
}
