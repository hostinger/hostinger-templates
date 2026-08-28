import type { DropItem } from "~/types/content";
import { drop, dropNumberLabel, site } from "~/utils/content";
import type { DropStatus } from "~/utils/drop";
import { formatDropDateShort, formatPrice, padUnit } from "~/utils/drop";
import { buildEnquiryMailto } from "~/utils/enquiry";

interface ItemCardProps {
  item: DropItem;
  index: number;
  status: DropStatus;
}

export function ItemCard({ item, index, status }: ItemCardProps) {
  const live = status === "live";
  const chipLabel = live
    ? "Available"
    : `Drops ${formatDropDateShort(drop.dropDatetime, drop.timezone)}`;

  return (
    <li className={`item-card${item.sold ? " is-sold" : ""}`}>
      <div className="item-media">
        <img src={item.image} alt={item.imageAlt} width={640} height={800} />
        <span className="item-index" aria-hidden="true">
          {padUnit(index)}
        </span>
        {item.sold ? (
          <span className="sold-stamp" aria-hidden="true">
            Sold
          </span>
        ) : (
          <span className={`item-chip${live ? " is-live" : ""}`}>
            {chipLabel}
          </span>
        )}
      </div>
      <div className="item-body">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-spec">
          {item.era} · {item.size}
        </p>
        <p className="item-condition">{item.condition}</p>
        <p className="item-price">
          {item.sold ? (
            <>
              <s>{formatPrice(item.price)}</s>
              <span className="item-price-flag">Gone</span>
            </>
          ) : (
            formatPrice(item.price)
          )}
        </p>
        {item.sold ? (
          <p className="item-claimed">
            Sold — claimed by email. One of one, so that is it.
          </p>
        ) : (
          <a
            className={`claim-btn${live ? " is-live" : ""}`}
            href={buildEnquiryMailto(site.email, dropNumberLabel, item, status)}
          >
            {live ? "Claim by email" : "Ask about this piece"}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </li>
  );
}
