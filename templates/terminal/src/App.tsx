import { FaqSection } from './components/FaqSection';
import { FieldManual } from './components/FieldManual';
import { HeroTerminal } from './components/HeroTerminal';
import { InstallTabs } from './components/InstallTabs';
import { OutputExamples } from './components/OutputExamples';
import { SiteHeader } from './components/SiteHeader';
import siteData from './content/site.json';
import type { SiteContent } from './types/site';

const site = siteData as SiteContent;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: site.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function App() {
  return (
    <div id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <section className="hero-shell">
        <SiteHeader
          name={site.brand.name}
          version={site.brand.version}
          navigation={site.navigation}
        />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">{site.brand.eyebrow}</p>
            <h1>{site.brand.headline}</h1>
            <p className="hero-description">{site.brand.description}</p>
            <a className="hero-cta" href="#install">Install relayctl <span aria-hidden="true">↓</span></a>
            <p className="hero-availability">{site.brand.availability}</p>
          </div>
          <div className="hero-demo">
            <HeroTerminal command={site.heroDemo.command} output={site.heroDemo.output} />
          </div>
          <div className="giant-prompt" aria-hidden="true">&gt;</div>
        </div>
      </section>

      <main id="main">
        <InstallTabs {...site.install} />
        <FieldManual {...site.workflow} features={site.features} />
        <OutputExamples examples={site.examples} />
        <FaqSection items={site.faq} />
      </main>

      <footer className="site-footer">
        <p>{site.footer.note}</p>
        <p>{site.footer.copyright}</p>
        <a href="#top">Return to prompt ↑</a>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
