---
title: Replay and filter events
description: Find the exact captured event with tail filters, then replay one event, the latest failure, or a whole batch against your app.
sidebar:
  order: 2
---

Once a webhook is in the store, you can resend it whenever you like. This
guide covers finding the right event among hundreds of captures, replaying
it, and scripting bulk replays.

## Tail the store

`tapeline tail` prints captured events, newest last. Add `--follow` to keep
streaming as new events arrive:

```bash title="Terminal"
tapeline tail --last 5
```

```text title="Output"
11:58:24  POST /hooks  invoice.created   → 200 in 12 ms  stored as evt_1q8znu
12:01:37  POST /hooks  invoice.created   → 200 in 14 ms  stored as evt_4mc1vy
12:04:11  POST /hooks  payment.settled   → 200 in 41 ms  stored as evt_8xk2mp
12:05:02  POST /hooks  customer.updated  → 500 in 9 ms   stored as evt_9f3kq2
12:07:48  POST /hooks  payment.settled   → 200 in 38 ms  stored as evt_0tj5re
```

## Filter to the events you care about

Filters narrow the output; combining flags means *all* of them must match:

| Flag             | Matches                                                              |
| ---------------- | -------------------------------------------------------------------- |
| `--path <path>`  | Events captured on this URL path.                                     |
| `--header k=v`   | Events whose request carried this header value. Repeatable.           |
| `--status <n>`   | Events whose forward response had this status. Accepts `5xx` classes. |
| `--since <when>` | Events newer than a duration (`15m`, `2h`) or an ISO timestamp.       |
| `--last <n>`     | Only the newest *n* events after other filters apply.                 |

For example, every delivery your app failed in the last two hours:

```bash title="Terminal"
tapeline tail --status 5xx --since 2h
```

```text title="Output"
12:05:02  POST /hooks  customer.updated  → 500 in 9 ms  stored as evt_9f3kq2
```

## Replay one event

Pass the event id to resend it to the configured forward target:

```bash title="Terminal"
tapeline replay evt_9f3kq2
```

```text title="Output"
✔ replayed customer.updated → 200 in 18 ms
```

Replays send the stored request byte for byte — method, path, headers, and
body — so your handler sees exactly what the provider sent. Use `--target`
to aim a replay somewhere else without touching your configuration:

```bash title="Terminal"
tapeline replay evt_9f3kq2 --target http://localhost:4000/webhooks
```

## Replay the latest failure

`--last` combined with a filter is the fastest fix-and-retry loop — no ids
to copy:

```bash title="Terminal"
tapeline replay --last --status 5xx
```

This picks the newest event whose delivery failed and resends it. Exit code
`3` means nothing matched, which makes the command safe to use in scripts.

## Replay a batch

`tapeline export` writes matching events to stdout as NDJSON, one JSON
object per line. Pipe ids back into `replay` to resend a whole batch:

```bash title="Terminal"
tapeline export --status 5xx --since 1d --json \
  | jq -r '.id' \
  | xargs -n1 tapeline replay
```

## Script with --json

Every read command accepts `--json` for machine-readable output. A captured
event looks like this:

```json title="tapeline tail --last 1 --json"
{
  "id": "evt_9f3kq2",
  "receivedAt": "2026-08-28T12:05:02.114Z",
  "method": "POST",
  "path": "/hooks",
  "eventName": "customer.updated",
  "headers": {
    "content-type": "application/json",
    "x-provider-signature": "[redacted]"
  },
  "bodyBase64": "eyJ0eXBlIjoiY3VzdG9tZXIudXBkYXRlZCIsImlkIjoiY3VzXzE4MiJ9",
  "forward": {
    "target": "http://localhost:3000/webhooks",
    "status": 500,
    "durationMs": 9
  }
}
```

Bodies are base64-encoded so binary payloads survive the trip through JSON,
and redacted headers stay redacted in `--json` output too — the original
values live only in the store file.
