import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const renderer = {
  code({ text, lang }: { text: string; lang?: string }): string {
    const language = lang && Prism.languages[lang] ? lang : 'plaintext';
    const grammar = Prism.languages[language];
    const highlighted = grammar
      ? Prism.highlight(text, grammar, language)
      : escapeHtml(text);

    return `<div class="gatsby-highlight" data-language="${escapeHtml(language)}"><pre class="language-${escapeHtml(language)}"><code class="language-${escapeHtml(language)}">${highlighted}</code></pre></div>`;
  },
};

marked.use({ renderer });

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export function excerptFromMarkdown(markdown: string, length = 200): string {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, ' ');
  const plain = withoutCode
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[#>*_`[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= length) return plain;
  return `${plain.slice(0, length).trimEnd()}…`;
}
