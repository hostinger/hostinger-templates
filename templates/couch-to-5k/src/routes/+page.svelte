<script lang="ts">
	import { site } from '$lib/site';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import PlanSection from '$lib/components/PlanSection.svelte';
	import CoachSection from '$lib/components/CoachSection.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	const pageTitle = `${site.planName} — ${site.clubName}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={site.tagline} />
	<meta name="theme-color" content="#101d3a" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={site.tagline} />
	<meta property="og:type" content="website" />
</svelte:head>

<SiteHeader />

<main>
	<Hero />
	<PlanSection />
	<CoachSection />
	<FaqSection />
</main>

<SiteFooter />
