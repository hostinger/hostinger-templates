---
name: Ledgerly
category: Finance
icon: ledgerly
accent: purple
summary: Keep approved expenses and customer payments moving into your books without duplicate entry.
trigger: Payment received
action: Create ledger entry
useCases:
  - Post paid invoices to the correct revenue account.
  - Route expenses above a threshold into an approval workflow.
  - Notify finance when reconciliation needs attention.
setup:
  - Choose the Ledgerly workspace and reporting currency.
  - Map Relay customer, tax, and payment fields to ledger accounts.
  - Send a test entry, then turn on the workflow.
faqs:
  - question: Can Relay create draft entries?
    answer: Yes. Choose draft mode during field mapping so finance can review entries before posting.
  - question: Are refunds supported?
    answer: Refund events can start a separate workflow and create a reversing entry in Ledgerly.
---
Ledgerly gives finance teams a reliable handoff between operational workflows and the general ledger. Use clear field mapping and review steps to keep every automated entry explainable.
