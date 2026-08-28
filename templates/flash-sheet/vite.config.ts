import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import flashDesigns from './src/data/flash.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'write-static-design-routes',
      async closeBundle() {
        await Promise.all(
          flashDesigns.map(async ({ id }) => {
            const routeDirectory = resolve('dist', 'flash', id);
            await mkdir(routeDirectory, { recursive: true });
            await copyFile(resolve('dist', 'index.html'), resolve(routeDirectory, 'index.html'));
          }),
        );
      },
    },
  ],
});
