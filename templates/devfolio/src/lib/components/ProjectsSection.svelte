<script lang="ts">
	import { prompt, resume } from '$lib/resume';
</script>

<section id="projects" class="man-section container" aria-labelledby="projects-title">
	<p class="section-cmd" aria-hidden="true">{prompt} <span class="cmd">projects</span></p>
	<h2 id="projects-title">Projects</h2>
	<div class="man-body grid">
		{#each resume.projects as project (project.name)}
			<article class="project">
				<h3><span class="dollar" aria-hidden="true">$ </span>{project.name}</h3>
				<p class="desc">{project.description}</p>
				<ul class="stack" aria-label="Built with">
					{#each project.stack as tool (tool)}
						<li class="chip">{tool}</li>
					{/each}
				</ul>
				<p class="links">
					{#each project.links as link (link.href)}
						<a class="bracket-link" href={link.href} target="_blank" rel="noreferrer"
							>{link.label}</a
						>
					{/each}
				</p>
			</article>
		{/each}
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
	}

	.project {
		display: flex;
		flex-direction: column;
		padding: 1.15rem 1.25rem 1.25rem;
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-raised);
		transition: border-color 140ms ease, box-shadow 140ms ease;
	}

	.project:hover {
		border-color: var(--color-line-strong);
		box-shadow: 0 0 18px rgba(55, 242, 109, 0.09);
	}

	h3 {
		color: var(--color-green);
		font-size: 1rem;
	}

	.dollar {
		color: var(--color-dim);
		font-weight: 400;
	}

	.desc {
		margin-top: 0.6rem;
		color: var(--color-text);
		font-size: 0.92rem;
	}

	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.9rem;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px dashed var(--color-line);
		font-size: 0.9rem;
	}

	@media (max-width: 760px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
