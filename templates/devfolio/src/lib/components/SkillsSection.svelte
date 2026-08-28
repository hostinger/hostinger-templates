<script lang="ts">
	import { prompt, resume } from '$lib/resume';
</script>

<section id="skills" class="man-section container" aria-labelledby="skills-title">
	<p class="section-cmd" aria-hidden="true">{prompt} <span class="cmd">skills</span></p>
	<h2 id="skills-title">Skills</h2>
	<dl class="man-body skills">
		{#each resume.skills as group (group.group)}
			<div class="row">
				<dt>{group.group}</dt>
				<dd>
					<ul>
						{#each group.items as item (item)}
							<li class="chip">{item}</li>
						{/each}
					</ul>
				</dd>
			</div>
		{/each}
	</dl>
</section>

<style>
	.row {
		display: grid;
		grid-template-columns: 14ch minmax(0, 1fr);
		gap: 1rem;
		padding-block: 0.95rem;
		border-bottom: 1px dashed var(--color-line);
	}

	.row:first-child {
		border-top: 1px dashed var(--color-line);
	}

	dt {
		color: var(--color-green);
		font-weight: 700;
	}

	dd ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.55rem;
		}
	}
</style>
