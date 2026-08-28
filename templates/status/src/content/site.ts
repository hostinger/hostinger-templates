import type { Incident } from '../types/status';

export const site = {
  name: 'Northstar Cloud',
  title: 'Northstar Cloud service status',
  description:
    'A dated, committed snapshot of Northstar Cloud service availability and recent incident reports.',
  supportEmail: 'status@northstarcloud.example',
  snapshotLabel: 'Snapshot published 28 August 2026 · 14:30 UTC',
  notice:
    'This public page is generated from committed status data. It is a point-in-time record, not a live monitor.',
} as const;

export const incidents: Incident[] = [
  {
    date: '14 AUG 2026',
    title: 'Edge requests slowed in Northern Europe',
    summary:
      'A routing policy change sent more traffic than intended through our Stockholm exchange. Cached pages remained available, but some first requests took longer to complete.',
    duration: 'Resolved in 41 minutes',
    affected: 'Edge delivery network · Northern Europe',
    updates: [
      {
        time: '09:12 UTC',
        label: 'Investigating',
        detail:
          'Operators saw elevated origin response times and isolated the pattern to one exchange path.',
      },
      {
        time: '09:31 UTC',
        label: 'Mitigating',
        detail:
          'Traffic was redistributed to Copenhagen and Frankfurt while the routing policy was rolled back.',
      },
      {
        time: '09:53 UTC',
        label: 'Resolved',
        detail:
          'Latency returned to baseline. We added a regional traffic ceiling before re-enabling automated policy changes.',
      },
    ],
  },
  {
    date: '22 JUN 2026',
    title: 'Compute scheduling paused in eu-central',
    summary:
      'A capacity index stopped refreshing after a database failover. Existing workloads kept running, while new compute requests waited or returned a temporary error.',
    duration: 'Resolved in 33 minutes',
    affected: 'Compute fabric and Cloud API · eu-central',
    updates: [
      {
        time: '16:04 UTC',
        label: 'Identified',
        detail:
          'The scheduler was reading a stale capacity index following an automated database failover.',
      },
      {
        time: '16:19 UTC',
        label: 'Recovering',
        detail:
          'The index was rebuilt and queued requests began moving through the scheduler in arrival order.',
      },
      {
        time: '16:37 UTC',
        label: 'Resolved',
        detail:
          'Normal scheduling resumed. Failover checks now verify index freshness before reopening writes.',
      },
    ],
  },
];

export const faqs = [
  {
    question: 'Is this page showing live service health?',
    answer:
      'No. This template renders a dated snapshot from src/content/status.json. Connect your own verified data source before presenting it as live status.',
  },
  {
    question: 'How is 90-day uptime calculated?',
    answer:
      'Each service average uses the 90 committed daily percentage values shown in the uptime tape. It is rounded to three decimal places.',
  },
  {
    question: 'What do yellow and red marks mean?',
    answer:
      'Yellow marks a day with degraded performance. Red marks a day with a service interruption. The exact date and value are available as text on every mark.',
  },
  {
    question: 'Where are maintenance notices published?',
    answer:
      'Planned work would be added to this noticeboard before it begins. This fictional snapshot has no scheduled maintenance.',
  },
];
