<script lang="ts">
  import { site } from '../lib/site';
</script>

<section class="blurb section section--deep" id="story" aria-labelledby="blurb-heading">
  <div class="section__inner blurb__inner">
    <p class="eyebrow">{site.blurb.eyebrow}</p>
    <h2 id="blurb-heading" class="section__heading">{site.blurb.heading}</h2>
    <div class="blurb__paragraphs">
      {#each site.blurb.paragraphs as paragraph, index (index)}
        <p class="blurb__paragraph">{paragraph}</p>
      {/each}
    </div>
  </div>
</section>
