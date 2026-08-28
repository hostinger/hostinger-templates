<script lang="ts">
	import { site, mailtoHref } from '$lib/site';
</script>

<section id="coach" class="coach" aria-labelledby="coach-title">
	<div class="container grid">
		<figure class="photo">
			<img
				src="/images/coach-stretching.jpg"
				alt="Runner in a hooded top stretching toward one shoe on an outdoor exercise ground at sunrise"
				width="1600"
				height="1067"
			/>
		</figure>

		<div class="copy">
			<p class="eyebrow on-dark">Your coach</p>
			<h2 id="coach-title">Train with {site.coachName}.</h2>
			<p class="credential">{site.credential} · {site.location}</p>
			{#each site.coachBio as paragraph (paragraph)}
				<p class="bio">{paragraph}</p>
			{/each}
			<p class="meetup">{site.meetup}</p>
			<div class="cta-row">
				<a class="btn btn-primary" href={mailtoHref}>Email {site.coachFirstName} — train with me</a>
				<a class="btn btn-on-dark" href={site.phoneHref}>Call {site.phoneDisplay}</a>
			</div>
		</div>
	</div>
</section>

<style>
	.coach {
		padding-block: 4.5rem;
		background: var(--color-ink);
		color: var(--color-cream);
	}

	.grid {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 3.5rem;
		align-items: center;
	}

	.photo img {
		border-radius: var(--radius-lg);
	}

	h2 {
		margin-top: 0.9rem;
		font-size: clamp(1.9rem, 3.4vw, 2.6rem);
		font-weight: 800;
		letter-spacing: -0.015em;
		line-height: 1.12;
	}

	.credential {
		margin-top: 0.6rem;
		font-size: 0.9rem;
		font-weight: 600;
		color: #ff8a70;
	}

	.bio {
		margin-top: 1.1rem;
		max-width: 38rem;
		color: var(--color-cream-on-dark);
	}

	.meetup {
		margin-top: 1.3rem;
		padding: 0.7rem 1rem;
		max-width: 34rem;
		background: var(--color-navy-800);
		border-left: 3px solid var(--color-coral);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
		font-size: 0.9rem;
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-top: 1.8rem;
	}

	@media (max-width: 940px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 2.2rem;
		}
	}
</style>
