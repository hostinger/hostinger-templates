import { linePath, sparkPoints } from "@/lib/chart";
import type { StatCardData } from "@/lib/types";
import { IconArrowDown, IconArrowUp } from "./icons";
import styles from "./StatCard.module.css";

const SPARK_WIDTH = 132;
const SPARK_HEIGHT = 34;

export function StatCard({ data }: { data: StatCardData }) {
  const spark = data.spark && data.spark.length > 1 ? sparkPoints(data.spark, SPARK_WIDTH, SPARK_HEIGHT) : null;
  const sparkEnd = spark ? spark[spark.length - 1] : null;
  const DeltaIcon = data.delta.direction === "up" ? IconArrowUp : IconArrowDown;

  return (
    <article className={styles.card}>
      <h3 className={styles.label}>{data.label}</h3>
      <p className={styles.value}>
        {data.value}
        {data.unit ? <span className={styles.unit}>{data.unit}</span> : null}
        <span className="sr-only">. {data.hint}.</span>
      </p>
      <p className={styles.deltaRow}>
        <span className={data.delta.good ? styles.deltaGood : styles.deltaBad}>
          <DeltaIcon className={styles.deltaIcon} aria-hidden />
          <span aria-hidden>{data.delta.text}</span>
          <span className="sr-only">{data.delta.srText}</span>
        </span>
        <span className={styles.comparison} aria-hidden>
          {data.comparison}
        </span>
      </p>
      {spark && sparkEnd ? (
        <svg
          className={styles.spark}
          viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
          width={SPARK_WIDTH}
          height={SPARK_HEIGHT}
          aria-hidden
        >
          <path className={styles.sparkLine} d={linePath(spark)} />
          <circle className={styles.sparkDot} cx={sparkEnd.x} cy={sparkEnd.y} r={3} />
        </svg>
      ) : null}
    </article>
  );
}
