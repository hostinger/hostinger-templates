import type { Category, Classification, Urgency } from "@/types/model";

const categoryRules: Record<Category, string[]> = {
  Billing: ["charge", "charged", "refund", "invoice", "payment", "billing", "card"],
  "Account access": ["login", "log in", "password", "locked", "access", "sign in", "2fa"],
  "Bug report": ["bug", "error", "failing", "fails", "broken", "crash", "not working"],
  "Product question": ["how", "can i", "feature", "support", "possible", "where", "question"],
};

const urgencyRules = {
  Critical: ["security", "breach", "data loss", "outage", "all users", "production down"],
  High: ["urgent", "as soon as possible", "today", "deadline", "one hour", "blocked", "every"],
};

const actions: Record<Category, string> = {
  Billing: "Verify the payment ledger, identify any duplicate transaction, and route to Billing Ops.",
  "Account access": "Confirm account ownership, review recent auth events, and start the secure recovery flow.",
  "Bug report": "Capture reproduction details, affected scope, and error context before routing to Engineering.",
  "Product question": "Search the product guide and send the most relevant setup steps or limitation.",
};

export function classifyTicket(input: string): Classification {
  const normalized = input.toLowerCase();
  const scores = Object.entries(categoryRules).map(([category, keywords]) => ({
    category: category as Category,
    matches: keywords.filter((keyword) => normalized.includes(keyword)),
  }));
  scores.sort((a, b) => b.matches.length - a.matches.length);

  const best = scores[0];
  const criticalMatches = urgencyRules.Critical.filter((word) => normalized.includes(word));
  const highMatches = urgencyRules.High.filter((word) => normalized.includes(word));
  const urgency: Urgency = criticalMatches.length ? "Critical" : highMatches.length ? "High" : "Normal";
  const category = best.matches.length ? best.category : criticalMatches.length ? "Bug report" : "Product question";
  const signals = [...best.matches, ...criticalMatches, ...highMatches].slice(0, 4);
  const confidence = Math.min(96, 62 + best.matches.length * 8 + (signals.length > 2 ? 5 : 0));

  return {
    category,
    urgency,
    confidence,
    signals: signals.length ? signals : ["general inquiry"],
    nextAction: actions[category],
    responseDraft: `Thanks for flagging this. We classified your request as ${category.toLowerCase()} with ${urgency.toLowerCase()} urgency. Our next step is to ${actions[category].charAt(0).toLowerCase()}${actions[category].slice(1)} We’ll keep you updated as we review it.`,
  };
}
