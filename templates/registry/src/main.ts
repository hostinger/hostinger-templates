import { createApp } from 'vue';
import App from './App.vue';
import { site } from './content/site';
import './styles/foundation.css';
import './styles/sections.css';
import './styles/responsive.css';

// FAQPage structured data, built from the same content shown on the page.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: site.faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const jsonLdScript = document.createElement('script');
jsonLdScript.type = 'application/ld+json';
jsonLdScript.textContent = JSON.stringify(faqJsonLd);
document.head.appendChild(jsonLdScript);

createApp(App).mount('#app');
