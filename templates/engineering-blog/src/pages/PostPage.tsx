import { Link, useParams } from 'react-router-dom';

import { ArticleBody } from '../components/ArticleBody';
import { SeriesNav } from '../components/SeriesNav';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import siteData from '../data/site.json';
import { ThreadNode } from '../icons/ThreadNode';
import { getPost, seriesNavFor } from '../lib/posts';
import { NotFoundPage } from './NotFoundPage';
import type { SiteContent } from '../types/content';
import { formatDate, machineDate } from '../utils/formatDate';
import { readingTimeLabel } from '../utils/readingTime';
import { seriesPartLabel } from '../utils/series';

const site = siteData as SiteContent;

export function PostPage() {
  const { slug = '' } = useParams();
  const post = getPost(slug);

  if (!post) {
    return <NotFoundPage />;
  }

  const seriesNav = seriesNavFor(slug);
  const author = site.authors.find(
    (candidate) => candidate.name === post.frontmatter.author,
  );

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
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
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
              {author && <span className="article__role">{author.role}</span>}
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
