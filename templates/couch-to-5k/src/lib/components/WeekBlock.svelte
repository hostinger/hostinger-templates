<script lang="ts">
	import type { PlanWeek } from '$lib/types';
	import { sessionId, weekSessionIds } from '$lib/plan';
	import { progress } from '$lib/progress.svelte';
	import { site } from '$lib/site';
	import { formatWeekProgress } from '$lib/format';
	import SessionCard from './SessionCard.svelte';

	let { week }: { week: PlanWeek } = $props();

	const ids = $derived(weekSessionIds(week));
	const doneCount = $derived(progress.countOf(ids));
	const complete = $derived(doneCount === ids.length);
</script>

<section id="week-{week.week}" class="week" class:complete aria-labelledby="week-title-{week.week}">
	<div class="rail" aria-hidden="true">
		<span class="milestone">{week.week}</span>
		<span class="rail-line"></span>
	</div>

	<div class="body">
		<header class="week-head">
			<p class="kicker">
				Week {week.week}
				<span class="focus-chip">{week.focus}</span>
			</p>
			<h3 id="week-title-{week.week}">{week.title}</h3>
			<p class="note"><strong>Coach {site.coachFirstName}:</strong> {week.coachNote}</p>
		</header>

		<ul class="sessions">
			{#each week.sessions as session, index (index)}
				<SessionCard {session} id={sessionId(week.week, index)} number={index + 1} />
			{/each}
		</ul>

		<p class="week-progress">
			<span class="segments" aria-hidden="true">
				{#each ids as id (id)}
					<span class="segment" class:filled={progress.isDone(id)}></span>
				{/each}
			</span>
			<span class="week-count">
				{formatWeekProgress(doneCount, ids.length)}{complete ? ' — week complete' : ''}
			</span>
		</p>
	</div>
</section>

<style>
	.week {
		display: grid;
		grid-template-columns: 84px 1fr;
		gap: 1.6rem;
	}

	.rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}

	.milestone {
		display: grid;
		place-items: center;
		width: 64px;
		height: 64px;
		border: 2px solid var(--color-ink);
		border-radius: 50%;
		background: var(--color-card);
		font-size: 1.5rem;
		font-weight: 800;
	}

	.week.complete .milestone {
		background: var(--color-coral);
		border-color: var(--color-coral);
	}

	.rail-line {
		flex: 1;
		width: 0;
		min-height: 40px;
		margin-bottom: 0.4rem;
		border-left: 3px dashed rgba(16, 29, 58, 0.25);
	}

	.week.complete .rail-line {
		border-left-style: solid;
		border-left-color: var(--color-coral);
	}

	.body {
		min-width: 0;
		padding-bottom: 3.2rem;
	}

	.kicker {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}

	.focus-chip {
		display: inline-block;
		padding: 0.2rem 0.7rem;
		background: var(--color-coral-tint);
		border-radius: var(--radius-pill);
		color: var(--color-coral-dark);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		text-transform: none;
	}

	h3 {
		margin-top: 0.5rem;
		font-size: clamp(1.4rem, 2.4vw, 1.8rem);
		font-weight: 800;
		letter-spacing: -0.01em;
	}

	.note {
		margin-top: 0.7rem;
		max-width: 46rem;
		color: var(--color-ink-soft);
	}

	.note strong {
		color: var(--color-coral-dark);
		font-weight: 700;
	}

	.sessions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.9rem;
		margin-top: 1.3rem;
	}

	.week-progress {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin-top: 1rem;
	}

	.segments {
		display: inline-flex;
		gap: 0.3rem;
	}

	.segment {
		width: 26px;
		height: 7px;
		border-radius: 4px;
		background: rgba(16, 29, 58, 0.12);
	}

	.segment.filled {
		background: var(--color-coral);
	}

	.week-count {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-ink-soft);
	}

	.week.complete .week-count {
		color: var(--color-coral-dark);
	}

	@media (max-width: 980px) {
		.sessions {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.week {
			grid-template-columns: 48px 1fr;
			gap: 1rem;
		}

		.milestone {
			width: 44px;
			height: 44px;
			font-size: 1.1rem;
		}

		.body {
			padding-bottom: 2.4rem;
		}
	}
</style>
