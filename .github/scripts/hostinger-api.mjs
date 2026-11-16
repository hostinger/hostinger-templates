const DEFAULT_BASE_URL = 'https://developers.hostinger.com';

export function createHostingerApi({ token, baseUrl = DEFAULT_BASE_URL }) {
  async function api(method, path, body) {
    const response = await fetch(`${baseUrl}/api/hosting/v1/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
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

  async function resolveUsername(parentDomain) {
    const { data } = await api('GET', `websites?domain=${encodeURIComponent(parentDomain)}&per_page=100`);
    const parent = data.find((website) => website.domain === parentDomain && website.vhost_type !== 'subdomain');
    if (!parent?.username) {
      throw new Error(`The API token cannot see the ${parentDomain} website`);
    }
    return parent.username;
  }

  return { api, resolveUsername };
}
