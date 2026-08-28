import { ItemCard } from "~/components/ItemCard";
import { drop, soldCount } from "~/utils/content";
import type { DropStatus } from "~/utils/drop";

interface DropGridProps {
  status: DropStatus;
}

export function DropGrid({ status }: DropGridProps) {
  return (
    <section className="pieces" id="pieces" aria-labelledby="pieces-title">
      <div className="pieces-header">
        <p className="section-kicker">01 — The rail</p>
        <h2 id="pieces-title" className="section-title">
          The pieces
        </h2>
        <p className="pieces-count">
          {drop.items.length} one-of-ones · {soldCount} already claimed
        </p>
      </div>
      <ul className="item-grid">
        {drop.items.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            index={index + 1}
            status={status}
          />
        ))}
      </ul>
    </section>
  );
}
