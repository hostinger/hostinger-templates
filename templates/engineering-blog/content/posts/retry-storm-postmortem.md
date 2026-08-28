---
title: "Postmortem: the retry storm that slowed webhook delivery for 41 minutes"
date: 2025-11-18
author: "Mara Iversen"
tags: ["incident-review", "queues", "reliability"]
series: "Rebuilding delivery"
part: 1
---

On November 3rd, between 09:12 and 09:53 UTC, webhook delivery at Halyard degraded badly. Most customers saw end-to-end latencies climb from under two seconds to several minutes, and for twelve of those minutes our ingestion API rejected about six percent of enqueue requests. No events were lost. Roughly 3.1 million deliveries arrived late, and 214,000 enqueues had to be retried by client SDKs.

The trigger was a single destination returning `429 Too Many Requests` to every attempt. The reason a routine failure became an outage was entirely ours: a retry policy that synchronized failures into waves, and a queue design that let one destination's bad morning become everyone's. This post is the full account. Part two of this series covers the pipeline we rebuilt afterwards.

## Background

Halyard delivers webhooks on behalf of commerce and billing platforms — about nine million a day. Producers write events to our API, we enqueue one delivery job per destination endpoint, and a fleet of workers pops jobs, POSTs the payload, and either acknowledges the job or schedules a retry.

The detail that matters for this story: until November 3rd, first attempts and retries shared a single Redis-backed queue, with a single priority. A destination failing for the fourth time was indistinguishable from a healthy destination that had not been tried yet. That design survived three years of ordinary failures. It did not survive a correlated one.

## Timeline

All times UTC, from the incident channel and dashboards.

- **09:12** — A large destination begins answering every POST with 429, at roughly 600 requests per second. We later learned their platform team had tightened a WAF rule that morning.
- **09:14** — Retry traffic doubles queue ingress. Depth grows from a steady 4,100 jobs to 60,000 in two minutes.
- **09:19** — On-call is paged by the fast-burn alert on the delivery-latency SLO.
- **09:26** — Queue inspection points at one destination. The query and its output are below.
- **09:31** — We pause the destination — and discover the pause flag only gates *new* enqueues. More than a million retry jobs already scheduled keep firing.
- **09:41** — Redis reaches `maxmemory`. Enqueues start failing, and the ingestion API begins returning 503s.
- **09:47** — A hotfix deploys: retries for 429 responses move to a separate, slowly drained lane, and backoff jitter is enabled everywhere.
- **09:53** — Queue age falls back to single-digit seconds. Delivery p99 recovers.
- **10:20** — Incident closed after stable dashboards; backlog fully drained by 11:05.

## Root cause

The arithmetic fits in one function. This was our backoff, exactly as deployed that morning:

```typescript
// delivery/backoff.ts — as it looked on November 3rd
const BASE_DELAY_MS = 2_000;
const MAX_DELAY_MS = 60_000;

export function nextAttemptDelay(attempt: number): number {
  // attempt 1 → 2s, attempt 2 → 4s ... attempt 6 and later → 60s
  return Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
}
```

It is exponential, it is capped, and it is completely deterministic. Every job that fails in the same second retries in the same second. After six attempts, every delay collapses to exactly sixty seconds. When the WAF started rejecting 600 requests per second, those failures phase-locked into waves: a wall of retries would land on the destination, collect a wall of 429s, and reschedule itself — intact — sixty seconds into the future, picking up new first attempts along the way.

By 09:26 the waves were visible from orbit. This is the query we ran against the delivery store, with the output pasted from the incident channel:

```sql
-- Which destinations own the queue right now?
SELECT destination_id,
       count(*)                            AS queued,
       min(next_attempt_at)                AS oldest_due,
       count(*) FILTER (WHERE attempt > 3) AS deep_retries
FROM delivery_jobs
WHERE state = 'queued'
GROUP BY destination_id
ORDER BY queued DESC
LIMIT 3;

-- destination_id | queued    | oldest_due          | deep_retries
-- dst_9f31c      | 1,214,700 | 2025-11-03 09:14:09 | 1,020,113
-- dst_2210a      |     4,830 | 2025-11-03 09:40:56 |         12
-- dst_77e0d      |     3,112 | 2025-11-03 09:41:02 |          4
```

One destination held 99.3 percent of the queue. Because retries shared the lane with first attempts, workers spent almost their entire capacity POSTing to an endpoint that was answering "please stop" — and every healthy customer's events queued behind that effort.

## Contributing factors

Four things turned a failing endpoint into a customer-visible incident:

1. **Retries competed with first attempts.** One shared queue meant head-of-line blocking at exactly the moment retries were least useful.
2. **We treated 429 like a 5xx.** A 429 is the destination telling us the rate, and our policy answered by retrying at the same rate. Rate-limit responses deserved a slower, capped lane from day one.
3. **The pause flag had never been used in anger.** It gated ingress but not already-scheduled retries, which is the half of the problem that matters mid-incident.
4. **Redis was sized for twenty times normal depth.** We hit three hundred times. When `maxmemory` arrived, the failure jumped the blast radius from "slow deliveries" to "failed enqueues."

## What we changed the same day

The hotfix that ended the incident made two changes. The first was jitter — the smallest diff with the largest effect:

```diff
 export function nextAttemptDelay(attempt: number): number {
-  return Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
+  const ceiling = Math.min(BASE_DELAY_MS * 2 ** (attempt - 1), MAX_DELAY_MS);
+  // Full jitter: each retry lands at a random point inside the window,
+  // so correlated failures cannot re-synchronize into waves.
+  return Math.ceil(Math.random() * ceiling);
 }
```

The second routed every retry triggered by a 429 into a per-destination lane drained at two concurrent requests. The waves lost their structure within one backoff cycle, and the queue spent the next hour quietly digesting the backlog in order.

Jitter is a well-known fix, and we knew about it too. It had been in the backlog, politely, for two years — filed as an optimization rather than what it actually was: a correctness bug with a sixty-second fuse.

## What happens next

The deeper lesson is not "add jitter." It is that our pipeline had no way to say *no* early. Nothing bounded how much work one destination could schedule, retries could crowd out fresh work, and our only mid-incident lever turned out to be decorative. Part two describes the rebuild: a token-bucket budget for every destination, retries that can never outrank first attempts, and a ledger that lets us pause anything — instantly, including work already scheduled.
