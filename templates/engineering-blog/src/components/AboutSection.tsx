import siteData from '../data/site.json';
import { ThreadNode } from '../icons/ThreadNode';
import type { SiteContent } from '../types/content';

const site = siteData as SiteContent;

export function AboutSection() {
  return (
    <section id="about" className="about section" aria-labelledby="about-heading">
      <div className="section-grid">
        <div className="section-head">
          <h2 id="about-heading">{site.about.heading}</h2>
        </div>
        <div className="about__body">
          {site.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h3 className="about__authors-heading">{site.about.authorsHeading}</h3>
          <ul className="author-list">
            {site.authors.map((author) => (
              <li key={author.name} className="author-row">
                <ThreadNode />
                <span className="author-row__name">{author.name}</span>
                <span className="author-row__role">{author.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
