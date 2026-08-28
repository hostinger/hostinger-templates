---
name: Helpnest
category: Support
icon: helpnest
accent: purple
summary: Turn escalations and resolved conversations into visible cross-team follow-through.
trigger: Support tag added
action: Open assigned workflow
useCases:
  - Escalate product-impacting reports with full context.
  - Start a retention review for at-risk customers.
  - Close follow-up tasks when a conversation resolves.
setup:
  - Connect the Helpnest inbox used by your support team.
  - Choose a tag event and map conversation context.
  - Tag a test conversation and verify the assignee.
faqs:
  - question: Can private notes be included?
    answer: Only fields allowed by the connected Helpnest account should be mapped into Relay.
  - question: Can Relay update the conversation?
    answer: A completion route can add a note or tag so support sees the workflow outcome.
---
Helpnest gives support escalations an accountable route beyond the inbox. Relay carries the customer context while assigning the next owner.
