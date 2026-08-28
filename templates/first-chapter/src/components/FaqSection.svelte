<script lang="ts">
  import { faqSchemaTag } from '../lib/faqSchema';
  import { site } from '../lib/site';

  const schemaTag = faqSchemaTag(site.faq.items);
</script>

<svelte:head>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html schemaTag}
</svelte:head>

<section class="faq section" id="faq" aria-labelledby="faq-heading">
  <div class="section__inner faq__inner">
    <p class="eyebrow">{site.faq.eyebrow}</p>
    <h2 id="faq-heading" class="section__heading">{site.faq.heading}</h2>
    <div class="faq__list">
      {#each site.faq.items as item, index (item.question)}
        <details class="faq__item" open={index === 0}>
          <summary class="faq__question">
            {item.question}
            <span class="faq__marker" aria-hidden="true"></span>
          </summary>
          <p class="faq__answer">{item.answer}</p>
        </details>
      {/each}
    </div>
  </div>
</section>
