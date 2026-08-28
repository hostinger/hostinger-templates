<script lang="ts">
	import { faqs, prompt } from '$lib/resume';

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
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

<section id="faq" class="man-section container" aria-labelledby="faq-title">
	<p class="section-cmd" aria-hidden="true">{prompt} <span class="cmd">man faq</span></p>
	<h2 id="faq-title">FAQ</h2>
	<div class="man-body list">
		{#each faqs as faq (faq.question)}
			<details class="item">
				<summary>
					<span class="marker" aria-hidden="true">&gt;</span>
					<span class="question">{faq.question}</span>
				</summary>
				<p class="answer">{faq.answer}</p>
			</details>
		{/each}
	</div>
</section>

<style>
	.list {
		max-width: 72ch;
	}

	.item {
		border-bottom: 1px dashed var(--color-line);
	}

	summary {
		display: flex;
		align-items: baseline;
		gap: 1ch;
		padding: 0.95rem 0.2rem;
		cursor: pointer;
		font-weight: 700;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.marker {
		flex-shrink: 0;
		color: var(--color-dim);
		transition: color 140ms ease;
	}

	.item[open] .marker {
		color: var(--color-amber);
	}

	.question {
		color: var(--color-text);
	}

	summary:hover .question {
		color: var(--color-green);
	}

	.answer {
		max-width: 68ch;
		padding: 0 0.2rem 1.15rem 3ch;
		color: var(--color-muted);
	}
</style>
