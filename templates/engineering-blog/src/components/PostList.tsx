import { Link } from 'react-router-dom';

import { ThreadNode } from '../icons/ThreadNode';
import type { PostListEntry } from '../types/content';
import { formatDate, machineDate } from '../utils/formatDate';
import { postPath } from '../utils/paths';
import { readingTimeLabel } from '../utils/readingTime';
import { countSeriesParts, seriesPartLabel, type SeriesPost } from '../utils/series';

type Props = {
  posts: PostListEntry[];
};

function toSeriesPost(post: PostListEntry): SeriesPost {
  return {
    path: postPath(post.fields.slug),
    title: post.frontmatter.title,
    series: post.frontmatter.series,
    part: post.frontmatter.part,
  };
}

export function PostList({ posts }: Props) {
  const totals = countSeriesParts(posts.map(toSeriesPost));

  return (
    <ol className="post-list">
      {posts.map((post, index) => {
        const { frontmatter, fields } = post;
        const series = frontmatter.series;
        const inSeries = Boolean(series) && frontmatter.part !== null;
        const threadUp =
          inSeries && posts[index - 1]?.frontmatter.series === series;
        const threadDown =
          inSeries && posts[index + 1]?.frontmatter.series === series;
        const rowClass = [
          'post-row',
          threadUp ? 'post-row--thread-up' : '',
          threadDown ? 'post-row--thread-down' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <li key={post.id} className={rowClass}>
            <span className="post-row__thread" aria-hidden="true">
              {inSeries && <ThreadNode />}
            </span>
            <article className="post-row__body">
              <p className="post-row__meta">
                {inSeries && frontmatter.part !== null && series && (
                  <span className="post-row__series">
                    {series} · {seriesPartLabel(frontmatter.part, totals.get(series) ?? 1)}
                  </span>
                )}
                <time dateTime={machineDate(frontmatter.date)}>
                  {formatDate(frontmatter.date)}
                </time>
                <span className="post-row__dot" aria-hidden="true">
                  ·
                </span>
                <span>{readingTimeLabel(fields.readingMinutes)}</span>
              </p>
              <h3 className="post-row__title">
                <Link to={postPath(fields.slug)}>{frontmatter.title}</Link>
              </h3>
              <p className="post-row__excerpt">{post.excerpt}</p>
              <ul className="tag-list" aria-label="Tags">
                {frontmatter.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
