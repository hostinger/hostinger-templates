<script lang="ts">
	import { mailtoHref, prompt, resume } from '$lib/resume';
</script>

<section id="contact" class="man-section container" aria-labelledby="contact-title">
	<p class="section-cmd" aria-hidden="true">{prompt} <span class="cmd">contact</span></p>
	<h2 id="contact-title">Contact</h2>
	<div class="man-body">
		<p class="lede">{resume.contactLede}</p>
		<p class="email-line">
			<a class="email" href={mailtoHref}>{resume.email}</a>
		</p>
		<ul class="socials">
			{#each resume.socials as social (social.href)}
				<li>
					<a class="bracket-link" href={social.href} target="_blank" rel="noreferrer"
						>{social.label.toLowerCase()}</a
					>
				</li>
			{/each}
		</ul>
		<p class="location">{resume.location}</p>
	</div>
</section>

<style>
	.lede {
		max-width: 60ch;
	}

	.email-line {
		margin-top: 1.3rem;
	}

	.email {
		display: inline-block;
		padding: 0.7rem 1.1rem;
		border: 1px solid var(--color-amber);
		border-radius: var(--radius-small);
		color: var(--color-amber);
		font-size: clamp(0.95rem, 2.6vw, 1.15rem);
		font-weight: 700;
		text-decoration: none;
		overflow-wrap: anywhere;
		transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease;
	}

	.email:hover {
		background: var(--color-amber);
		color: #1c1200;
		box-shadow: var(--glow-amber);
	}

	.socials {
		display: flex;
		flex-wrap: wrap;
		gap: 1.1rem;
		margin-top: 1.2rem;
	}

	.location {
		margin-top: 1.1rem;
		color: var(--color-dim);
		font-size: 0.9rem;
	}
</style>
