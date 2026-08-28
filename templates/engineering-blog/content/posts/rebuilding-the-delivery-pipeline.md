---
title: "The rebuild: a delivery pipeline that says no early"
date: 2026-02-10
author: "Tomás Rey"
tags: ["architecture", "backpressure", "rate-limiting"]
series: "Rebuilding delivery"
part: 2
---

Part one of this series told the story of November 3rd: one destination started rate-limiting us, our retries synchronized into sixty-second waves, and for 41 minutes every customer paid for it. The hotfix — jitter plus a quarantine lane for 429s — stopped the bleeding. This post is about the rebuild that followed: three months of work to make sure no single destination can ever own the pipeline again.

The design brief came straight out of the postmortem, and we pinned it to the top of the project doc as four sentences. A destination's failure must cost only that destination. Retries must never outrank first attempts. The queue must be a scheduler, not the source of truth. And operators must be able to change any limit during an incident without a deploy.

## Budgets, not best wishes

The old pipeline delivered as fast as workers could pull jobs, which meant the sending rate to any destination was an accident of load. The new one gives every destination an explicit budget: a token bucket, refilled at a configured rate, with a configured burst. A delivery attempt spends a token; no token, no attempt — the job simply is not due yet.

The bucket itself is deliberately boring:

```typescript
// delivery/tokenBucket.ts
export class TokenBucket {
  private tokens: number;
  private lastRefillMs: number;

  constructor(
    private readonly ratePerSecond: number,
    private readonly burst: number,
    nowMs = Date.now(),
  ) {
    this.tokens = burst;
    this.lastRefillMs = nowMs;
  }

  /** Spend one token if the budget allows an attempt right now. */
  take(nowMs = Date.now()): boolean {
    const elapsedSeconds = (nowMs - this.lastRefillMs) / 1000;
    this.tokens = Math.min(
      this.burst,
      this.tokens + elapsedSeconds * this.ratePerSecond,
    );
    this.lastRefillMs = nowMs;

    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }
}
```

The interesting part is what happens on `false`. The old pipeline would have parked the job in the shared queue to fight everyone else again in a few seconds. The new one computes the next time the destination will plausibly have a token and reschedules the job to exactly then. Between those two moments the job costs nothing: no worker touches it, no POST is made, no other customer waits behind it. A destination answering 429 drains its own budget and nobody else's.

Response codes feed back into the budget. A 429 or a timeout halves the refill rate; a run of 2xx responses walks it back up toward the configured ceiling. It is additive-increase, multiplicative-decrease — the same idea TCP has used for decades, applied per destination.

## The ledger owns the truth

November 3rd taught us that Redis at `maxmemory` is not a queue, it is a hostage situation. So the rebuild demoted Redis to what it is good at — waking workers up at the right moment — and moved the source of truth into Postgres, in a table we call the ledger:

```sql
CREATE TABLE delivery_ledger (
  event_id       uuid        NOT NULL,
  destination_id text        NOT NULL,
  attempt        smallint    NOT NULL DEFAULT 0,
  state          text        NOT NULL DEFAULT 'pending',
  not_before     timestamptz NOT NULL DEFAULT now(),
  last_status    smallint,
  PRIMARY KEY (destination_id, event_id)
);

-- One partial index serves the only hot query:
-- "what is due for this destination, oldest first?"
CREATE INDEX delivery_due
  ON delivery_ledger (destination_id, not_before)
  WHERE state IN ('pending', 'retrying');
```

Every state transition is a row update, so "pause destination" finally means what it says: one `UPDATE` flips every pending row to `paused`, including retries scheduled ten minutes out — the exact lever we reached for during the incident and found painted on. Resuming replays the ledger oldest-first, so a paused destination catches up in order instead of in a thundering herd. And if Redis vanishes entirely, we rebuild its schedule from the ledger in about ninety seconds. We know because we drill it monthly.

Exhausted deliveries land in a dead-letter state with their last status attached, visible to the customer in the dashboard, replayable with one click. Silence was the old failure mode; a labelled shelf is the new one.

## Limits are configuration, reviewed like code

During the incident, changing any of this behavior meant a deploy. Now the knobs live in one YAML file that ships to workers within thirty seconds of merging, no deploy involved:

```yaml
# delivery/limits.yaml — reviewed like any other change
defaults:
  rate_per_second: 50
  burst: 200
  max_attempts: 8

destinations:
  dst_9f31c: # large ERP integration; steady but strict WAF
    rate_per_second: 25
    burst: 50
  dst_04aa7: # flash-sale platform; spiky by design
    rate_per_second: 200
    burst: 2000
```

Putting overrides in reviewed configuration was contentious — two of us wanted a database table and an admin UI. The YAML won because the file *is* the audit log: every limit change has an author, a reviewer, and a timestamp, and `git blame` during an incident is faster than any UI we would actually build.

## Game day

Before rollout we replayed November 3rd against both pipelines in staging, complete with a fake WAF returning 429 at 600 requests per second. The old pipeline degraded within four minutes, exactly as it had in production. The new one halved the noisy destination's refill rate after nine seconds, parked it entirely after forty, and the p99 for every other destination moved by 41 milliseconds. The backlog for the throttled destination drained in order once the fake WAF relented.

Production has since seen three real destination brownouts. None of them paged anyone. The dashboard shows a destination quietly living within a shrunken budget, then recovering — which is what boring looks like, and boring was the entire point.

## What we would do differently

Two honest regrets from the project. First, we rebuilt the scheduler and the budgets in one program of work, and the size of that change made review genuinely hard; the token buckets could have shipped alone months earlier, sitting in front of the old queue, and would have blunted the original incident on their own. Ship the smallest thing that says no.

Second, we under-invested in the migration tooling until it hurt. Running old and new pipelines side by side meant double-delivering to a shadow environment and diffing outcomes, and the throwaway scripts we wrote for that became load-bearing for six weeks. If a migration plan says "temporary tooling," budget for it like a product, because for the duration of the cutover it is one.

If part one had a moral, it was that unbounded optimism compounds. The rebuild's moral is the inverse: a pipeline that can say *no* — early, precisely, and to exactly one tenant — never has to say sorry to all of them.
