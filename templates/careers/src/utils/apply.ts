import type { Role } from "~/types/content";

/**
 * Builds the apply mailto for a role, pre-filled with the role title.
 * Every mailto on the site is built from the same address displayed on
 * the page (site.json → email).
 */
export function buildApplyMailto(email: string, role: Role): string {
  const subject = `Application — ${role.title}`;
  const body = [
    `Role: ${role.title} (${role.team})`,
    "",
    "A few lines about you:",
    "",
    "",
    "A link to something you've made, shipped, or fixed:",
    "",
  ].join("\n");
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Pre-filled question email for a specific role. */
export function buildQuestionMailto(email: string, role: Role): string {
  const subject = `Question — ${role.title}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

/** Plain hello email used by the nav, the empty state, and the footer. */
export function buildHelloMailto(email: string): string {
  const subject = "Saying hi from the careers page";
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
