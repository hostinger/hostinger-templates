<script lang="ts">
  import { site } from '../lib/site';
</script>

<section class="author section section--deep" id="author" aria-labelledby="author-heading">
  <div class="section__inner author__inner">
    <div class="author__medallion" aria-hidden="true">
      <svg viewBox="0 0 120 120" role="presentation" focusable="false">
        <circle cx="60" cy="60" r="56" fill="none" stroke="var(--brass)" stroke-width="1.4" />
        <circle cx="60" cy="60" r="49" fill="var(--ink)" />
        <text class="author__initials" x="60" y="63">{site.author.initials}</text>
      </svg>
    </div>
    <div class="author__body">
      <p class="eyebrow">{site.author.eyebrow}</p>
      <h2 id="author-heading" class="section__heading">{site.author.heading}</h2>
      {#each site.author.bio as paragraph, index (index)}
        <p class="author__paragraph">{paragraph}</p>
      {/each}
      <div class="author__contact">
        <a class="button button--outline" href={`mailto:${site.author.email}`}>
          {site.author.emailLabel}
        </a>
        <a class="author__email" href={`mailto:${site.author.email}`}>{site.author.email}</a>
      </div>
      <p class="author__note">{site.author.emailNote}</p>
    </div>
  </div>
</section>
