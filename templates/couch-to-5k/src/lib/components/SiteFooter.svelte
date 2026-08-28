<script lang="ts">
	import { site, mailtoHref } from '$lib/site';
</script>

<footer class="footer">
	<div class="container grid">
		<div>
			<p class="brand">{site.clubName}</p>
			<p class="tagline">{site.tagline}</p>
		</div>

		<div>
			<p class="head">Contact</p>
			<ul>
				<li><a href={mailtoHref}>{site.email}</a></li>
				<li><a href={site.phoneHref}>{site.phoneDisplay}</a></li>
				<li>{site.location}</li>
			</ul>
		</div>

		<div>
			<p class="head">Find us</p>
			<ul>
				{#each site.socials as social (social.href)}
					<li><a href={social.href} rel="noreferrer">{social.label}</a></li>
				{/each}
				<li><a href="#plan">The plan</a></li>
				<li><a href="#faq">FAQ</a></li>
			</ul>
		</div>
	</div>

	<div class="container legal">
		<p>
			© 2026 {site.clubName}. Your ticks live in this browser on this device — nothing is
			uploaded, and clearing site data resets the plan.
		</p>
	</div>
</footer>

<style>
	.footer {
		padding-block: 3.5rem 2rem;
		background: var(--color-ink);
		color: var(--color-cream);
	}

	.grid {
		display: grid;
		grid-template-columns: 1.3fr 1fr 1fr;
		gap: 2.5rem;
	}

	.brand {
		font-size: 1.15rem;
		font-weight: 800;
	}

	.tagline {
		margin-top: 0.6rem;
		max-width: 22rem;
		font-size: 0.9rem;
		color: var(--color-cream-on-dark);
	}

	.head {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #ff8a70;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		margin-top: 0.8rem;
		font-size: 0.92rem;
		color: var(--color-cream-on-dark);
	}

	a {
		text-decoration: none;
	}

	a:hover {
		color: var(--color-cream);
		text-decoration: underline;
	}

	.legal {
		margin-top: 2.8rem;
		padding-top: 1.4rem;
		border-top: 1px solid rgba(250, 245, 238, 0.15);
		font-size: 0.8rem;
		color: var(--color-cream-on-dark);
	}

	@media (max-width: 760px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 1.8rem;
		}
	}
</style>
