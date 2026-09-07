import { Link } from 'react-router-dom';

import siteData from '../data/site.json';
import type { SiteContent } from '../types/content';

const site = siteData as SiteContent;

export function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="not-found__eyebrow">{site.name}</p>
      <h1>There is no post at this address</h1>
      <p>
        It may have moved, or the link may have a typo. Everything we have
        published is listed on the front page.
      </p>
      <Link className="not-found__link" to="/">
        Back to the writing
      </Link>
    </main>
  );
}
