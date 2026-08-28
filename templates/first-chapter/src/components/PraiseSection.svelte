<script lang="ts">
  import { site } from '../lib/site';
</script>

<section class="praise section" id="praise" aria-labelledby="praise-heading">
  <div class="section__inner">
    <p class="eyebrow">{site.praise.eyebrow}</p>
    <h2 id="praise-heading" class="section__heading">{site.praise.heading}</h2>
    <ul class="praise__list">
      {#each site.praise.quotes as item (item.source)}
        <li class="praise__item">
          <figure class="praise__figure">
            <blockquote class="praise__quote">
              <p>{item.quote}</p>
            </blockquote>
            <figcaption class="praise__source">{item.source}</figcaption>
          </figure>
        </li>
      {/each}
    </ul>
  </div>
</section>
