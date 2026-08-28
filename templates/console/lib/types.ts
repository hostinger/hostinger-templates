export interface DayPoint {
  date: string;
  delivered: number;
  failed: number;
  p50Ms: number;
}

export interface SeriesWindow {
  label: string;
  days: DayPoint[];
}

export interface Timeseries {
  metric: string;
  granularity: string;
  current: SeriesWindow;
  previous: SeriesWindow;
}

export interface MetricCardCopy {
  label: string;
  hint: string;
  current?: number;
  previous?: number;
}

export interface MetricsMock {
  windowLabel: string;
  windowRange: string;
  comparisonLabel: string;
  cards: {
    delivered: MetricCardCopy;
    successRate: MetricCardCopy;
    latency: MetricCardCopy;
    endpoints: MetricCardCopy;
  };
}

export type DeliveryStatus = "delivered" | "retrying" | "failed";

export interface DeliveryRow {
  id: string;
  eventType: string;
  endpoint: string;
  url: string;
  status: DeliveryStatus;
  attempts: number;
  latencyMs: number | null;
  receivedAt: string;
}

export type ActivityKind = "deploy" | "config" | "member" | "endpoint" | "alert";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  actor: string;
  at: string;
}

export interface OrgMock {
  organization: {
    name: string;
    slug: string;
    plan: string;
    region: string;
    dataRetention: string;
    createdAt: string;
  };
  profile: {
    name: string;
    initials: string;
    email: string;
    role: string;
    timezone: string;
    twoFactor: string;
  };
  api: {
    publishableKey: string;
    signingSecret: string;
    apiVersion: string;
    environment: string;
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ChartCopy {
  title: string;
  subtitle: string;
}

export interface SiteConfig {
  product: string;
  console: string;
  tagline: string;
  description: string;
  orgLabel: string;
  workspaceLabel: string;
  demoBadge: string;
  footerNote: string;
  overview: {
    title: string;
    subtitle: string;
    deliveredChart: ChartCopy;
    failuresChart: ChartCopy;
    activity: ChartCopy;
  };
  eventsPage: {
    title: string;
    subtitle: string;
  };
  settingsPage: {
    title: string;
    subtitle: string;
    notice: string;
    sections: {
      workspace: string;
      profile: string;
      api: string;
    };
    apiNote: string;
  };
  faq: {
    title: string;
    intro: string;
    items: FaqEntry[];
  };
}

export interface StatDelta {
  text: string;
  direction: "up" | "down";
  good: boolean;
  srText: string;
}

export interface StatCardData {
  id: string;
  label: string;
  hint: string;
  value: string;
  unit?: string;
  delta: StatDelta;
  comparison: string;
  spark: number[] | null;
}
