import timeseriesJson from "@/mocks/timeseries.json";
import metricsJson from "@/mocks/metrics.json";
import rowsJson from "@/mocks/rows.json";
import activityJson from "@/mocks/activity.json";
import orgJson from "@/mocks/org.json";
import siteJson from "@/config/site.json";
import type {
  ActivityItem,
  DeliveryRow,
  MetricsMock,
  OrgMock,
  SiteConfig,
  Timeseries,
} from "./types";

/**
 * Typed access to the committed demo data. To plug in a real backend,
 * replace these constants with your own fetches that return the same
 * shapes from lib/types.ts — every page and component reads only these.
 */
export const timeseries: Timeseries = timeseriesJson;
export const metricsMock: MetricsMock = metricsJson;
export const deliveryRows: DeliveryRow[] = rowsJson as DeliveryRow[];
export const activityItems: ActivityItem[] = activityJson as ActivityItem[];
export const org: OrgMock = orgJson;
export const site: SiteConfig = siteJson;
