import type { MetaFunction } from "react-router";

import { CountdownMasthead } from "~/components/CountdownMasthead";
import { DropGrid } from "~/components/DropGrid";
import { FaqSection } from "~/components/FaqSection";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { HowItWorks } from "~/components/HowItWorks";
import { Ticker } from "~/components/Ticker";
import { availableItems, drop, dropNumberLabel, site } from "~/utils/content";
import {
  formatDropDateShort,
  formatDropTime,
  getDropStatus,
} from "~/utils/drop";
import { useNow } from "~/utils/useNow";

export const meta: MetaFunction = () => [
  { title: `${site.shopName} — Drop ${dropNumberLabel}: ${drop.dropName}` },
  {
    name: "description",
    content: `${site.tagline} ${drop.items.length} one-of-one pieces, claimed by email, first come first served.`,
  },
];

export default function Home() {
  const now = useNow();
  const status = now ? getDropStatus(drop.dropDatetime, now) : "upcoming";

  const shortDateLine = `${formatDropDateShort(drop.dropDatetime, drop.timezone)} · ${formatDropTime(drop.dropDatetime, drop.timezone)} ${drop.timezoneLabel}`;

  const tickerSegments =
    status === "live"
      ? [
          `Drop ${dropNumberLabel} is live`,
          "First email wins",
          `${availableItems.length} of ${drop.items.length} pieces unclaimed`,
          "No restocks",
        ]
      : [
          `Drop ${dropNumberLabel} — ${drop.dropName}`,
          shortDateLine,
          `${drop.items.length} pieces · one of each`,
          "Claims by email · first come, first served",
        ];

  return (
    <div className="page">
      <Header status={status} />
      <Ticker segments={tickerSegments} />
      <main>
        <CountdownMasthead now={now} status={status} />
        <DropGrid status={status} />
        <HowItWorks />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
