<script lang="ts">
	import { prompt, resume } from '$lib/resume';
</script>

<section id="experience" class="man-section container" aria-labelledby="experience-title">
	<p class="section-cmd" aria-hidden="true">{prompt} <span class="cmd">experience</span></p>
	<h2 id="experience-title">Experience</h2>
	<div class="man-body">
		{#each resume.experience as job (job.company)}
			<article class="job">
				<header class="job-head">
					<h3>{job.title}</h3>
					<p class="dates">{job.start} – {job.end}</p>
				</header>
				<p class="company">{job.company} <span class="dim" aria-hidden="true">·</span> {job.location}</p>
				<ul class="bullets">
					{#each job.bullets as bullet (bullet)}
						<li>{bullet}</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</section>

<style>
	.job + .job {
		margin-top: 2.2rem;
		padding-top: 2.2rem;
		border-top: 1px dashed var(--color-line);
	}

	.job-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		column-gap: 1.5rem;
	}

	h3 {
		color: var(--color-text);
		font-size: 1.02rem;
	}

	.dates {
		color: var(--color-muted);
		font-size: 0.88rem;
		white-space: nowrap;
	}

	.company {
		margin-top: 0.15rem;
		color: var(--color-amber);
		font-size: 0.92rem;
	}

	.dim {
		color: var(--color-dim);
	}

	.bullets {
		margin-top: 0.9rem;
		max-width: 74ch;
	}

	.bullets li {
		position: relative;
		padding-left: 2ch;
		margin-top: 0.45rem;
	}

	.bullets li::before {
		content: '-';
		position: absolute;
		left: 0;
		color: var(--color-amber);
	}
</style>
