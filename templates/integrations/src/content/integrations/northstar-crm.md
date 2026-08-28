---
name: Northstar CRM
category: CRM
icon: northstar
accent: mint
summary: Keep deal records, owners, and next steps aligned with every operational handoff.
trigger: Deal stage updated
action: Assign next workflow
useCases:
  - Start onboarding when a deal becomes won.
  - Escalate high-value opportunities without an owner.
  - Update CRM notes when delivery milestones finish.
setup:
  - Connect the right Northstar CRM team.
  - Select a deal event and map its owner and account fields.
  - Run a test deal through the route and publish it.
faqs:
  - question: Does Relay update existing contacts?
    answer: Yes. Match by a stable contact or account ID before applying mapped updates.
  - question: Can workflows react to custom fields?
    answer: Custom deal fields can trigger conditions when they are available to the connected account.
---
Northstar CRM connects the commercial record to work that happens after each deal event. Teams get a clear owner and next step without copying data between systems.
