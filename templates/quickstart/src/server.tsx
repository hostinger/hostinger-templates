import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { HomePage } from './components/HomePage.js';
import { NotFoundPage } from './components/NotFoundPage.js';
import { loadSiteContent } from './utils/content.js';

/**
 * The compiled server runs from `dist/`, the dev server from `src/`.
 * Both sit one level below the project root, so content and static assets
 * are resolved from there and the build needs no copy step.
 */
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');

const site = loadSiteContent(rootDir);

const app = new Hono();

/** Prefixes the doctype; hono/jsx renders (and escapes) the tree itself. */
function renderPage(node: { toString(): string }): string {
  return `<!doctype html>\n${node.toString()}`;
}

app.use('/styles/*', serveStatic({ root: publicDir }));
app.use('/js/*', serveStatic({ root: publicDir }));
app.get('/favicon.svg', serveStatic({ path: path.join(publicDir, 'favicon.svg') }));

app.get('/', (c) => c.html(renderPage(<HomePage site={site} />)));

app.notFound((c) => c.html(renderPage(<NotFoundPage site={site} />), 404));

app.onError((err, c) => {
  console.error(err);
  return c.text('Something went wrong on our side. Please try again.', 500);
});

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4376;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`${site.project.name} quickstart running at http://localhost:${info.port}`);
});
