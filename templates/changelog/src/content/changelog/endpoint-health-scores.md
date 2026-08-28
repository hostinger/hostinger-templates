---
title: Endpoint health scores and auto-pause
date: 2026-06-01
version: 2.17.0
tags: [feature]
---
Every endpoint now shows a health score from 0 to 100, computed over a trailing six-hour window from three inputs:

- **Success rate** — the share of deliveries acknowledged with a `2xx`
- **Response latency** — p95 time to first byte from your endpoint
- **Retry pressure** — how much of the endpoint's traffic is retries rather than first attempts

Healthy endpoints sit in the 90s and you never think about them. When a score drops below your pause threshold (default 20), Relaycast stops hammering the failing endpoint, holds its queue for up to 72 hours, and notifies you by email or Slack. Held deliveries replay in order the moment you resume — nothing is lost while your consumer is down.

Auto-pause emits a webhook of its own, so you can wire it into your incident tooling:

```json
{
  "type": "endpoint.paused",
  "data": {
    "endpoint": "ep_live_checkout",
    "healthScore": 12,
    "reason": "success_rate_below_threshold",
    "heldDeliveries": 3141
  }
}
```

Scores appear on the endpoint list, on each endpoint's detail page, and in the API. Thresholds are configurable per endpoint, and you can disable auto-pause entirely for endpoints where a thundering herd is someone else's problem.
