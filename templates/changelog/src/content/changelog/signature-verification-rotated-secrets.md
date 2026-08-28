---
title: Signature verification during secret rotation
date: 2026-08-07
version: 2.18.2
tags: [fix]
---
A sharp-eyed customer reported that deliveries retried *across* a secret rotation could arrive signed with the retired secret after the 24-hour grace window ended. The cause: retries reused the signature computed at first attempt instead of re-signing at send time. If your consumer only checked the current secret, those late retries failed verification and looked like tampering.

Retries are now re-signed with the endpoint's current secret at the moment they leave our edge, and during the grace window both the current and previous secrets validate. If you use the SDK, verification already checks every secret you pass:

```ts
import { verifySignature } from '@relaycast/sdk';

const event = verifySignature(rawBody, request.headers['x-relaycast-signature'], {
  secrets: [process.env.RELAYCAST_SECRET, process.env.RELAYCAST_SECRET_PREVIOUS],
});
```

No action is needed on SDK 3.4 or later. If you verify the HMAC by hand, make sure you accept either secret for the duration of a rotation — the `t=` timestamp in the header tells you which window a delivery belongs to.
