import { siteContent } from "@/content/site";

export function Header() {
  const waitlistHref = `mailto:${siteContent.email}?subject=${encodeURIComponent("Model early access")}`;

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Model home">
        <span aria-hidden="true">M/</span> MODEL
      </a>
      <nav aria-label="Primary navigation">
        <a href="#evaluation">Evaluation</a>
        <a href="#method">Method</a>
        <a className="button button-small" href={waitlistHref}>Join waitlist ↗</a>
      </nav>
    </header>
  );
}
