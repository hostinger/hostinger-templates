<script lang="ts">
	import { prompt, resume } from '$lib/resume';
</script>

<section id="about" class="man-section container" aria-labelledby="about-title">
	<p class="section-cmd" aria-hidden="true">{prompt} <span class="cmd">about</span></p>
	<h2 id="about-title">About</h2>
	<div class="man-body">
		<p class="name-line">
			<strong>{resume.name}</strong> — {resume.role.toLowerCase()}, {resume.location}
		</p>
		<p class="synopsis">{resume.meta.synopsis}</p>
		<p class="para">{resume.summary}</p>
		{#each resume.about as paragraph (paragraph)}
			<p class="para">{paragraph}</p>
		{/each}
	</div>
</section>

<style>
	.name-line {
		color: var(--color-text);
	}

	.name-line strong {
		color: var(--color-green);
	}

	.synopsis {
		margin-top: 0.35rem;
		color: var(--color-dim);
		overflow-wrap: anywhere;
	}

	.para {
		margin-top: 1rem;
		max-width: 70ch;
	}
</style>
