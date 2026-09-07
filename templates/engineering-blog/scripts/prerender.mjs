import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const index = join(dist, 'index.html');

cpSync(index, join(dist, '404.html'));

const posts = readdirSync('content/posts').filter((file) => file.endsWith('.md'));

for (const file of posts) {
  const slug = file.replace(/\.md$/, '');
  const dir = join(dist, 'writing', slug);
  mkdirSync(dir, { recursive: true });
  cpSync(index, join(dir, 'index.html'));
}
