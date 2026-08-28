import type { HeadFC } from 'gatsby';
import { Link } from 'gatsby';

import albumData from '../data/album.json';
import type { AlbumContent } from '../types/content';
import '../styles/global.css';

const album = albumData as AlbumContent;

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">{album.eyebrow}</p>
      <h1>This page is not part of the gallery</h1>
      <p>The album lives on a single page — everything is there.</p>
      <Link className="not-found-link" to="/">
        Back to the album
      </Link>
    </main>
  );
}

export const Head: HeadFC = () => (
  <>
    <html lang="en" />
    <title>{`Page not found — ${album.title}`}</title>
    <meta name="robots" content="noindex" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </>
);
