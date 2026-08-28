import { Header } from "@/components/Header";
import { MethodAndFaq } from "@/components/MethodAndFaq";
import { TicketEvaluator } from "@/components/TicketEvaluator";
import { siteContent } from "@/content/site";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: siteContent.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <div id="top" className="page-shell">
        <Header />
        <main>
          <section className="hero">
            <div className="hero-label">
              <span className="crosshair" aria-hidden="true">+</span>
              <p>{siteContent.eyebrow}</p>
            </div>
            <div className="hero-copy">
              <span className="stamp">LOCAL DEMO</span>
              <h1>{siteContent.headline}</h1>
              <div className="hero-summary">
                <p>{siteContent.intro}</p>
                <a href="#evaluation">Run evaluation ↓</a>
              </div>
            </div>
            <div className="hero-metrics" aria-label="Demo attributes">
              <span><strong>04</strong> classes</span>
              <span><strong>&lt;10ms</strong> local inference</span>
              <span><strong>0</strong> API calls</span>
            </div>
          </section>
          <TicketEvaluator />
          <MethodAndFaq />
        </main>
        <footer><span>M/ MODEL LABS</span><span>LOCAL EVALUATION BUILD 0.8.4</span><a href={`mailto:${siteContent.email}`}>{siteContent.email}</a></footer>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
