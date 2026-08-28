<script lang="ts">
	import { prompt, resume } from '$lib/resume';
</script>

<section id="education" class="man-section container" aria-labelledby="education-title">
	<p class="section-cmd" aria-hidden="true">{prompt} <span class="cmd">education</span></p>
	<h2 id="education-title">Education</h2>
	<div class="man-body">
		{#each resume.education as entry (entry.school)}
			<article class="entry">
				<header class="entry-head">
					<h3>{entry.program}</h3>
					<p class="years">{entry.years}</p>
				</header>
				<p class="school">{entry.school}</p>
				{#if entry.note}
					<p class="note">{entry.note}</p>
				{/if}
			</article>
		{/each}
	</div>
</section>

<style>
	.entry + .entry {
		margin-top: 1.8rem;
	}

	.entry-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		column-gap: 1.5rem;
	}

	h3 {
		color: var(--color-text);
		font-size: 1rem;
	}

	.years {
		color: var(--color-muted);
		font-size: 0.88rem;
		white-space: nowrap;
	}

	.school {
		margin-top: 0.15rem;
		color: var(--color-amber);
		font-size: 0.92rem;
	}

	.note {
		margin-top: 0.5rem;
		max-width: 70ch;
		color: var(--color-muted);
		font-size: 0.92rem;
	}
</style>
