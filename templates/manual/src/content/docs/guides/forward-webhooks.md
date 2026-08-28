---
title: Forward webhooks to your app
description: Run Tapeline in front of a local app, expose it with a tunnel, and debug real provider events without redeploying anything.
sidebar:
  order: 1
---

The most common Tapeline setup: your app runs on localhost, Tapeline sits in
front of it, and a tunnel gives the pair a public URL you paste into a
provider dashboard. Real sandbox events then arrive on your machine, get
recorded, and land in your handler — and when the handler fails, you fix the
code and replay the same event instead of triggering the provider again.

This guide uses a payment provider as the example, but the flow is identical
for any service that delivers webhooks.

## Before you begin

- Your app runs locally and has a webhook route. The examples assume
  `http://localhost:3000/webhooks`.
- The Tapeline CLI is [installed](/start/getting-started/#install-the-cli).
- You have any tunnel CLI available — `cloudflared`, `ngrok`, or whatever
  your team already uses. Tapeline itself never opens a public URL.

## 1. Start your app

Run your app as usual so the webhook route is live:

```bash title="Terminal — window 1"
npm run dev
```

## 2. Put Tapeline in front of it

In a second terminal, start the listener in forward mode:

```bash title="Terminal — window 2"
tapeline listen --forward http://localhost:3000/webhooks
```

```text title="Output"
✔ listening on http://127.0.0.1:8787/hooks
✔ forwarding to http://localhost:3000/webhooks
✔ recording to .tapeline/events.ndjson
```

From now on, every request that reaches `/hooks` is stored first, then
re-sent to your app with the method, path, headers, and body untouched. The
provider receives whatever status your app returns.

## 3. Expose the listener with a tunnel

Give the listener a public URL:

```bash title="Terminal — window 3"
cloudflared tunnel --url http://127.0.0.1:8787
```

The tunnel prints a public hostname. In your provider's dashboard, set the
webhook endpoint to that hostname plus the listener path:

```text title="Provider dashboard — webhook endpoint"
https://lucky-otter-demo.trycloudflare.com/hooks
```

## 4. Trigger a sandbox event

Use the provider's dashboard or test tooling to fire a sandbox event, then
watch it arrive:

```bash title="Terminal — window 2"
tapeline tail --follow
```

```text title="Output"
12:04:11  POST /hooks  payment.settled  → 200 in 41 ms  stored as evt_8xk2mp
```

A `200` from your app means the whole chain works: provider → tunnel →
Tapeline → handler.

## 5. Debug a failing handler

Here is the loop Tapeline exists for. Suppose the next event breaks your
handler:

```text title="Output"
12:05:02  POST /hooks  customer.updated  → 500 in 9 ms  stored as evt_9f3kq2
```

The event is already captured, so you do not need the provider anymore:

1. Read the failure in your app's logs and fix the code.
2. Replay the exact same event:

   ```bash title="Terminal — window 3"
   tapeline replay evt_9f3kq2
   ```

3. Repeat until the replay reports a `200`:

   ```text title="Output"
   ✔ replayed customer.updated → 200 in 18 ms
   ```

:::tip[Keep the tail window open]
`tapeline tail --follow` shows live deliveries and replays in one stream, so
you always see the newest attempt and its status without re-running anything.
:::

## Delivery behavior

- If your app is down or times out (`forward.timeout_ms`, default 5
  seconds), the delivery is marked failed in the tail output — but the event
  is still stored, so you can replay it once your app is back.
- Tapeline forwards events in the order they arrive and does not retry on
  its own. Retrying is an explicit `tapeline replay`, so you always know
  what hit your handler and when.
- Signature verification keeps working on forwards and replays because the
  original bytes are preserved. See the
  [FAQ note about timestamped signatures](/#frequently-asked-questions) for
  the one caveat.
