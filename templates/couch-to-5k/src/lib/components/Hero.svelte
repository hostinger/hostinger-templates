<script lang="ts">
	import { site } from '$lib/site';
	import { totalSessions, totalWeeks, weeks } from '$lib/plan';
	import RouteMap from './RouteMap.svelte';

	const runsPerWeek = weeks[0].sessions.length;
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="container hero-grid">
		<div class="copy">
			<p class="eyebrow">{site.heroEyebrow}</p>
			<h1 id="hero-title">{site.heroTitle}</h1>
			<p class="lede">{site.heroLede}</p>

			<div class="cta-row">
				<a class="btn btn-primary" href="#week-1">Start week 1</a>
				<a class="btn btn-ghost" href="#coach">Train with {site.coachFirstName}</a>
			</div>

			<p class="privacy">
				<svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17">
					<rect
						x="7"
						y="2.5"
						width="10"
						height="19"
						rx="2.6"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					/>
					<circle cx="12" cy="17.6" r="1.3" fill="currentColor" />
				</svg>
				<span>{site.privacyNote}</span>
			</p>

			<dl class="stats">
				<div class="stat">
					<dt>weeks</dt>
					<dd>{totalWeeks}</dd>
				</div>
				<div class="stat">
					<dt>sessions</dt>
					<dd>{totalSessions}</dd>
				</div>
				<div class="stat">
					<dt>runs a week</dt>
					<dd>{runsPerWeek}</dd>
				</div>
			</dl>
		</div>

		<RouteMap />
	</div>
</section>

<style>
	.hero {
		padding-block: 4rem 4.5rem;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 3.5rem;
		align-items: center;
	}

	h1 {
		margin-top: 1rem;
		font-size: clamp(2.4rem, 5.2vw, 4rem);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: -0.02em;
	}

	.lede {
		margin-top: 1.4rem;
		max-width: 34rem;
		font-size: 1.06rem;
		color: var(--color-ink-soft);
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 2rem;
	}

	.privacy {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		margin-top: 1.5rem;
		padding: 0.5rem 0.95rem;
		background: var(--color-coral-tint);
		border-radius: var(--radius-pill);
		font-size: 0.84rem;
		font-weight: 600;
	}

	.privacy svg {
		flex-shrink: 0;
		color: var(--color-coral-dark);
	}

	.stats {
		display: flex;
		gap: 2.4rem;
		margin-top: 2.4rem;
	}

	.stat {
		display: flex;
		flex-direction: column-reverse;
	}

	.stat dd {
		font-size: 2.2rem;
		font-weight: 800;
		line-height: 1;
	}

	.stat dt {
		margin-top: 0.35rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-soft);
	}

	@media (max-width: 980px) {
		.hero {
			padding-block: 3rem 3.5rem;
		}

		.hero-grid {
			grid-template-columns: 1fr;
			gap: 2.6rem;
		}
	}

	@media (max-width: 420px) {
		.stats {
			gap: 1.5rem;
		}

		.stat dd {
			font-size: 1.85rem;
		}
	}
</style>
