import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://relay.example',
  devToolbar: { enabled: false },
});
