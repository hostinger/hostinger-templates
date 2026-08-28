import type { ExampleTicket } from "@/types/model";

export const siteContent = {
  meta: {
    title: "Model — Local support triage",
    description: "A browser-only support-ticket classifier with inspectable deterministic rules.",
  },
  eyebrow: "Evaluation sheet / build 0.8.4",
  headline: "Triage support queues before they become backlogs.",
  intro:
    "Model labels incoming tickets, estimates urgency, and drafts a next action. This evaluation build runs entirely in your browser with deterministic keyword rules—no account, API key, or network request.",
  email: "early-access@model-labs.example",
  examples: [
    {
      label: "Duplicate charge",
      text: "I was charged twice for my annual plan this morning. Please refund the duplicate payment as soon as possible.",
    },
    {
      label: "Locked out",
      text: "I cannot log in after resetting my password. Our team demo starts in one hour and I urgently need access.",
    },
    {
      label: "Export bug",
      text: "CSV export keeps failing with an error on every project. We need the report for a client deadline today.",
    },
  ] satisfies ExampleTicket[],
  faq: [
    {
      question: "Does this demo send my ticket anywhere?",
      answer: "No. Classification runs in your browser using bundled keyword rules. No ticket text leaves the page.",
    },
    {
      question: "Is this a production machine-learning model?",
      answer: "No. It is a transparent product demo designed to show the workflow and interface with deterministic output.",
    },
    {
      question: "What can a production version connect to?",
      answer: "A production implementation could connect to your help desk, knowledge base, routing policies, and review queue.",
    },
    {
      question: "Can agents override a classification?",
      answer: "Yes. Human review and correction should remain part of any production support workflow.",
    },
  ],
} as const;
