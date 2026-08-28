<script lang="ts">
  import { chapter, fillTemplate } from '../lib/chapter';
  import { loadPosition } from '../lib/reader';
  import { site } from '../lib/site';
  import BookCover from './BookCover.svelte';

  const position = loadPosition();
  const percent = position === null ? 0 : Math.round(position.progress * 100);
  const inProgress = percent >= 2 && percent < 98;
  const finished = percent >= 98;
  const readLabel = inProgress ? site.hero.continueLabel : site.hero.readLabel;
  const metaLine = fillTemplate(site.reader.metaTemplate, {
    words: chapter.wordCount,
    minutes: chapter.minutes,
  });
</script>

<section class="hero" id="book" aria-labelledby="book-title">
  <div class="hero__inner">
    <div class="hero__cover">
      <BookCover book={site.book} />
    </div>
    <div class="hero__body">
      <p class="eyebrow">{site.hero.eyebrow}</p>
      <h1 id="book-title" class="hero__title">{site.book.title}</h1>
      <p class="hero__tagline">{site.book.tagline}</p>
      <p class="hero__meta">
        <span>{site.book.genre}</span>
        <span>{site.book.length}</span>
        <span>{site.book.imprint}, {site.book.year}</span>
      </p>
      <div class="hero__actions">
        <a class="button button--primary" href="#read">{readLabel}</a>
        <a
          class="button button--outline"
          href={site.buy.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {site.buy.label}<span aria-hidden="true"> ↗</span>
        </a>
      </div>
      {#if inProgress}
        <p class="hero__chip">
          <span class="hero__chip-dot" aria-hidden="true"></span>
          {percent}% {site.hero.progressChipSaved}
        </p>
      {:else if finished}
        <p class="hero__chip">
          <span class="hero__chip-dot" aria-hidden="true"></span>
          {site.hero.progressChipDone}
        </p>
      {/if}
      <p class="hero__hint">{site.hero.readHint} <span class="hero__hint-time">{metaLine}.</span></p>
    </div>
  </div>
</section>
