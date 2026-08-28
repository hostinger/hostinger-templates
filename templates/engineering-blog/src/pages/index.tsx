import { graphql } from 'gatsby';
import type { HeadFC, PageProps } from 'gatsby';

import { AboutSection } from '../components/AboutSection';
import { FaqSection } from '../components/FaqSection';
import { Masthead } from '../components/Masthead';
import { PostList } from '../components/PostList';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import siteData from '../data/site.json';
import type { IndexQueryData, SiteContent } from '../types/content';
import '../styles/global.css';

const site = siteData as SiteContent;

export default function IndexPage({ data }: PageProps<IndexQueryData>) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <div className="page">
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

export const query = graphql`
  {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        excerpt(pruneLength: 200)
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
  }
`;

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

export const Head: HeadFC = () => (
  <>
    <html lang="en" />
    <title>{`${site.name} — ${site.masthead.eyebrow}`}</title>
    <meta name="description" content={site.description} />
    <meta name="theme-color" content="#ffffff" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
  </>
);
