<script lang="ts">
  import { site } from '../lib/site';
</script>

<header class="site-header">
  <div class="site-header__inner">
    <a class="wordmark" href="#book">
      <span class="wordmark__title">{site.book.title}</span>
      <span class="wordmark__author">{site.book.author}</span>
    </a>
    <nav class="site-nav" aria-label="Site sections">
      {#each site.nav as link (link.href)}
        <a href={link.href}>{link.label}</a>
      {/each}
    </nav>
    <a class="button button--quiet site-header__cta" href="#read">{site.hero.readLabel}</a>
  </div>
</header>
