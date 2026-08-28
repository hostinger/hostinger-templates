<script lang="ts">
	import { manualRef, resume } from '$lib/resume';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import AboutSection from '$lib/components/AboutSection.svelte';
	import ExperienceSection from '$lib/components/ExperienceSection.svelte';
	import ProjectsSection from '$lib/components/ProjectsSection.svelte';
	import SkillsSection from '$lib/components/SkillsSection.svelte';
	import EducationSection from '$lib/components/EducationSection.svelte';
	import ContactSection from '$lib/components/ContactSection.svelte';
	import FaqSection from '$lib/components/FaqSection.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	const pageTitle = `${resume.name} — ${resume.role}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={resume.meta.tagline} />
	<meta name="theme-color" content="#000000" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={resume.meta.tagline} />
	<meta property="og:type" content="website" />
</svelte:head>

<a class="skip-link" href="#resume">Skip to the résumé</a>

<StatusBar />

<main>
	<Hero />

	<div id="resume" class="manual">
		<div class="container man-header" aria-hidden="true">
			<span>{manualRef}</span>
			<span class="man-header-mid">Developer Manual</span>
			<span class="man-header-right">{manualRef}</span>
		</div>
		<AboutSection />
		<ExperienceSection />
		<ProjectsSection />
		<SkillsSection />
		<EducationSection />
		<ContactSection />
		<FaqSection />
	</div>
</main>

<SiteFooter />

<style>
	.manual {
		margin-top: 1.6rem;
	}

	.man-header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px dashed var(--color-line);
		color: var(--color-dim);
		font-size: 0.85rem;
	}

	@media (max-width: 700px) {
		.man-header-mid {
			display: none;
		}
	}

	@media (max-width: 420px) {
		.man-header-right {
			display: none;
		}
	}
</style>
