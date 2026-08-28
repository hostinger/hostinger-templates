import type { GatsbyNode } from 'gatsby';

import { postPath } from './src/utils/paths';
import { readingTimeFromMarkdown } from './src/utils/readingTime';
import { resolveSeriesNav, type SeriesPost } from './src/utils/series';

type CreatePagesQuery = {
  allMarkdownRemark: {
    nodes: Array<{
      id: string;
      fields: { slug: string };
      frontmatter: {
        title: string;
        series: string | null;
        part: number | null;
      };
    }>;
  };
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({
  node,
  getNode,
  actions,
}) => {
  if (node.internal.type !== 'MarkdownRemark') return;

  const parent = node.parent ? getNode(node.parent) : undefined;
  const slug = typeof parent?.name === 'string' ? parent.name : node.id;
  const body =
    typeof node.rawMarkdownBody === 'string' ? node.rawMarkdownBody : '';
  const stats = readingTimeFromMarkdown(body);

  actions.createNodeField({ node, name: 'slug', value: slug });
  actions.createNodeField({ node, name: 'readingMinutes', value: stats.minutes });
  actions.createNodeField({ node, name: 'words', value: stats.words });
};

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const result = await graphql<CreatePagesQuery>(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
            series
            part
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild('Failed to load markdown posts for page creation.');
    return;
  }

  const posts: Array<SeriesPost & { id: string }> =
    result.data.allMarkdownRemark.nodes.map((node) => ({
      id: node.id,
      path: postPath(node.fields.slug),
      title: node.frontmatter.title,
      series: node.frontmatter.series ?? null,
      part: node.frontmatter.part ?? null,
    }));

  posts.forEach((post) => {
    actions.createPage({
      path: post.path,
      component: `${__dirname}/src/templates/post.tsx`,
      context: {
        id: post.id,
        seriesNav: resolveSeriesNav(posts, post.path),
      },
    });
  });
};
