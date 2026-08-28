import type { FC } from 'hono/jsx';
import type { SiteContent } from '../types/content.js';
import { Footer } from './Footer.js';
import { Header } from './Header.js';
import { Layout } from './Layout.js';
import { Terminal } from './Terminal.js';

export const NotFoundPage: FC<{ site: SiteContent }> = ({ site }) => {
  const { notFound, project } = site;
  return (
    <Layout
      title={`${notFound.title} · ${project.name}`}
      description={notFound.message}
    >
      <Header site={site} />
      <main id="main">
        <section class="section not-found">
          <div class="container not-found-inner">
            <Terminal terminal={notFound.terminal} />
            <h1 class="not-found-title">{notFound.title}</h1>
            <p class="not-found-message">{notFound.message}</p>
            <a class="btn btn-primary" href="/#quickstart">
              {notFound.ctaLabel}
            </a>
          </div>
        </section>
      </main>
      <Footer site={site} />
    </Layout>
  );
};
