<script lang="ts">
  import { site } from '../lib/site';
</script>

<footer class="site-footer">
  <div class="site-footer__inner">
    <p class="site-footer__title">{site.book.title}</p>
    <nav class="site-footer__nav" aria-label="Footer">
      <a href="#read">{site.hero.readLabel}</a>
      <a href={site.buy.url} target="_blank" rel="noopener noreferrer">{site.buy.label}</a>
      <a href={`mailto:${site.author.email}`}>{site.author.emailLabel}</a>
    </nav>
    <p class="site-footer__line">{site.footer.line}</p>
    <p class="site-footer__small">{site.footer.smallPrint}</p>
  </div>
</footer>
