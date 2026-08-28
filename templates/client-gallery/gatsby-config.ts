import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  siteMetadata: {
    title: 'Amelia & James — Client Gallery',
    description:
      'Private wedding delivery gallery. Star your favourite photographs and export the list for your photographer.',
    siteUrl: 'https://example.com',
  },
  graphqlTypegen: false,
};

export default config;
