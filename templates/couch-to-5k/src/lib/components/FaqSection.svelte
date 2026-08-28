<script lang="ts">
	import { site } from '$lib/site';

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: site.faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	}).replace(/</g, '\\u003c');

	// Assembled in two parts so the component's own <script> block is not terminated early.
	const jsonLdTag = `<script type="application/ld+json">${faqJsonLd}</scr` + `ipt>`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD string is built locally from committed data -->
	{@html jsonLdTag}
</svelte:head>

<section id="faq" class="faq" aria-labelledby="faq-title">
	<div class="container">
		<p class="eyebrow">Good to know</p>
		<h2 id="faq-title">Questions new runners ask.</h2>

		<div class="list">
			{#each site.faqs as faq (faq.question)}
				<details class="item">
					<summary>
						<span>{faq.question}</span>
						<svg class="chevron" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
							<path
								d="M6 9l6 6 6-6"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</summary>
					<p class="answer">{faq.answer}</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.faq {
		padding-block: 4.5rem 5rem;
	}

	h2 {
		margin-top: 0.9rem;
		font-size: clamp(1.9rem, 3.4vw, 2.6rem);
		font-weight: 800;
		letter-spacing: -0.015em;
		line-height: 1.12;
	}

	.list {
		margin-top: 1.6rem;
		max-width: 48rem;
	}

	.item {
		border-bottom: 1px solid var(--color-line);
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem 0.2rem;
		cursor: pointer;
		font-size: 1.02rem;
		font-weight: 700;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.chevron {
		flex-shrink: 0;
		color: var(--color-coral-dark);
		transition: transform 180ms ease;
	}

	.item[open] .chevron {
		transform: rotate(180deg);
	}

	.answer {
		max-width: 44rem;
		padding: 0 0.2rem 1.25rem;
		color: var(--color-ink-soft);
	}

	@media (prefers-reduced-motion: reduce) {
		.chevron {
			transition: none;
		}
	}
</style>
