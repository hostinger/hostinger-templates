<script lang="ts">
	import { site, mailtoHref } from '$lib/site';
	import { weeks, weekSessionIds, totalSessions } from '$lib/plan';
	import { progress } from '$lib/progress.svelte';
	import { formatSessionsDone, formatWeekProgress, percentDone } from '$lib/format';

	const overallPct = $derived(percentDone(progress.totalDone, totalSessions));
</script>

<header id="top" class="site-header">
	<a class="skip-link" href="#plan">Skip to the plan</a>

	<div class="bar container">
		<a class="brand" href="#top" aria-label="{site.clubName} — back to top">
			<svg class="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
				<path
					d="M15 49 L27 44 L21 33 L36 28 L30 19 L47 15"
					fill="none"
					stroke="#ff5233"
					stroke-width="5"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-dasharray="1.5 7.5"
				/>
				<circle cx="15" cy="49" r="6" fill="#ff5233" />
				<circle cx="47" cy="15" r="6" fill="#faf5ee" />
			</svg>
			<span class="brand-text">
				<strong>{site.clubName}</strong>
				<span>{site.planName}</span>
			</span>
		</a>

		<nav class="week-nav" aria-label="Plan weeks">
			<ol>
				{#each weeks as week (week.week)}
					{@const ids = weekSessionIds(week)}
					{@const done = progress.countOf(ids)}
					<li>
						<a
							class="week-chip"
							class:done={done === ids.length}
							class:started={done > 0 && done < ids.length}
							href="#week-{week.week}"
							aria-label="Week {week.week}: {formatWeekProgress(done, ids.length)}"
						>
							{week.week}
						</a>
					</li>
				{/each}
			</ol>
		</nav>

		<div class="actions">
			<p class="count" aria-live="polite">{formatSessionsDone(progress.totalDone, totalSessions)}</p>
			<a class="btn btn-primary btn-small" href={mailtoHref}>Train with me</a>
		</div>
	</div>

	<div class="progress-strip" aria-hidden="true">
		<div class="progress-fill" style:width="{overallPct}%"></div>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--color-ink);
		color: var(--color-cream);
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.5rem;
		padding-block: 0.65rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
	}

	.mark {
		width: 30px;
		height: 30px;
		flex-shrink: 0;
	}

	.brand-text {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}

	.brand-text strong {
		font-size: 0.95rem;
		font-weight: 800;
		letter-spacing: 0.01em;
	}

	.brand-text span {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #ff8a70;
	}

	.week-nav {
		flex: 1;
		min-width: 0;
		display: flex;
		justify-content: center;
	}

	.week-nav ol {
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		padding: 2px;
		scrollbar-width: none;
	}

	.week-nav ol::-webkit-scrollbar {
		display: none;
	}

	.week-chip {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		flex-shrink: 0;
		border: 1.5px solid rgba(250, 245, 238, 0.32);
		border-radius: 50%;
		color: var(--color-cream-on-dark);
		font-size: 0.82rem;
		font-weight: 700;
		text-decoration: none;
		transition:
			border-color 140ms ease,
			background 140ms ease,
			color 140ms ease;
	}

	.week-chip:hover {
		border-color: var(--color-cream);
		color: var(--color-cream);
	}

	.week-chip.started {
		border-color: var(--color-coral);
		color: #ff8a70;
	}

	.week-chip.done {
		background: var(--color-coral);
		border-color: var(--color-coral);
		color: var(--color-ink);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		margin-left: auto;
	}

	.count {
		font-size: 0.78rem;
		font-weight: 600;
		white-space: nowrap;
		color: var(--color-cream-on-dark);
	}

	.progress-strip {
		height: 4px;
		background: rgba(250, 245, 238, 0.14);
	}

	.progress-fill {
		height: 100%;
		width: 0;
		background: var(--color-coral);
		transition: width 300ms ease;
	}

	@media (max-width: 920px) {
		.week-nav {
			order: 3;
			flex-basis: 100%;
			justify-content: flex-start;
		}
	}

	@media (max-width: 420px) {
		.actions {
			gap: 0.6rem;
		}

		.count {
			font-size: 0.7rem;
		}
	}
</style>
