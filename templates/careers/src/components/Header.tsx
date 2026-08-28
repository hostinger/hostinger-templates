import { Link } from "react-router";

import { BrandMark } from "~/icons/BrandMark";
import { buildHelloMailto } from "~/utils/apply";
import { site } from "~/utils/content";

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#roles">
        {site.nav.skip}
      </a>
      <div className="shell site-header-inner">
        <Link to="/" className="wordmark">
          <BrandMark />
          <span>{site.companyName}</span>
        </Link>
        <nav className="site-nav" aria-label="Site">
          <Link to="/#roles">{site.nav.roles}</Link>
          <Link to="/#faq">{site.nav.hiring}</Link>
          <a className="nav-cta" href={buildHelloMailto(site.email)}>
            {site.nav.hello}
          </a>
        </nav>
      </div>
    </header>
  );
}
