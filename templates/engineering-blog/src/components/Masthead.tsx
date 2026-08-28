import siteData from '../data/site.json';
import { ThreadRule } from '../icons/ThreadRule';
import type { SiteContent } from '../types/content';

const site = siteData as SiteContent;

export function Masthead() {
  return (
    <section className="masthead" aria-label="Introduction">
      <p className="masthead__eyebrow">{site.masthead.eyebrow}</p>
      <h1 className="masthead__headline">{site.masthead.headline}</h1>
      <p className="masthead__dek">{site.masthead.dek}</p>
      <ThreadRule />
      <ul className="masthead__meta">
        {site.masthead.meta.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
