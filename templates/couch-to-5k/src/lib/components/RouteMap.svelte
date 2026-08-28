<script lang="ts">
	import { weeks, weekSessionIds, totalWeeks } from '$lib/plan';
	import { progress } from '$lib/progress.svelte';
	import { formatWeekProgress } from '$lib/format';

	interface RoutePoint {
		x: number;
		y: number;
	}

	/** Trail coordinates: start, weeks 1–9, finish. */
	const ROUTE_POINTS: RoutePoint[] = [
		{ x: 60, y: 572 },
		{ x: 150, y: 536 },
		{ x: 306, y: 508 },
		{ x: 408, y: 446 },
		{ x: 322, y: 372 },
		{ x: 138, y: 344 },
		{ x: 84, y: 258 },
		{ x: 216, y: 196 },
		{ x: 366, y: 168 },
		{ x: 408, y: 84 },
		{ x: 300, y: 44 }
	];

	const routePath = ROUTE_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

	/** Cumulative fraction of the total trail length at each point. */
	const cumulativeFractions = (() => {
		const distances = ROUTE_POINTS.map((point, index) => {
			if (index === 0) return 0;
			const prev = ROUTE_POINTS[index - 1];
			return Math.hypot(point.x - prev.x, point.y - prev.y);
		});
		const total = distances.reduce((sum, distance) => sum + distance, 0);
		let running = 0;
		return distances.map((distance) => {
			running += distance;
			return running / total;
		});
	})();

	const weekStates = $derived(
		weeks.map((week) => {
			const ids = weekSessionIds(week);
			const done = progress.countOf(ids);
			return { week, done, total: ids.length, complete: done === ids.length };
		})
	);

	const completeWeeks = $derived(weekStates.filter((state) => state.complete).length);

	/** Weeks finished in a row from week one — how far along the trail you are. */
	const reached = $derived.by(() => {
		let count = 0;
		for (const state of weekStates) {
			if (!state.complete) break;
			count += 1;
		}
		return count;
	});

	const currentWeek = $derived(weekStates.find((state) => !state.complete)?.week.week ?? null);

	const traveledPct = $derived(reached === totalWeeks ? 100 : cumulativeFractions[reached] * 100);
</script>

