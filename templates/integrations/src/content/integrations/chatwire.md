---
name: Chatwire
category: Communication
icon: chatwire
accent: mint
summary: Send the right workflow update to team channels while keeping noisy events out.
trigger: Workflow status changes
action: Send channel message
useCases:
  - Alert sales when a qualified lead is ready.
  - Post compact incident updates to an operations channel.
  - Ask an owner to review a stalled approval.
setup:
  - Connect a Chatwire workspace with message access.
  - Pick a channel and compose the update from Relay fields.
  - Preview the message and activate the route.
faqs:
  - question: Can messages include links?
    answer: Yes. Add record and workflow URLs to take teammates directly to the next action.
  - question: Can I route messages by team?
    answer: Use Relay conditions to choose different Chatwire channels from region, owner, or priority.
---
Chatwire turns workflow events into focused team updates. Conditional routes make sure each channel receives only the context its members need.
