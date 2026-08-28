"use client";

import { useMemo, useState } from "react";
import {
  DEFAULT_SORT,
  DELIVERY_COLUMNS,
  sortRows,
  type SortDir,
  type SortKey,
  type SortState,
} from "@/lib/deliveries";
import { formatDateTime, formatInt } from "@/lib/format";
import type { DeliveryRow } from "@/lib/types";
import { IconSortAsc, IconSortBoth, IconSortDesc } from "./icons";
import { StatusChip } from "./StatusChip";
import styles from "./EventsTable.module.css";

const DIR_WORD: Record<SortDir, "ascending" | "descending"> = { asc: "ascending", desc: "descending" };

export function EventsTable({ rows }: { rows: DeliveryRow[] }) {
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const sorted = useMemo(() => sortRows(rows, sort), [rows, sort]);
  const activeColumn = DELIVERY_COLUMNS.find((column) => column.key === sort.key);

  function toggleSort(key: SortKey, defaultDir: SortDir) {
    setSort((previous) =>
      previous.key === key ? { key, dir: previous.dir === "asc" ? "desc" : "asc" } : { key, dir: defaultDir },
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.mobileSort}>
        <label className={styles.mobileSortLabel} htmlFor="events-sort">
          Sort by
        </label>
        <select
          id="events-sort"
          className={styles.mobileSortSelect}
          value={sort.key}
          onChange={(event) => {
            const key = event.target.value as SortKey;
            const column = DELIVERY_COLUMNS.find((candidate) => candidate.key === key);
            setSort({ key, dir: column?.defaultDir ?? "asc" });
          }}
        >
          {DELIVERY_COLUMNS.filter((column) => column.sortable).map((column) => (
            <option key={column.key} value={column.key}>
              {column.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className={styles.mobileDirButton}
          onClick={() => setSort((previous) => ({ ...previous, dir: previous.dir === "asc" ? "desc" : "asc" }))}
        >
          {sort.dir === "asc" ? <IconSortAsc aria-hidden /> : <IconSortDesc aria-hidden />}
          {sort.dir === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      <table className={styles.table} role="table">
        <caption className="sr-only">
          Recent webhook deliveries, sorted by {activeColumn?.label.toLowerCase()}, {DIR_WORD[sort.dir]}
        </caption>
        <thead className={styles.thead} role="rowgroup">
          <tr role="row">
            {DELIVERY_COLUMNS.map((column) => {
              const isActive = column.key === sort.key;
              return (
                <th
                  key={column.key}
                  role="columnheader"
                  scope="col"
                  aria-sort={column.sortable ? (isActive ? DIR_WORD[sort.dir] : "none") : undefined}
                  className={column.numeric ? styles.numericHead : undefined}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={isActive ? `${styles.sortButton} ${styles.sortButtonActive}` : styles.sortButton}
                      onClick={() => toggleSort(column.key as SortKey, column.defaultDir)}
                    >
                      {column.label}
                      {isActive ? (
                        sort.dir === "asc" ? (
                          <IconSortAsc className={styles.sortIcon} aria-hidden />
                        ) : (
                          <IconSortDesc className={styles.sortIcon} aria-hidden />
                        )
                      ) : (
                        <IconSortBoth className={styles.sortIconIdle} aria-hidden />
                      )}
                    </button>
                  ) : (
                    <span className={styles.headLabel}>{column.label}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {sorted.map((row) => (
            <tr key={row.id} role="row" className={styles.row}>
              <td role="cell" data-label="Delivery" className={styles.idCell}>
                <span className={styles.mono}>{row.id}</span>
              </td>
              <td role="cell" data-label="Event">
                <span className={styles.eventType}>{row.eventType}</span>
              </td>
              <td role="cell" data-label="Endpoint" className={styles.endpointCell}>
                <span className={styles.endpointValue}>
                  <span className={styles.endpointName}>{row.endpoint}</span>
                  <span className={styles.endpointUrl}>{row.url}</span>
                </span>
              </td>
              <td role="cell" data-label="Status">
                <StatusChip status={row.status} />
              </td>
              <td role="cell" data-label="Attempts" className={styles.numeric}>
                <span className={styles.mono}>{formatInt(row.attempts)}</span>
              </td>
              <td role="cell" data-label="Latency" className={styles.numeric}>
                <span className={styles.mono}>{row.latencyMs === null ? "—" : `${formatInt(row.latencyMs)} ms`}</span>
              </td>
              <td role="cell" data-label="Received">
                <span className={styles.mono}>{formatDateTime(row.receivedAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="sr-only" role="status">
        Sorted by {activeColumn?.label.toLowerCase()}, {DIR_WORD[sort.dir]}
      </p>
    </div>
  );
}
