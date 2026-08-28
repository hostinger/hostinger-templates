---
title: Configuration
description: Every tapeline.toml option and environment variable, plus the order Tapeline resolves settings in.
sidebar:
  order: 2
---

Tapeline works with zero configuration — the defaults in the table below are
what `tapeline listen` uses out of the box. A `tapeline.toml` file becomes
worthwhile once you want the whole team to share the same ports, forward
target, and redaction rules without memorizing flags.

## The tapeline.toml file

Tapeline looks for `tapeline.toml` in the current working directory, then in
each parent directory up to your home directory. The first file found wins;
files are never merged.

```toml title="tapeline.toml"
[listen]
port = 8787
host = "127.0.0.1"
path = "/hooks"

[store]
path = ".tapeline/events.ndjson"
max_events = 5000

[forward]
target = "http://localhost:3000/webhooks"
timeout_ms = 5000

[redact]
headers = ["authorization", "x-api-key"]
```

## All options

| Key                  | Type          | Default                       | Description                                                                                  |
| -------------------- | ------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `listen.port`        | integer       | `8787`                        | Port the local receiver binds to.                                                             |
| `listen.host`        | string        | `"127.0.0.1"`                 | Interface to bind. Use `"0.0.0.0"` to accept traffic from other devices on your network.      |
| `listen.path`        | string        | `"/hooks"`                    | URL path that accepts events. Requests to any other path get a `404` and are not stored.      |
| `store.path`         | string        | `".tapeline/events.ndjson"`   | Append-only NDJSON file where captured events are written, one JSON object per line.          |
| `store.max_events`   | integer       | `5000`                        | Size cap for the store. Once reached, the oldest events are dropped as new ones arrive.       |
| `forward.target`     | string        | _unset_                       | URL every captured event is forwarded to. When unset, Tapeline records but does not forward.  |
| `forward.timeout_ms` | integer       | `5000`                        | How long to wait for your app's response before marking the delivery as failed.               |
| `redact.headers`     | string array  | `["authorization"]`           | Header names whose values `tail` and `export` print as `[redacted]`. Matching ignores case.   |

## Environment variables

Each variable overrides one configuration key, which makes them handy in
`package.json` scripts and CI jobs:

| Variable           | Overrides        | Example                                  |
| ------------------ | ---------------- | ---------------------------------------- |
| `TAPELINE_PORT`    | `listen.port`    | `TAPELINE_PORT=9000 tapeline listen`     |
| `TAPELINE_HOST`    | `listen.host`    | `TAPELINE_HOST=0.0.0.0 tapeline listen`  |
| `TAPELINE_STORE`   | `store.path`     | `TAPELINE_STORE=/tmp/events.ndjson`      |
| `TAPELINE_FORWARD` | `forward.target` | `TAPELINE_FORWARD=http://localhost:3000` |
| `NO_COLOR`         | —                | Disables colored output when set to any value. |

## Precedence

When the same setting is defined in more than one place, Tapeline resolves it
in this order:

1. Command-line flags, such as `--port`
2. Environment variables
3. `tapeline.toml`
4. Built-in defaults

So `TAPELINE_PORT=9000 tapeline listen --port 9100` listens on `9100`.

:::caution[The store contains real payloads]
`redact.headers` masks values in terminal output only. The store file keeps
the original bytes so that replays stay byte-for-byte faithful — including
`Authorization` headers and signing secrets inside payloads. Add `.tapeline/`
to your `.gitignore` and treat the store like any other local credential
file.
:::