<div class="route-card">
	<header class="route-head">
		<p class="route-kicker">Your route to 5K</p>
		<p class="route-stat"><strong>{completeWeeks}</strong> of {totalWeeks} weeks behind you</p>
	</header>

	<svg class="route-map" viewBox="0 0 480 620" role="group" aria-label="Trail map of the nine plan weeks">
		<g aria-hidden="true">
			<ellipse class="pond" cx="92" cy="112" rx="36" ry="16" />
			<path class="contour" d="M368 300 q 40 -18 84 -6" />
			<path class="contour" d="M40 396 q 30 -14 60 -4" />
			<g class="tree" transform="translate(432 528)">
				<line y2="14" />
				<circle r="10" />
			</g>
			<g class="tree" transform="translate(52 470)">
				<line y2="12" />
				<circle r="8" />
			</g>
			<g class="tree" transform="translate(160 78)">
				<line y2="12" />
				<circle r="8" />
			</g>
			<g class="tree" transform="translate(258 288)">
				<line y2="10" />
				<circle r="7" />
			</g>
		</g>

		<path class="trail" d={routePath} />
		<path
			class="trail-progress"
			d={routePath}
			pathLength="100"
			style:stroke-dasharray="{traveledPct} 100"
		/>

		<g aria-hidden="true">
			<circle class="start-dot" cx={ROUTE_POINTS[0].x} cy={ROUTE_POINTS[0].y} r="9" />
			<text class="terminal-label" x={ROUTE_POINTS[0].x + 4} y={ROUTE_POINTS[0].y + 36}>START</text>
		</g>

		<g aria-hidden="true">
			<line class="flag-pole" x1="300" y1="44" x2="300" y2="8" />
			<path class="flag" d="M300 8 h26 l-7 8 7 8 h-26 z" />
			<text class="terminal-label" x="288" y="20" text-anchor="end">5K</text>
		</g>

		{#each weekStates as state, index (state.week.week)}
			{@const point = ROUTE_POINTS[index + 1]}
			<a
				class="milestone"
				class:done={state.complete}
				class:current={state.week.week === currentWeek}
				href="#week-{state.week.week}"
				aria-label="Week {state.week.week} — {formatWeekProgress(state.done, state.total)}"
			>
				{#if state.week.week === currentWeek}
					<circle class="halo" cx={point.x} cy={point.y} r="28" />
				{/if}
				<circle class="disc" cx={point.x} cy={point.y} r="21" />
				<text class="num" x={point.x} y={point.y}>{state.week.week}</text>
			</a>
		{/each}
	</svg>

	<p class="route-caption">
		Tap a milestone to jump to that week — the trail fills in as you finish weeks in order.
	</p>
</div>

<style>
	.route-card {
		background: var(--color-ink);
		color: var(--color-cream);
		border-radius: var(--radius-lg);
		padding: 1.6rem 1.7rem 1.4rem;
		box-shadow: var(--shadow-card);
	}

	.route-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.4rem 1rem;
	}

	.route-kicker {
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #ff8a70;
	}

	.route-stat {
		font-size: 0.88rem;
		color: var(--color-cream-on-dark);
	}

	.route-stat strong {
		font-size: 1.05rem;
		font-weight: 800;
		color: var(--color-cream);
	}

	.route-map {
		width: 100%;
		height: auto;
		margin-top: 0.7rem;
	}

	.pond {
		fill: var(--color-navy-700);
		opacity: 0.55;
	}

	.contour {
		fill: none;
		stroke: var(--color-navy-700);
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0.8;
	}

	.tree line {
		stroke: var(--color-navy-700);
		stroke-width: 3;
	}

	.tree circle {
		fill: var(--color-navy-700);
	}

	.trail {
		fill: none;
		stroke: rgba(250, 245, 238, 0.35);
		stroke-width: 4;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1.5 10;
	}

	.trail-progress {
		fill: none;
		stroke: var(--color-coral);
		stroke-width: 5;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: stroke-dasharray 400ms ease;
	}

	.start-dot {
		fill: var(--color-coral);
	}

	.terminal-label {
		fill: var(--color-cream-on-dark);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-anchor: middle;
	}

	.flag-pole {
		stroke: var(--color-cream);
		stroke-width: 3;
		stroke-linecap: round;
	}

	.flag {
		fill: var(--color-coral);
	}

	.milestone {
		cursor: pointer;
	}

	.milestone .disc {
		fill: var(--color-navy-700);
		stroke: rgba(250, 245, 238, 0.3);
		stroke-width: 1.5;
		stroke-dasharray: 4 4;
		transition:
			fill 160ms ease,
			stroke 160ms ease;
	}

	.milestone .num {
		fill: rgba(250, 245, 238, 0.82);
		font-size: 16px;
		font-weight: 800;
		text-anchor: middle;
		dominant-baseline: central;
	}

	.milestone:hover .disc {
		stroke: var(--color-cream);
		stroke-dasharray: none;
	}

	.milestone:focus-visible {
		outline: none;
	}

	.milestone:focus-visible .disc {
		stroke: var(--color-cream);
		stroke-width: 3;
		stroke-dasharray: none;
	}

	.milestone.done .disc {
		fill: var(--color-coral);
		stroke: none;
	}

	.milestone.done .num {
		fill: var(--color-ink);
	}

	.milestone.current .disc {
		fill: var(--color-cream);
		stroke: var(--color-coral);
		stroke-width: 3;
		stroke-dasharray: none;
	}

	.milestone.current .num {
		fill: var(--color-coral-dark);
	}

	.halo {
		fill: none;
		stroke: var(--color-coral);
		stroke-width: 2;
		transform-box: fill-box;
		transform-origin: center;
		animation: halo-pulse 2.4s ease-out infinite;
	}

	@keyframes halo-pulse {
		0% {
			transform: scale(0.78);
			opacity: 0.9;
		}

		70%,
		100% {
			transform: scale(1.18);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.halo {
			animation: none;
			opacity: 0.45;
		}

		.trail-progress {
			transition: none;
		}
	}

	.route-caption {
		margin-top: 0.9rem;
		font-size: 0.8rem;
		color: var(--color-cream-on-dark);
	}
</style>
