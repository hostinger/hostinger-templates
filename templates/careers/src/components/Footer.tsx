import { BrandMark } from "~/icons/BrandMark";
import { buildHelloMailto } from "~/utils/apply";
import { site } from "~/utils/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <p className="footer-kicker">{site.footer.kicker}</p>
        <h2 className="footer-title">{site.footer.title}</h2>
        <a className="footer-email" href={buildHelloMailto(site.email)}>
          {site.email}
        </a>
        <div className="footer-meta">
          <p className="footer-brand">
            <BrandMark />
            <span>
              <strong>{site.companyName}</strong> · {site.city}
            </span>
          </p>
          <ul className="footer-links">
            {site.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="footer-values">{site.valuesLine}</p>
        <p className="footer-note">{site.footerNote}</p>
      </div>
    </footer>
  );
}
