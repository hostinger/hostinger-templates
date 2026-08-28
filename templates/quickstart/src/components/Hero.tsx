import type { FC } from 'hono/jsx';
import type { SiteContent } from '../types/content.js';
import { CommandBlock } from './CommandBlock.js';
import { ResultPanel } from './ResultPanel.js';

export const Hero: FC<{ site: SiteContent }> = ({ site }) => {
  const { hero, project, install } = site;
  const primary =
    install.methods.find((method) => method.id === hero.primaryInstallId) ??
    install.methods[0];

  return (
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="kicker">{hero.kicker}</p>
          <h1 class="headline">{hero.headline}</h1>
          <p class="one-liner">{project.oneLiner}</p>
          {primary === undefined ? null : (
            <div class="hero-install">
              <p class="hero-install-lead">{hero.installLead}</p>
              <CommandBlock command={primary.command} />
            </div>
          )}
          <div class="hero-ctas">
            <a class="btn btn-primary" href="#quickstart">
              {hero.quickstartCta}
            </a>
            <a class="btn btn-ghost" href={project.repoUrl} rel="noreferrer">
              {hero.githubCta}
              <span class="ext-mark" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
        <ResultPanel result={site.result} />
      </div>
    </section>
  );
};
