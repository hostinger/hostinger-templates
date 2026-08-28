import { STATUS_META } from "@/lib/deliveries";
import type { DeliveryStatus } from "@/lib/types";
import styles from "./StatusChip.module.css";

export function StatusChip({ status }: { status: DeliveryStatus }) {
  return (
    <span className={`${styles.chip} ${styles[status]}`}>
      <span className={styles.dot} aria-hidden />
      {STATUS_META[status].label}
    </span>
  );
}
