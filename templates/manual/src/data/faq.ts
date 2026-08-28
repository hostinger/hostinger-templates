/**
 * FAQ copy for the landing page.
 *
 * `FaqSection.astro` renders these entries as an accessible accordion and
 * injects matching FAQPage JSON-LD, so edit questions and answers here only.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Does Tapeline send my webhook data anywhere?',
    answer:
      'No. Tapeline is local-first: the listener runs on your machine and every captured event is written to a plain-text store in your project directory. Nothing is uploaded, and deleting the store file deletes the data.',
  },
  {
    question: 'Do I still need a tunnel like ngrok or cloudflared?',
    answer:
      'Yes, if the events come from an external provider. Tapeline is the local receiver, recorder, and replayer — it pairs with any tunnel that can point a public URL at your machine. For events you send yourself with curl or a test script, no tunnel is needed.',
  },
  {
    question: 'Will signature verification still work on replays?',
    answer:
      'Yes. Replays resend the original request byte for byte, including the signature header, so verification code sees exactly what the provider sent. One caveat: providers that embed a timestamp in the signature may reject very old events, so replay recent captures or relax the tolerance in your development configuration.',
  },
  {
    question: 'Can I feed these docs to an AI coding assistant?',
    answer:
      'That is a built-in feature of the docs site. Every page has a "Copy page as Markdown" button next to its title, and the same content is served as plain Markdown under /raw/ — for example /raw/reference/cli.md — so assistants get clean context instead of scraped HTML.',
  },
];
