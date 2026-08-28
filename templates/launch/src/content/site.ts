export const siteContent = {
  meta: {
    title: "Launch — Make your release the headline",
    description:
      "Launch gives product teams one focused room to shape the story, organize proof, and ship a release worth noticing.",
  },
  brand: "LAUNCH",
  navigation: [
    { label: "Story", href: "#story" },
    { label: "Proof", href: "#proof" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  headerCta: { label: "Get early access", href: "#waitlist" },
  hero: {
    issue: "Issue No. 01 — Product teams edition",
    kicker: "Your next release deserves front-page energy.",
    title: "MAKE IT THE HEADLINE.",
    body: "Launch turns scattered docs, half-finished claims, and noisy handoffs into one crisp campaign your whole team can rally around.",
    primaryCta: "Build launch momentum",
    secondaryCta: "See the evidence",
    ticker:
      "STORY LOCKED  •  PROOF READY  •  TEAM ALIGNED  •  LAUNCH DAY CLEAR  •",
  },
  productVisual: {
    label: "Live launch room",
    campaign: "Orbit 2.0",
    status: "82% launch ready",
    statLabels: ["Proof points", "Reviewers", "Days left"],
    stats: ["12", "08", "06"],
    tasks: ["Positioning approved", "Customer proof selected", "Press kit in review"],
  },
  story: {
    eyebrow: "The story behind the story",
    title: "Launch day should not feel like group-project chaos.",
    body: "The strongest products still disappear when their story arrives late. Launch gives the work a newsroom: one place to sharpen the angle, collect proof, assign owners, and keep every message on deadline.",
    note: "Built for founders, marketers, and product teams who would rather make news than chase status updates.",
  },
  proof: {
    eyebrow: "The early edition",
    title: "Less launch theatre. More launch signal.",
    stats: [
      { value: "3.4×", label: "faster campaign sign-off" },
      { value: "91%", label: "of launch tasks visible" },
      { value: "6 hrs", label: "saved per release week" },
    ],
    quote:
      "We went from eleven docs and three nervous channels to one launch room. Everyone knew the story—and exactly what shipped next.",
    attribution: "Mara Chen, VP Product at Northstar",
  },
  process: {
    eyebrow: "How the issue gets made",
    title: "From rough angle to ready-to-run.",
    steps: [
      {
        number: "01",
        title: "Find the angle",
        body: "Frame the audience, tension, promise, and product truth before drafting a single announcement.",
      },
      {
        number: "02",
        title: "Stack the proof",
        body: "Bring customer quotes, outcomes, screenshots, and hard numbers into one evidence board.",
      },
      {
        number: "03",
        title: "Run the room",
        body: "Assign the timeline, gather decisions, and publish with every owner working from the same edition.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pick your edition",
    title: "A plan for every kind of splash.",
    intro: "Start lean. Move up when your launch room gets louder.",
    recommended: "Editor’s pick",
    comparisonTitle: "Read the fine print.",
    included: "Included",
    unavailable: "Not included",
  },
  faq: {
    eyebrow: "Asked on deadline",
    title: "Questions, answered.",
    items: [
      {
        question: "Is Launch a project management tool?",
        answer:
          "Not quite. Launch is purpose-built for release storytelling and coordination. It keeps positioning, proof, approvals, and campaign milestones together without replacing your engineering tracker.",
      },
      {
        question: "Can I switch plans later?",
        answer:
          "Yes. You can move between plans as your team and launch calendar change. Annual prices shown here are monthly equivalents billed for a full year.",
      },
      {
        question: "Does the waitlist create an account?",
        answer:
          "No. This demo opens your email app with a pre-filled early-access request. Nothing is submitted or stored by this static site.",
      },
      {
        question: "Can agencies use Launch for clients?",
        answer:
          "Yes. Separate launch rooms help agencies keep campaign stories, reviewers, and deadlines distinct. The Headline plan supports the broadest multi-brand setup.",
      },
    ],
  },
  waitlist: {
    eyebrow: "Late-breaking opportunity",
    title: "Be first to make the news.",
    body: "Join the early-access list. We will send launch notes, product previews, and your invitation when the newsroom opens.",
    emailLabel: "Work email",
    emailPlaceholder: "you@company.com",
    submitLabel: "Open email request",
    note: "This button opens your email app. No data is sent from this website.",
    mailto: "hello@launch.example",
    mailSubject: "Launch early access request",
  },
  footer: {
    line: "A sharper room for bigger releases.",
    copyright: "© 2026 Launch. Built for the next big thing.",
    links: [
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Email us", href: "mailto:hello@launch.example" },
    ],
  },
} as const;
