<script lang="ts">
  import AuthorSection from './AuthorSection.svelte';
  import BlurbSection from './BlurbSection.svelte';
  import FaqSection from './FaqSection.svelte';
  import Hero from './Hero.svelte';
  import PraiseSection from './PraiseSection.svelte';
  import SiteFooter from './SiteFooter.svelte';
  import SiteHeader from './SiteHeader.svelte';
</script>

<SiteHeader />
<main>
  <Hero />
  <BlurbSection />
  <PraiseSection />
  <AuthorSection />
  <FaqSection />
</main>
<SiteFooter />
