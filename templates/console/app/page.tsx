import type { Metadata } from "next";
import { ActivityFeed } from "@/components/ActivityFeed";
import { DeliveredChart } from "@/components/charts/DeliveredChart";
import { FailuresChart } from "@/components/charts/FailuresChart";
import { StatCard } from "@/components/StatCard";
import { activityItems, metricsMock, site, timeseries } from "@/lib/data";
import { buildStatCards } from "@/lib/metrics";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: site.overview.title,
};

export default function OverviewPage() {
  const cards = buildStatCards();
  const days = timeseries.current.days;
  const windowLabel = timeseries.current.label;

  return (
    <div className={styles.page}>
      <header className="page-header">
        <h1 className="page-title">{site.overview.title}</h1>
        <p className="page-sub">
          {site.overview.subtitle} · {metricsMock.windowLabel}, {metricsMock.windowRange}
        </p>
      </header>

      <section className={styles.kpiGrid} aria-label="Key metrics">
        {cards.map((card) => (
          <StatCard key={card.id} data={card} />
        ))}
      </section>

      <div className={styles.chartsGrid}>
        <section className="panel" aria-labelledby="delivered-heading">
          <div className="panel-header">
            <h2 className="panel-title" id="delivered-heading">
              {site.overview.deliveredChart.title}
            </h2>
            <p className="panel-sub">
              {site.overview.deliveredChart.subtitle} · {windowLabel}
            </p>
          </div>
          <DeliveredChart days={days} windowLabel={windowLabel} />
        </section>
        <section className="panel" aria-labelledby="failures-heading">
          <div className="panel-header">
            <h2 className="panel-title" id="failures-heading">
              {site.overview.failuresChart.title}
            </h2>
            <p className="panel-sub">{site.overview.failuresChart.subtitle}</p>
          </div>
          <FailuresChart days={days} windowLabel={windowLabel} />
        </section>
      </div>

      <section className="panel" aria-labelledby="activity-heading">
        <div className="panel-header">
          <h2 className="panel-title" id="activity-heading">
            {site.overview.activity.title}
          </h2>
          <p className="panel-sub">{site.overview.activity.subtitle}</p>
        </div>
        <ActivityFeed items={activityItems} />
      </section>
    </div>
  );
}
