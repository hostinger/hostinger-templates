---
title: Bulk replay from the delivery timeline
date: 2026-08-26
version: 2.19.0
tags: [feature]
---
Until today, replaying failed deliveries meant clicking through them one at a time — fine for a blip, miserable after an incident. The delivery timeline now has checkboxes. Filter by endpoint, status, and time range, select up to 500 deliveries, and hit **Replay selected**. Deliveries are re-sent in their original order, and every replay carries the same idempotency key as the first attempt so a consumer that already processed an event can safely drop the duplicate.

The same operation is available from the CLI, which is where most of you will want it after a long outage window:

```bash
relaycast replay --endpoint checkout-live \
  --status failed \
  --since 2026-08-25T00:00:00Z
```

Replays respect each endpoint's rate limit and run through the normal retry pipeline, so a replay can never stampede an endpoint that is still recovering. A progress panel shows sent, acknowledged, and failed counts as the batch drains, and an **Abort** button stops the remainder instantly.

Every bulk replay is recorded in the audit log with who started it, the filter that selected the deliveries, and the final counts — useful when you are writing the post-incident review an hour later.
