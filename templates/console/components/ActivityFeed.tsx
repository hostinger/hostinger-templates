import type { ComponentType, SVGProps } from "react";
import { formatDateTime } from "@/lib/format";
import type { ActivityItem, ActivityKind } from "@/lib/types";
import { IconAlert, IconDeploy, IconSliders, IconTarget, IconUser } from "./icons";
import styles from "./ActivityFeed.module.css";

const KIND_ICONS: Record<ActivityKind, ComponentType<SVGProps<SVGSVGElement>>> = {
  deploy: IconDeploy,
  config: IconSliders,
  member: IconUser,
  endpoint: IconTarget,
  alert: IconAlert,
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ol className={styles.feed}>
      {items.map((item) => {
        const Icon = KIND_ICONS[item.kind];
        return (
          <li key={item.id} className={styles.item}>
            <span className={`${styles.kindIcon} ${styles[item.kind]}`} aria-hidden>
              <Icon width={18} height={18} />
            </span>
            <div className={styles.body}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.detail}>{item.detail}</p>
            </div>
            <div className={styles.meta}>
              <span className={styles.actor}>{item.actor}</span>
              <time className={styles.time} dateTime={item.at}>
                {formatDateTime(item.at)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
