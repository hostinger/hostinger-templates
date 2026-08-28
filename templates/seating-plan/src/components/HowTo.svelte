<script lang="ts">
  import { HOW_TO, HOW_TO_TITLE } from '../content/copy';
</script>

<section class="how-to" aria-label={HOW_TO_TITLE}>
  <h2>{HOW_TO_TITLE}</h2>
  <div class="entries">
    {#each HOW_TO as entry, index (entry.question)}
      <article>
        <h3><span class="index">{String(index + 1).padStart(2, '0')}</span>{entry.question}</h3>
        <p>{entry.answer}</p>
      </article>
    {/each}
  </div>
</section>

<style>
  .how-to {
    margin-top: 2.5rem;
    border-top: 1px solid var(--line-soft);
    padding-top: 1.5rem;
  }

  h2 {
    margin: 0 0 1.2rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-dim);
  }

  .entries {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: 1.5rem;
  }

  h3 {
    margin: 0 0 0.4rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--ink);
  }

  .index {
    margin-right: 0.6rem;
    color: var(--accent);
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--ink-dim);
  }
</style>
