<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { chapter, fillTemplate } from '../lib/chapter';
  import {
    TEXT_SIZES,
    clampTextSizeIndex,
    loadPosition,
    loadTextSizeIndex,
    minutesLeft,
    savePosition,
    saveTextSizeIndex,
  } from '../lib/reader';
  import { site } from '../lib/site';

  /** Distance from the viewport top where the "current line" is anchored. */
  const READING_LINE = 132;

  let article = $state<HTMLElement | null>(null);
  let sizeIndex = $state(loadTextSizeIndex());
  let progress = $state(0);

  let blocks: HTMLElement[] = [];
  let frame: number | null = null;
  let saveTimer: number | undefined;
  let hasInteracted = false;

  const fontSize = $derived(TEXT_SIZES[sizeIndex]);
  const percent = $derived(Math.round(progress * 100));
  const remaining = $derived(minutesLeft(chapter.minutes, progress));
  const remainingLine = $derived(
    remaining > 0
      ? fillTemplate(site.reader.minutesLeftTemplate, { minutes: remaining })
      : site.reader.finishedLabel,
  );
  const metaLine = fillTemplate(site.reader.metaTemplate, {
    words: chapter.wordCount,
    minutes: chapter.minutes,
  });

  function collectBlocks(): void {
    blocks = article === null ? [] : (Array.from(article.children) as HTMLElement[]);
  }

  function computeProgress(): void {
    const span = document.documentElement.scrollHeight - window.innerHeight;
    progress = span <= 0 ? 1 : Math.min(Math.max(window.scrollY / span, 0), 1);
  }

  function currentBlockIndex(): number {
    for (let index = 0; index < blocks.length; index += 1) {
      if (blocks[index].getBoundingClientRect().bottom > READING_LINE) return index;
    }
    return blocks.length > 0 ? blocks.length - 1 : 0;
  }

  function scrollToBlock(index: number): void {
    const target = blocks[index];
    if (target === undefined) return;
    const top = target.getBoundingClientRect().top + window.scrollY - READING_LINE;
    // Restores and re-anchors jump instantly; smooth scrolling is for anchor links.
    window.scrollTo({ top: Math.max(top, 0), behavior: 'instant' });
  }

  function saveCurrentPosition(): void {
    if (blocks.length === 0) return;
    savePosition({ block: currentBlockIndex(), progress });
  }

  function handleScroll(): void {
    if (frame === null) {
      frame = window.requestAnimationFrame(() => {
        frame = null;
        computeProgress();
      });
    }
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveCurrentPosition, 300);
  }

  function markInteracted(): void {
    hasInteracted = true;
  }

  function handleVisibility(): void {
    if (document.visibilityState === 'hidden') saveCurrentPosition();
  }

  function restorePosition(): void {
    const saved = loadPosition();
    if (saved === null || saved.block <= 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      scrollToBlock(Math.min(saved.block, blocks.length - 1));
    }
    computeProgress();
  }

  async function adjustSize(delta: number): Promise<void> {
    const next = clampTextSizeIndex(sizeIndex + delta);
    if (next === sizeIndex) return;
    const anchor = currentBlockIndex();
    sizeIndex = next;
    saveTextSizeIndex(next);
    await tick();
    scrollToBlock(anchor);
    computeProgress();
  }

  onMount(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    collectBlocks();
    restorePosition();
    // Re-anchor once the serif webfont arrives and line heights settle.
    void document.fonts.ready.then(() => {
      if (!hasInteracted) restorePosition();
    });
    return () => {
      window.history.scrollRestoration = previousRestoration;
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.clearTimeout(saveTimer);
      saveCurrentPosition();
    };
  });
</script>

<svelte:window
  onscroll={handleScroll}
  onresize={computeProgress}
  onwheel={markInteracted}
  ontouchstart={markInteracted}
  onkeydown={markInteracted}
/>
<svelte:document onvisibilitychange={handleVisibility} />

<div class="reader" style:--reader-size={`${fontSize}px`}>
  <div class="reader__chrome">
    <div class="reader__chrome-inner">
      <a class="reader__back" href="#book"><span aria-hidden="true">‹</span> {site.reader.backLabel}</a>
      <p class="reader__book">
        {site.book.title} <span class="reader__book-chapter">· {site.reader.chapterLabel}</span>
      </p>
      <div class="reader__tools">
        <div class="reader__sizes" role="group" aria-label={site.reader.textSizeLabel}>
          <button
            type="button"
            class="reader__size-button"
            onclick={() => adjustSize(-1)}
            disabled={sizeIndex === 0}
            aria-label={site.reader.smallerLabel}
          >
            A<span aria-hidden="true">−</span>
          </button>
          <button
            type="button"
            class="reader__size-button"
            onclick={() => adjustSize(1)}
            disabled={sizeIndex === TEXT_SIZES.length - 1}
            aria-label={site.reader.largerLabel}
          >
            A<span aria-hidden="true">+</span>
          </button>
        </div>
        <p class="reader__percent"><strong>{percent}%</strong> <span>{remainingLine}</span></p>
      </div>
    </div>
    <div
      class="reader__progress"
      role="progressbar"
      aria-label={site.reader.progressLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${percent}% — ${remainingLine}`}
    >
      <div class="reader__progress-fill" style:width={`${progress * 100}%`}></div>
    </div>
  </div>

  <main class="reader__main">
    <header class="reader__head">
      <p class="eyebrow">{site.book.title} · {site.book.author}</p>
      <p class="reader__meta">{metaLine}</p>
    </header>
    <article class="chapter" bind:this={article}>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html chapter.html}
    </article>
    <div class="chapter-end">
      <p class="chapter-end__rule" aria-hidden="true">* * *</p>
      <h2 class="chapter-end__heading">{site.buy.endHeading}</h2>
      <p class="chapter-end__message">{site.buy.endMessage}</p>
      <div class="chapter-end__actions">
        <a
          class="button button--primary"
          href={site.buy.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {site.buy.label}<span aria-hidden="true"> ↗</span>
        </a>
        <a class="button button--outline" href={`mailto:${site.author.email}`}>
          {site.author.emailLabel}
        </a>
      </div>
      <p class="chapter-end__note">{site.buy.note}</p>
      <p class="chapter-end__position">{site.reader.positionNote}</p>
      <a class="chapter-end__back" href="#book"><span aria-hidden="true">‹</span> {site.reader.backLabel}</a>
    </div>
  </main>
</div>
