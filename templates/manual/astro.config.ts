import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Set this to the public URL of your docs before deploying.
  site: 'https://manual.example.com',
  integrations: [
    starlight({
      title: 'Tapeline',
      description:
        'Tapeline captures every webhook that reaches your dev machine, lets you inspect the exact payload, and replays events against your app on demand.',
      logo: {
        light: './src/assets/wordmark-light.svg',
        dark: './src/assets/wordmark-dark.svg',
        replacesTitle: true,
        alt: 'Tapeline',
      },
      customCss: ['./src/styles/theme.css'],
      components: {
        // Adds the "Copy page as Markdown" action next to every page title.
        PageTitle: './src/components/PageTitle.astro',
      },
      sidebar: [
        { label: 'Start here', items: [{ autogenerate: { directory: 'start' } }] },
        { label: 'Guides', items: [{ autogenerate: { directory: 'guides' } }] },
        { label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
      ],
    }),
  ],
});
