---
title: No more duplicate deliveries after endpoint timeouts
date: 2026-06-24
version: 2.17.3
tags: [fix, improvement]
---
If an endpoint responded a moment *after* our 10-second delivery timeout, Relaycast marked the attempt failed and scheduled a retry — but the endpoint had actually processed the event. Result: a duplicate delivery a minute later. This bit hardest on consumers doing slow synchronous work such as PDF generation or third-party API calls.

Two changes close the gap. First, every delivery now carries a `Relaycast-Idempotency-Key` header that stays identical across retries and replays, so consumers can deduplicate with a single unique index:

```http
POST /webhooks/orders HTTP/1.1
Relaycast-Idempotency-Key: dl_9f2c81e7a4
X-Relaycast-Signature: t=1750765200,v1=4c1d22e0b1…
Content-Type: application/json
```

Second, a late `2xx` that arrives within 60 seconds of the timeout now marks the delivery as delivered and cancels the pending retry, so well-behaved-but-slow endpoints stop seeing duplicates entirely.

While we were in the retry scheduler we also added jitter to the backoff curve. Retries for a burst of failures used to land in synchronized waves that could knock a recovering endpoint straight back over; they are now spread across each retry window.
