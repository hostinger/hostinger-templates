import { AboutSection } from '../components/AboutSection';
import { FaqSection } from '../components/FaqSection';
import { Masthead } from '../components/Masthead';
import { PostList } from '../components/PostList';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import siteData from '../data/site.json';
import { listPosts } from '../lib/posts';
import type { SiteContent } from '../types/content';

const site = siteData as SiteContent;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: site.faq.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export function HomePage() {
  const posts = listPosts();

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <a className="skip-link" href="#main-content">
        Skip to the writing
      </a>
      <SiteHeader />
      <main id="main-content">
        <Masthead />
        <section
          id="writing"
          className="writing section"
          aria-labelledby="writing-heading"
        >
          <div className="section-grid">
            <div className="section-head">
              <h2 id="writing-heading">{site.writing.heading}</h2>
              <p>{site.writing.lede}</p>
            </div>
            <PostList posts={posts} />
          </div>
        </section>
        <AboutSection />
        <FaqSection faq={site.faq} />
      </main>
      <SiteFooter />
    </div>
  );
}
