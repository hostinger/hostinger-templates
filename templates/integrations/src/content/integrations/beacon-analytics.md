---
name: Beacon Analytics
category: Analytics
icon: beacon
accent: tangerine
summary: Stream meaningful workflow outcomes into dashboards built for decisions, not activity.
trigger: Workflow reaches outcome
action: Record analytics event
useCases:
  - Measure onboarding completion by customer segment.
  - Track approval cycle time and exceptions.
  - Compare automation outcomes across teams.
setup:
  - Create a Beacon Analytics event destination.
  - Map outcome, timing, and segment properties.
  - Inspect the test event and enable reporting.
faqs:
  - question: Which properties should I send?
    answer: Start with workflow ID, outcome, duration, and a useful segment such as team or plan.
  - question: Does this template send analytics?
    answer: No. This static demo documents the integration but contains no tracking or live connection.
---
Beacon Analytics makes finished work measurable. Focused outcome events help operators see whether workflows improve speed and consistency.
