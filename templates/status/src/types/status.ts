export type DayStatus = 'operational' | 'degraded' | 'outage';

export interface UptimeDay {
  date: string;
  status: DayStatus;
  value: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  days: UptimeDay[];
}

export interface IncidentUpdate {
  time: string;
  label: string;
  detail: string;
}

export interface Incident {
  date: string;
  title: string;
  summary: string;
  duration: string;
  affected: string;
  updates: IncidentUpdate[];
}
