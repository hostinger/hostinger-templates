import type { FC } from 'hono/jsx';
import type { SiteContent } from '../types/content.js';
import { buildFaqJsonLd } from '../utils/schema.js';
import { FaqSection } from './FaqSection.js';
import { Footer } from './Footer.js';
import { Header } from './Header.js';
import { Hero } from './Hero.js';
import { InstallSection } from './InstallSection.js';
import { Layout } from './Layout.js';
import { QuickstartSection } from './QuickstartSection.js';

export const HomePage: FC<{ site: SiteContent }> = ({ site }) => (
  <Layout
    title={site.meta.title}
    description={site.meta.description}
    jsonLd={buildFaqJsonLd(site.faq.items)}
  >
    <Header site={site} />
    <main id="main">
      <Hero site={site} />
      <InstallSection install={site.install} project={site.project} />
      <QuickstartSection quickstart={site.quickstart} />
      <FaqSection faq={site.faq} />
    </main>
    <Footer site={site} />
  </Layout>
);
