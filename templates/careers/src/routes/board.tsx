import type { MetaFunction } from "react-router";

import { FaqSection } from "~/components/FaqSection";
import { FilterBoard } from "~/components/FilterBoard";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Hero } from "~/components/Hero";
import { site } from "~/utils/content";

export const meta: MetaFunction = () => [
  { title: `${site.hero.kicker} — ${site.board.title}` },
  { name: "description", content: site.valuesLine },
];

export default function Board() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <FilterBoard />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
