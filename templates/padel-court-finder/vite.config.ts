import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import clubs from './src/data/clubs.json' with { type: 'json' };
import { STATIC_ROUTES, clubPath } from './src/constants/routes';

const prerenderedRoutes = [...STATIC_ROUTES, ...clubs.map(({ id }) => clubPath(id))];

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'write-static-route-indexes',
      apply: 'build',
      async closeBundle() {
        await Promise.all(
          prerenderedRoutes.map(async (route) => {
            const routeDirectory = resolve('dist', `.${route}`);
            await mkdir(routeDirectory, { recursive: true });
            await copyFile(resolve('dist', 'index.html'), resolve(routeDirectory, 'index.html'));
          }),
        );
      },
    },
  ],
});
