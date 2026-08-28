<script lang="ts">
  import type { FaqItem } from '$lib/types/event'

  let { items }: { items: FaqItem[] } = $props()
</script>

<section class="faq" aria-labelledby="faq-heading">
  <div class="faq__intro">
    <p>Before you pull</p>
    <h2 id="faq-heading">FAQ</h2>
    <span aria-hidden="true">ASK / ASK / ASK /</span>
  </div>
  <div class="faq__list">
    {#each items as item, index (item.question)}
      <details open={index === 0}>
        <summary>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {item.question}
          <span class="faq__mark" aria-hidden="true"></span>
        </summary>
        <p>{item.answer}</p>
      </details>
    {/each}
  </div>
</section>
