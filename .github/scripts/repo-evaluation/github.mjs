// Collects the facts rules.mjs needs through the GitHub REST API. Nothing is
// cloned or executed, so untrusted repositories are safe to evaluate.

const API = process.env.GITHUB_API_URL ?? 'https://api.github.com';

export async function collectFacts(fullName, { appDir = null, ref = null, token = process.env.GITHUB_TOKEN } = {}) {
  const github = createClient(token);
  const repoData = await github.json(`/repos/${fullName}`);
  const commit = (await github.json(`/repos/${fullName}/commits/${encodeURIComponent(ref ?? repoData.default_branch)}`)).sha;
  const treeData = await github.json(`/repos/${fullName}/git/trees/${commit}?recursive=1`);
  const blobs = treeData.tree.filter((entry) => entry.type === 'blob');
  const tree = blobs.map((entry) => entry.path);
  const base = appDir ? `${appDir.replace(/\/$/, '')}/` : '';
  const sourceSizeKb = Math.round(blobs.filter((entry) => entry.path.startsWith(base)).reduce((sum, entry) => sum + (entry.size ?? 0), 0) / 1024);
  const read = (path) => (tree.includes(path) ? github.raw(fullName, commit, path) : Promise.resolve(null));
  const readJson = async (path) => {
    try {
      const text = await read(path);
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  const readFirst = (paths) => read(paths.find((path) => tree.includes(path)) ?? '');
  const manifestPath = [`${base}manifest.json`, `${base}public/manifest.json`].find((path) => tree.includes(path));

  const [packageJson, rootPackageJson, manifestJson, envExample, compose, prismaSchema, pnpmWorkspace] = await Promise.all([
    readJson(`${base}package.json`),
    base ? readJson('package.json') : null,
    manifestPath ? readJson(manifestPath) : null,
    readFirst([`${base}.env.example`, `${base}.env.sample`, `${base}.env.local.example`]),
    readFirst([`${base}docker-compose.yml`, `${base}docker-compose.yaml`, `${base}compose.yaml`, `${base}compose.yml`]),
    readFirst([`${base}prisma/schema.prisma`, 'prisma/schema.prisma']),
    read('pnpm-workspace.yaml'),
  ]);

  const lockfiles = [
    [`${base}package-lock.json`, 'npm'],
    [`${base}npm-shrinkwrap.json`, 'npm'],
    [`${base}yarn.lock`, 'yarn'],
    [`${base}pnpm-lock.yaml`, 'pnpm'],
    [`${base}bun.lockb`, 'bun'],
    [`${base}bun.lock`, 'bun'],
  ]
    .filter(([path]) => tree.includes(path))
    .map(([, manager]) => manager);

  return {
    repo: {
      fullName: repoData.full_name,
      archived: repoData.archived,
      fork: repoData.fork,
      pushedAt: repoData.pushed_at,
      stars: repoData.stargazers_count,
      license: repoData.license?.spdx_id ?? null,
      sizeKb: repoData.size,
      topics: repoData.topics ?? [],
      description: repoData.description ?? '',
      defaultBranch: repoData.default_branch,
    },
    commit,
    ref: ref ?? repoData.default_branch,
    appDir,
    tree,
    treeTruncated: treeData.truncated,
    sourceSizeKb: treeData.truncated ? null : sourceSizeKb,
    packageJson,
    manifestJson,
    lockfiles: [...new Set(lockfiles)],
    hasPnpmWorkspace: /^packages\s*:/m.test(pnpmWorkspace ?? ''),
    isPhpApp: tree.includes(`${base}composer.json`) && (tree.includes(`${base}artisan`) || tree.some((path) => path.startsWith(`${base}public/index.php`))),
    hasRootWorkspaces: Boolean(rootPackageJson?.workspaces),
    hasTurboOrNx: tree.includes('turbo.json') || tree.includes('nx.json') || tree.includes('lerna.json'),
    hasDeno: tree.includes(`${base}deno.json`) || tree.includes(`${base}deno.jsonc`),
    appCandidates: tree
      .filter((path) => /^(apps|packages|examples)\/[^/]+\/package\.json$/.test(path))
      .map((path) => path.replace(/\/package\.json$/, ''))
      .slice(0, 10),
    envExampleKeys: (envExample ?? '')
      .split('\n')
      .map((line) => line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=/)?.[1])
      .filter(Boolean),
    composeServices: [...(compose ?? '').matchAll(/^\s{2}([a-zA-Z0-9_-]+):\s*$/gm)].map((match) => match[1]),
    prismaProvider: prismaSchema?.match(/datasource\s+\w+\s*\{[^}]*provider\s*=\s*"([^"]+)"/)?.[1] ?? null,
  };
}

export async function searchRepositories(query, { limit = 20, token = process.env.GITHUB_TOKEN } = {}) {
  const github = createClient(token);
  const params = new URLSearchParams({ q: query, sort: 'stars', order: 'desc', per_page: String(Math.min(limit, 100)) });
  const { items } = await github.json(`/search/repositories?${params}`);
  return items.map((item) => item.full_name);
}

export function createClient(token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'hostinger-templates-repo-evaluation',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return {
    async json(path) {
      const response = await fetch(`${API}${path}`, { headers });
      if (!response.ok) {
        throw new Error(`GET ${path} returned ${response.status}: ${(await response.text()).slice(0, 200)}`);
      }
      return response.json();
    },
    async raw(fullName, ref, path) {
      const response = await fetch(`${API}/repos/${fullName}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${ref}`, {
        headers: { ...headers, Accept: 'application/vnd.github.raw+json' },
      });
      return response.ok ? response.text() : null;
    },
  };
}
