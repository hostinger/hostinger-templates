// Build-time rendering: injects src/data JSON into index.html so the whole
// board is readable without JavaScript. src/main.ts only hydrates the vote
// pills on top of this markup.
const roadmap = require('./src/data/roadmap.json');
const site = require('./src/data/site.json');

const fill = (template, values) =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );

const columns = roadmap.columns.map((column) => {
  const items = roadmap.items
    .filter((item) => item.status === column.id)
    .map((item) => ({
      ...item,
      voteLabel: fill(site.board.voteLabelTemplate, {
        title: item.title,
        count: String(item.baseVotes),
      }),
    }));
  return {
    ...column,
    items,
    itemCountLabel: fill(site.board.itemCountTemplate, { count: String(items.length) }),
  };
});

const suggestHref = `mailto:${site.email}?subject=${encodeURIComponent(
  fill(site.suggest.subject, { product: site.name }),
)}&body=${encodeURIComponent(fill(site.suggest.body, { product: site.name }))}`;

const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: site.faq.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

module.exports = {
  plugins: {
    'posthtml-expressions': {
      locals: { site, columns, suggestHref, faqJsonLd },
    },
  },
};
