import { useState } from 'react';
import { ClaimDialog } from '../components/ClaimDialog';
import { FaqSection } from '../components/FaqSection';
import { FlashCard } from '../components/FlashCard';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { flashDesigns, motifs, site } from '../constants/content';
import type { FlashDesign } from '../types/content';

export function HomePage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<FlashDesign | null>(null);
  const visibleDesigns = filter === 'all' ? flashDesigns : flashDesigns.filter(({ motif }) => motif === filter);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <Header />
      <main>
        <section className="hero section-shell">
          <div className="hero-aside">
            <p>{site.eyebrow}</p>
            <span>Est. 2025</span>
          </div>
          <div className="hero-title">
            <p>Ready-made tattoos / edition one of one</p>
            <h1>{site.headline}</h1>
            <div className="hero-bottom">
              <p>{site.intro}</p>
              <a href="#flash">See the wall ↓</a>
            </div>
          </div>
          <div className="hero-sigil" aria-hidden="true">
            <span>✦</span>
            <strong>BT</strong>
            <small>Bristol</small>
          </div>
        </section>

        <section className="flash-wall section-shell" id="flash" aria-labelledby="wall-title">
          <div className="wall-heading">
            <div>
              <p className="kicker">Current sheet · eight pieces</p>
              <h2 id="wall-title">The wall</h2>
            </div>
            <div className="filters" aria-label="Filter flash by motif">
              {motifs.map((motif) => (
                <button
                  type="button"
                  key={motif}
                  className={filter === motif ? 'active' : ''}
                  aria-pressed={filter === motif}
                  onClick={() => setFilter(motif)}
                >
                  {motif}
                </button>
              ))}
            </div>
          </div>
          <div className="flash-grid" aria-live="polite">
            {visibleDesigns.map((design) => (
              <FlashCard key={design.id} design={design} onClaim={setSelected} />
            ))}
          </div>
        </section>

        <section className="studio-note section-shell">
          <p className="kicker">About the studio</p>
          <p className="large-copy">{site.about}</p>
          <div className="studio-rules">
            <span>01 / Drawn here</span>
            <span>02 / Tattooed once</span>
            <span>03 / Adapted to you</span>
          </div>
        </section>
        <FaqSection />
      </main>
      <Footer />
      <ClaimDialog design={selected} onClose={() => setSelected(null)} />
    </>
  );
}
