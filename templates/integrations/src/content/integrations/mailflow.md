---
name: Mailflow
category: Marketing
icon: mailflow
accent: mint
summary: Add customers to timely lifecycle messages when real workflow milestones happen.
trigger: Customer milestone reached
action: Add to message sequence
useCases:
  - Welcome customers after onboarding completes.
  - Pause campaigns when an account needs attention.
  - Trigger education based on an adopted feature.
setup:
  - Connect a Mailflow audience and confirm consent rules.
  - Select a sequence and map customer attributes.
  - Test with an internal contact, then activate.
faqs:
  - question: Does Relay manage marketing consent?
    answer: Your Mailflow setup remains the source of truth. Add conditions so only eligible contacts enter a sequence.
  - question: Can a workflow remove a contact?
    answer: Yes. Use a separate route to remove or suppress contacts when account status changes.
---
Mailflow aligns lifecycle communication with real customer progress. Milestone-based routes keep messages relevant and consent rules visible.
