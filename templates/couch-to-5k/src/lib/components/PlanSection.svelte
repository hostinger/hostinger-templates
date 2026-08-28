<script lang="ts">
	import { plan, weeks, totalSessions } from '$lib/plan';
	import { progress } from '$lib/progress.svelte';
	import { formatSessionsDone } from '$lib/format';
	import { site } from '$lib/site';
	import WeekBlock from './WeekBlock.svelte';
	import ResetProgress from './ResetProgress.svelte';
</script>

<section id="plan" class="plan" aria-labelledby="plan-title">
	<div class="container">
		<header class="plan-head">
			<div class="plan-lead">
				<p class="eyebrow">The plan</p>
				<h2 id="plan-title">Nine weeks, twenty-seven ticks.</h2>
				<p class="intro-copy">{site.planIntro} {plan.sessionFrame}</p>
			</div>

			<aside class="plan-tools" aria-label="Progress tools">
				<p class="tools-count">{formatSessionsDone(progress.totalDone, totalSessions)}</p>
				<ResetProgress />
			</aside>
		</header>

		<ol class="weeks">
			{#each weeks as week (week.week)}
				<li class="week-item">
					<WeekBlock {week} />
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.plan {
		padding-block: 1.5rem 4rem;
	}

	.plan-head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1.6rem 2rem;
		margin-bottom: 2.8rem;
	}

	h2 {
		margin-top: 0.9rem;
		font-size: clamp(1.9rem, 3.4vw, 2.6rem);
		font-weight: 800;
		letter-spacing: -0.015em;
		line-height: 1.12;
	}

	.intro-copy {
		margin-top: 1rem;
		max-width: 44rem;
		color: var(--color-ink-soft);
	}

	.plan-tools {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.55rem;
		padding: 1rem 1.2rem;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		border-radius: var(--radius-md);
	}

	.tools-count {
		font-size: 1.02rem;
		font-weight: 800;
	}

	.weeks {
		display: flex;
		flex-direction: column;
	}

	.weeks .week-item:last-child :global(.rail-line) {
		display: none;
	}

	@media (max-width: 760px) {
		.plan-tools {
			align-items: flex-start;
			width: 100%;
		}
	}
</style>
