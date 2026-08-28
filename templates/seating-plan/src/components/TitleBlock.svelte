<script lang="ts">
  import { TITLE_BLOCK } from '../content/copy';
</script>

<dl class="title-block" aria-label={TITLE_BLOCK.heading}>
  {#each TITLE_BLOCK.rows as row (row.label)}
    <div class="row">
      <dt>{row.label}</dt>
      <dd>{row.value}</dd>
    </div>
  {/each}
</dl>

<style>
  .title-block {
    margin: 0;
    min-width: 14rem;
    border: 1.5px solid var(--line);
    font-family: var(--font-mono);
  }

  .row {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
  }

  .row + .row {
    border-top: 1px solid var(--line-soft);
  }

  dt {
    padding: 0.4rem 0.6rem;
    border-right: 1px solid var(--line-soft);
    font-size: 0.55rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-dim);
  }

  dd {
    margin: 0;
    padding: 0.4rem 0.6rem;
    font-size: 0.68rem;
    letter-spacing: 0.04em;
    color: var(--ink);
  }
</style>
