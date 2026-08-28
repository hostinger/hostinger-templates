import { siteContent } from "@/content/site";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={`${siteContent.brand} home`}>
        <span className="brand-mark" aria-hidden="true">
          L!
        </span>
        {siteContent.brand}
      </a>
      <nav aria-label="Main navigation">
        {siteContent.navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="button button-small" href={siteContent.headerCta.href}>
        {siteContent.headerCta.label}
      </a>
    </header>
  );
}
