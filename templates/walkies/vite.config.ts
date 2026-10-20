import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { STATIC_ROUTE_PATHS } from './src/constants/routes.ts';

export default defineConfig({
  plugins: [
    react(),
    {
      // Static hosts serve a real file for /areas and /book, so direct visits and reloads work without rewrites.
      name: 'write-static-route-pages',
      async closeBundle() {
        await Promise.all(
          STATIC_ROUTE_PATHS.map(async (routePath) => {
            const routeDirectory = resolve('dist', routePath.replace(/^\//, ''));
            await mkdir(routeDirectory, { recursive: true });
            await copyFile(resolve('dist', 'index.html'), resolve(routeDirectory, 'index.html'));
          }),
        );
      },
    },
  ],
});
