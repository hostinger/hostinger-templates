import { graphql, Link } from 'gatsby';
import type { HeadProps, PageProps } from 'gatsby';

import { ArticleBody } from '../components/ArticleBody';
import { SeriesNav } from '../components/SeriesNav';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import siteData from '../data/site.json';
import { ThreadNode } from '../icons/ThreadNode';
import type { PostPageContext, PostQueryData, SiteContent } from '../types/content';
import { formatDate, machineDate } from '../utils/formatDate';
import { readingTimeLabel } from '../utils/readingTime';
import { seriesPartLabel } from '../utils/series';
import '../styles/global.css';

const site = siteData as SiteContent;

export default function PostPage({
  data,
  pageContext,
}: PageProps<PostQueryData, PostPageContext>) {
  const post = data.markdownRemark;
  const { seriesNav } = pageContext;
  const author = site.authors.find(
    (candidate) => candidate.name === post.frontmatter.author,
  );

  return (
    <div className="page">
      <a className="skip-link" href="#main-content">
        Skip to the article
      </a>
      <SiteHeader />
      <main id="main-content">
        <article className="article">
          <header className="article__header">
            <p className="article__back">
              <Link to="/#writing">← All writing</Link>
            </p>
            {seriesNav && (
              <p className="series-chip">
                <ThreadNode />
                <span>
                  {seriesNav.series} ·{' '}
                  {seriesPartLabel(seriesNav.part, seriesNav.totalParts)}
                </span>
              </p>
            )}
            <h1 className="article__title">{post.frontmatter.title}</h1>
            <p className="article__meta">
              <span className="article__author">{post.frontmatter.author}</span>
              {author && (
                <span className="article__role">{author.role}</span>
              )}
              <span className="article__dot" aria-hidden="true">
                ·
              </span>
              <time dateTime={machineDate(post.frontmatter.date)}>
                {formatDate(post.frontmatter.date)}
              </time>
              <span className="article__dot" aria-hidden="true">
                ·
              </span>
              <span>{readingTimeLabel(post.fields.readingMinutes)}</span>
            </p>
            <ul className="tag-list" aria-label="Tags">
              {post.frontmatter.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>
          </header>
          <ArticleBody html={post.html} />
          {seriesNav && <SeriesNav nav={seriesNav} />}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export const query = graphql`
  query PostById($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      excerpt(pruneLength: 160)
      fields {
        slug
        readingMinutes
        words
      }
      frontmatter {
        title
        date
        author
        tags
        series
        part
      }
    }
  }
`;

export const Head = ({ data }: HeadProps<PostQueryData>) => {
  const post = data.markdownRemark;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    datePublished: machineDate(post.frontmatter.date),
    author: { '@type': 'Person', name: post.frontmatter.author },
    wordCount: post.fields.words,
    keywords: post.frontmatter.tags.join(', '),
  };

  return (
    <>
      <html lang="en" />
      <title>{`${post.frontmatter.title} — ${site.name}`}</title>
      <meta name="description" content={post.excerpt} />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
    </>
  );
};
