import type { GatsbyConfig } from 'gatsby';

import site from './src/data/site.json';

const config: GatsbyConfig = {
  jsxRuntime: 'automatic',
  siteMetadata: {
    title: site.name,
    description: site.description,
    siteUrl: site.siteUrl,
  },
  graphqlTypegen: false,
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              noInlineHighlight: true,
            },
          },
        ],
      },
    },
  ],
};

export default config;
