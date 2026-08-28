---
title: Payload transforms, now in TypeScript
date: 2026-07-16
version: 2.18.0
tags: [feature, improvement]
---
Transforms let you reshape an event before it reaches an endpoint — rename fields, drop internal identifiers, or flatten a payload for a legacy consumer. They were previously written in a small JSON mapping language that nobody loved. As of this release, a transform is just a TypeScript function, edited in the dashboard with full type checking against your event schema:

```ts
export default function transform(event: RelaycastEvent): DeliveryPayload {
  return {
    id: event.id,
    type: event.type,
    order: {
      id: event.data.orderId,
      total: event.data.amounts.grandTotal,
    },
  };
}
```

The editor generates types from your last 500 events, so autocomplete knows what `event.data` actually looks like in your account, and the **Test** tab runs your transform against recent real events before you publish it. Publishing is versioned — every delivery records which transform version shaped it, and you can roll back from the same panel.

Under the hood, transforms moved from a pooled interpreter to per-account V8 isolates. The p99 transform overhead dropped from around 40 ms to under 10 ms, and one account's runaway transform can no longer slow anyone else's deliveries. Existing JSON mappings keep working and can be converted to TypeScript with one click.
