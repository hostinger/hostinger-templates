---
name: Cloudbox
category: Storage
icon: cloudbox
accent: purple
summary: File completed documents into consistent folders with names your whole team can find.
trigger: Document approved
action: Store and share file
useCases:
  - Archive signed agreements by customer and year.
  - Create a project folder when onboarding begins.
  - Share final assets with a delivery team.
setup:
  - Connect the Cloudbox account that owns your shared folders.
  - Choose a destination and define a naming pattern.
  - Test with a sample file before enabling the workflow.
faqs:
  - question: Can Relay avoid duplicate files?
    answer: Include a unique record ID in the filename and choose replace or skip behavior.
  - question: Can workflows create folders?
    answer: Yes. A route can create nested customer or project folders before saving a file.
---
Cloudbox keeps workflow outputs organized after approval. Dynamic folder paths make the archive predictable without manual cleanup.
