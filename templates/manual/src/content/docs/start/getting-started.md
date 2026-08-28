---
title: Getting started
description: Install the Tapeline CLI, capture your first webhook on your own machine, and forward events to the app you are building.
sidebar:
  order: 1
---

Tapeline is a local-first CLI for building and debugging webhook handlers.
You run a small listener on your machine, point webhook traffic at it, and
Tapeline records every request to an append-only store. From there you can
watch events arrive, forward them to your app, and replay any captured event
as many times as you need.

This page takes you from installation to your first forwarded event in about
five minutes.

## Requirements

- Node.js 22 or newer
- npm (bundled with Node.js)
- macOS, Linux, or Windows

## Install the CLI

```bash title="Terminal"
npm install --global tapeline
```

Check that the binary is on your path:

```bash title="Terminal"
tapeline --version
```

:::tip[Prefer not to install globally?]
Every command in these docs also works through `npx`, for example
`npx tapeline listen`. The first run downloads the package; after that it is
cached.
:::

## Capture your first event

Start a listener with no arguments to use the defaults — port `8787`, path
`/hooks`:

```bash title="Terminal — window 1"
tapeline listen
```

```text title="Output"
✔ listening on http://127.0.0.1:8787/hooks
✔ recording to .tapeline/events.ndjson
```

The listener accepts any HTTP method on `/hooks` and appends each request to
`.tapeline/events.ndjson` in your current directory. While nothing forwards
the event, Tapeline answers `202 Accepted` so senders treat the delivery as
successful.

Send yourself a test event from a second terminal:

```bash title="Terminal — window 2"
curl -X POST http://127.0.0.1:8787/hooks \
  -H "Content-Type: application/json" \
  -d '{"type":"ping","message":"hello tapeline"}'
```

Then look at what was captured:

```bash title="Terminal — window 2"
tapeline tail --last 1
```

```text title="Output"
12:04:11  POST /hooks  ping  → 202  stored as evt_2ah8vq
```

The event name column — `ping` here — is taken from the `type` field of a
JSON body when one exists, which matches the convention most providers use.
The `evt_` id is how you refer to this exact request later, for example when
[replaying it](/guides/replay-events/).

## Forward events to your app

Recording is useful on its own, but the everyday setup is Tapeline sitting in
front of the app you are building. Pass `--forward` with your local webhook
route:

```bash title="Terminal — window 1"
tapeline listen --forward http://localhost:3000/webhooks
```

Now every captured event is immediately re-sent to your app, and the tail
line shows your app's response status and latency instead of `202`:

```text title="Output"
12:06:47  POST /hooks  ping  → 200 in 41 ms  stored as evt_5rw0dn
```

:::note[Signatures survive forwarding]
Tapeline passes the method, path, headers, and body through untouched, so
signature verification in your handler keeps working exactly as it would in
production.
:::

## Receive events from a real provider

Tapeline never opens a public URL itself — it only binds to your machine. To
receive events from an external provider, put any tunnel you already use in
front of the listener:

```bash title="Terminal — window 2"
cloudflared tunnel --url http://127.0.0.1:8787
```

Paste the public URL the tunnel prints, plus the `/hooks` path, into your
provider's webhook settings. Events now flow provider → tunnel → Tapeline →
your app, and every one of them is captured on the way through. The
[forwarding guide](/guides/forward-webhooks/) walks through this end to end.

## Where to next

- [Configuration](/start/configuration/) — pin your setup in a `tapeline.toml`
  instead of repeating flags.
- [Forward webhooks to your app](/guides/forward-webhooks/) — the full
  provider-to-localhost workflow.
- [Replay and filter events](/guides/replay-events/) — find one event among
  hundreds and resend it.
