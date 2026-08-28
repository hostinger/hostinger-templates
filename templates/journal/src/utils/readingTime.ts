const WORDS_PER_MINUTE = 220;

const markdownToWords = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|=-]/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim();

export const getReadingStats = (markdown: string) => {
  const text = markdownToWords(markdown);
  const words = text ? text.split(/\s+/u).filter(Boolean).length : 0;

  return {
    words,
    minutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
  };
};
