import { drop, site } from "~/utils/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-brand">
        {site.shopName}
        <span aria-hidden="true">.</span>
      </p>
      <div className="footer-grid">
        <div className="footer-col">
          <p className="footer-label">Claims &amp; questions</p>
          <a className="footer-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p className="footer-note">
            {site.sellerName} · {site.city}
          </p>
        </div>
        <div className="footer-col">
          <p className="footer-label">Elsewhere</p>
          <ul className="footer-socials">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href}>{social.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-label">The fine print</p>
          <p className="footer-note">{site.footerNote}</p>
          <p className="footer-note">
            All times {drop.timezoneLabel}. SOLD stamps are updated by hand
            when a claim lands.
          </p>
        </div>
      </div>
    </footer>
  );
}
