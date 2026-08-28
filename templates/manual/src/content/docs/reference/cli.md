---
title: CLI reference
description: Synopsis, options, exit codes, and environment variables for every Tapeline command.
sidebar:
  order: 1
---

```text title="Synopsis"
tapeline <command> [options]
```

Four commands cover the whole workflow: `listen` captures, `tail` reads,
`replay` resends, and `export` hands events to other tools.

## Global options

These flags work on every command:

| Flag              | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| `--config <path>` | Use a specific `tapeline.toml` instead of searching for one.        |
| `--store <path>`  | Read from or write to this store file. Overrides `store.path`.      |
| `--json`          | Emit machine-readable JSON instead of formatted terminal output.    |
| `--quiet`         | Suppress non-error output. Useful in scripts that rely on exit codes. |
| `--no-color`      | Disable colored output. `NO_COLOR` in the environment does the same. |
| `--version`       | Print the CLI version and exit.                                     |
| `--help`          | Print usage for the CLI or for the given command.                   |

## tapeline listen

Start the local receiver and begin recording events.

```text title="Synopsis"
tapeline listen [options]
```

| Flag                | Default                    | Description                                                     |
| ------------------- | -------------------------- | ---------------------------------------------------------------- |
| `--port <n>`        | `8787`                     | Port to bind.                                                    |
| `--host <host>`     | `127.0.0.1`                | Interface to bind.                                               |
| `--path <path>`     | `/hooks`                   | URL path that accepts events; other paths return `404`.          |
| `--forward <url>`   | _unset_                    | Forward every captured event to this URL.                        |
| `--timeout-ms <n>`  | `5000`                     | Give up on a forward after this many milliseconds.               |

Without `--forward`, the listener answers `202 Accepted` and only records.
With it, your app's response status is passed back to the sender.

## tapeline tail

Print captured events, oldest first, newest last.

```text title="Synopsis"
tapeline tail [options]
```

| Flag             | Description                                                           |
| ---------------- | ---------------------------------------------------------------------- |
| `--follow`       | Keep the process running and stream new events as they arrive.         |
| `--last <n>`     | Only the newest *n* events after other filters apply.                   |
| `--path <path>`  | Filter by captured URL path.                                            |
| `--header k=v`   | Filter by a request header value. Repeat the flag to require several.   |
| `--status <n>`   | Filter by forward response status. Accepts classes such as `5xx`.       |
| `--since <when>` | Only events newer than a duration (`15m`, `2h`, `1d`) or ISO timestamp. |

## tapeline replay

Resend a captured event, byte for byte.

```text title="Synopsis"
tapeline replay [event-id] [options]
```

| Flag             | Description                                                             |
| ---------------- | ------------------------------------------------------------------------ |
| `--last`         | Replay the newest event matching the filters instead of naming an id.    |
| `--status <n>`   | With `--last`: consider only events whose delivery had this status.      |
| `--target <url>` | Send the replay to this URL instead of the configured forward target.    |
| `--dry-run`      | Print the request that would be sent without sending it.                 |

Either an `event-id` argument or `--last` is required. Replay responses are
recorded in the store, so a successful retry shows up in `tail` like any
other delivery.

## tapeline export

Write matching events to stdout as NDJSON — one JSON object per line, in the
same shape as [`tail --json`](/guides/replay-events/#script-with---json).

```text title="Synopsis"
tapeline export [options]
```

| Flag             | Description                                          |
| ---------------- | ----------------------------------------------------- |
| `--path <path>`  | Filter by captured URL path.                          |
| `--status <n>`   | Filter by forward response status, including classes. |
| `--since <when>` | Only events newer than a duration or ISO timestamp.   |

```bash title="Example — archive yesterday's failures"
tapeline export --status 5xx --since 1d > failures.ndjson
```

## Exit codes

All commands use the same codes, so scripts can branch on them reliably:

| Code | Meaning                                                                  |
| ---- | ------------------------------------------------------------------------ |
| `0`  | Success.                                                                  |
| `1`  | Runtime error — store unreadable, port already in use, target unreachable. |
| `2`  | Usage error — unknown flag, missing argument, malformed value.             |
| `3`  | No events matched the given filters.                                       |

## Environment variables

`TAPELINE_PORT`, `TAPELINE_HOST`, `TAPELINE_STORE`, `TAPELINE_FORWARD`, and
`NO_COLOR` override their configuration counterparts — see
[Configuration → Environment variables](/start/configuration/#environment-variables)
for the full table and precedence rules.
