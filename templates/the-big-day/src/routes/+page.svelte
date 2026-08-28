<script lang="ts">
	import { faqJsonLd, wedding } from '$lib/data/wedding';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import StorySection from '$lib/components/StorySection.svelte';
	import ScheduleSection from '$lib/components/ScheduleSection.svelte';
	import TravelSection from '$lib/components/TravelSection.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import RsvpForm from '$lib/components/RsvpForm.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	const title = `${wedding.couple.first} & ${wedding.couple.second} — ${wedding.date.display}`;
	const faqStructuredData = JSON.stringify(faqJsonLd).replace(/</g, '\\u003c');
	const faqScript = `<script type="application/ld+json">${faqStructuredData}</scr${'ipt'}>`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={wedding.hero.note} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={wedding.hero.note} />
	<meta property="og:type" content="website" />
	<!-- Structured data comes only from committed wedding.json content. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html faqScript}
</svelte:head>

<SiteHeader />
<main>
	<Hero />
	<StorySection />
	<ScheduleSection />
	<TravelSection />
	<FaqSection />
	<RsvpForm />
</main>
<SiteFooter />
