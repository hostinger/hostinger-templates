import type { Metadata } from "next";
import { EventsTable } from "@/components/EventsTable";
import { deliveryRows, site } from "@/lib/data";
import { countByStatus } from "@/lib/deliveries";
import { formatInt } from "@/lib/format";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: site.eventsPage.title,
};

export default function EventsPage() {
  const counts = countByStatus(deliveryRows);

  return (
    <div className={styles.page}>
      <header className="page-header">
        <h1 className="page-title">{site.eventsPage.title}</h1>
        <p className="page-sub">{site.eventsPage.subtitle}</p>
        <p className={styles.counts}>
          <span className={styles.count}>
            <strong className={styles.countValue}>{formatInt(deliveryRows.length)}</strong> deliveries
          </span>
          <span className={styles.count}>
            <span className={`${styles.countDot} ${styles.dotGood}`} aria-hidden />
            <strong className={styles.countValue}>{formatInt(counts.delivered)}</strong> delivered
          </span>
          <span className={styles.count}>
            <span className={`${styles.countDot} ${styles.dotWarn}`} aria-hidden />
            <strong className={styles.countValue}>{formatInt(counts.retrying)}</strong> retrying
          </span>
          <span className={styles.count}>
            <span className={`${styles.countDot} ${styles.dotCritical}`} aria-hidden />
            <strong className={styles.countValue}>{formatInt(counts.failed)}</strong> failed
          </span>
        </p>
      </header>
      <section className={styles.tableCard} aria-label="Recent deliveries">
        <EventsTable rows={deliveryRows} />
      </section>
    </div>
  );
}
