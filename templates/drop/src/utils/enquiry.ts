import type { DropItem } from "~/types/content";
import type { DropStatus } from "~/utils/drop";
import { formatPrice } from "~/utils/drop";

/**
 * Builds a mailto link pre-filled with the piece name so a claim or question
 * lands in the seller's inbox ready to send. Before the drop the subject reads
 * as a question; once live it reads as a claim.
 */
export function buildEnquiryMailto(
  email: string,
  dropNumberLabel: string,
  item: DropItem,
  status: DropStatus,
): string {
  const subject =
    status === "live"
      ? `CLAIM — ${item.name} (Drop ${dropNumberLabel})`
      : `Question — ${item.name} (Drop ${dropNumberLabel})`;

  const body = [
    `Piece: ${item.name}`,
    `Spec: ${item.era} · ${item.size} · ${item.condition}`,
    `Price: ${formatPrice(item.price)}`,
    "",
    status === "live"
      ? "I claim this piece."
      : "Question before the drop:",
    "",
  ].join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
