<script lang="ts">
	import { mailtoHref, resume } from '$lib/resume';
	import TerminalPanel from './TerminalPanel.svelte';

	const github = resume.socials.find((social) => social.label === 'GitHub');
</script>

<section class="hero" aria-labelledby="hero-name">
	<div class="container grid">
		<div class="intro">
			<p class="eyebrow"><span aria-hidden="true">$</span> whoami</p>
			<h1 id="hero-name">{resume.name}</h1>
			<p class="role">{resume.role} <span class="sep" aria-hidden="true">·</span> {resume.location}</p>
			<p class="tagline">{resume.meta.tagline}</p>
			<div class="actions">
				<a class="btn btn--amber" href={mailtoHref}>say hello</a>
				{#if github}
					<a class="btn" href={github.href} target="_blank" rel="noreferrer">github</a>
				{/if}
			</div>
			<p class="fallback-note">
				Not a fan of terminals? The whole résumé reads as plain HTML
				<a href="#resume">just below</a> — JavaScript optional.
			</p>
		</div>
		<TerminalPanel />
	</div>
</section>

<style>
	.hero {
		padding-block: 2.8rem 3.4rem;
	}

	.grid {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		gap: 2.75rem;
		align-items: center;
	}

	.eyebrow {
		color: var(--color-muted);
		font-size: 0.9rem;
	}

	.eyebrow span {
		color: var(--color-dim);
	}

	h1 {
		margin-top: 0.5rem;
		color: var(--color-green);
		font-size: clamp(2.1rem, 4.2vw, 3.3rem);
		line-height: 1.08;
		letter-spacing: -0.01em;
		text-shadow: var(--glow-green);
	}

	.role {
		margin-top: 0.7rem;
		color: var(--color-amber);
		font-weight: 700;
	}

	.sep {
		color: var(--color-dim);
		font-weight: 400;
	}

	.tagline {
		margin-top: 1.05rem;
		max-width: 46ch;
		color: var(--color-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-top: 1.6rem;
	}

	.fallback-note {
		margin-top: 1.5rem;
		color: var(--color-dim);
		font-size: 0.85rem;
		max-width: 44ch;
	}

	@media (max-width: 1023px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 2.2rem;
		}

		.hero {
			padding-block: 2.2rem 2.6rem;
		}
	}
</style>
