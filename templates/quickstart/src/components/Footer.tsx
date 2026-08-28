import type { FC } from 'hono/jsx';
import type { SiteContent } from '../types/content.js';
import { isExternalHref, resolveHref } from '../utils/content.js';

export const Footer: FC<{ site: SiteContent }> = ({ site }) => {
  const { project, footer } = site;
  return (
    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <p class="footer-name">{project.name}</p>
          <p class="footer-blurb">{footer.blurb}</p>
        </div>
        <nav class="footer-links" aria-label="Footer">
          {footer.links.map((link) => {
            const href = resolveHref(project, link.href);
            return (
              <a
                class="footer-link"
                href={href}
                rel={isExternalHref(href) ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
      <div class="container footer-fine">
        <p>{footer.finePrint}</p>
        <p class="footer-version">
          {project.name} v{project.version} · {project.licenseName}
        </p>
      </div>
    </footer>
  );
};
