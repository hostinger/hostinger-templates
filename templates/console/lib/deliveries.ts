import type { DeliveryRow, DeliveryStatus } from "./types";

export type SortKey = "eventType" | "endpoint" | "status" | "attempts" | "latencyMs" | "receivedAt";
export type SortDir = "asc" | "desc";

export interface SortState {
  key: SortKey;
  dir: SortDir;
}

export const DEFAULT_SORT: SortState = { key: "receivedAt", dir: "desc" };

export const STATUS_META: Record<DeliveryStatus, { label: string; rank: number }> = {
  delivered: { label: "Delivered", rank: 0 },
  retrying: { label: "Retrying", rank: 1 },
  failed: { label: "Failed", rank: 2 },
};

export interface ColumnDef {
  key: SortKey | "id";
  label: string;
  sortable: boolean;
  numeric: boolean;
  defaultDir: SortDir;
}

export const DELIVERY_COLUMNS: ColumnDef[] = [
  { key: "id", label: "Delivery", sortable: false, numeric: false, defaultDir: "asc" },
  { key: "eventType", label: "Event", sortable: true, numeric: false, defaultDir: "asc" },
  { key: "endpoint", label: "Endpoint", sortable: true, numeric: false, defaultDir: "asc" },
  { key: "status", label: "Status", sortable: true, numeric: false, defaultDir: "desc" },
  { key: "attempts", label: "Attempts", sortable: true, numeric: true, defaultDir: "desc" },
  { key: "latencyMs", label: "Latency", sortable: true, numeric: true, defaultDir: "desc" },
  { key: "receivedAt", label: "Received", sortable: true, numeric: false, defaultDir: "desc" },
];

function compare(a: DeliveryRow, b: DeliveryRow, key: SortKey): number {
  switch (key) {
    case "attempts":
      return a.attempts - b.attempts;
    case "status":
      return STATUS_META[a.status].rank - STATUS_META[b.status].rank;
    case "latencyMs": {
      if (a.latencyMs === null && b.latencyMs === null) return 0;
      if (a.latencyMs === null) return -1;
      if (b.latencyMs === null) return 1;
      return a.latencyMs - b.latencyMs;
    }
    case "receivedAt":
      return a.receivedAt.localeCompare(b.receivedAt);
    case "eventType":
      return a.eventType.localeCompare(b.eventType);
    case "endpoint":
      return a.endpoint.localeCompare(b.endpoint);
  }
}

/**
 * Pure client-side sort. Ties fall back to newest-first so the order is
 * always deterministic; rows without a latency value stay at the end in
 * both directions.
 */
export function sortRows(rows: DeliveryRow[], { key, dir }: SortState): DeliveryRow[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (key === "latencyMs") {
      const aMissing = a.latencyMs === null;
      const bMissing = b.latencyMs === null;
      if (aMissing !== bMissing) return aMissing ? 1 : -1;
    }
    const primary = compare(a, b, key) * factor;
    if (primary !== 0) return primary;
    return b.receivedAt.localeCompare(a.receivedAt) || a.id.localeCompare(b.id);
  });
}

export function countByStatus(rows: DeliveryRow[]): Record<DeliveryStatus, number> {
  const counts: Record<DeliveryStatus, number> = { delivered: 0, retrying: 0, failed: 0 };
  for (const row of rows) counts[row.status] += 1;
  return counts;
}
