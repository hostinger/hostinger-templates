<script lang="ts">
	import { wedding } from '$lib/data/wedding';
</script>

<section class="faq section" id="faq">
	<div class="faq-heading">
		<p class="eyebrow">Good to know</p>
		<h2>A few small details</h2>
	</div>
	<div class="faq-list">
		{#each wedding.faq as item (item.question)}
			<details>
				<summary>
					{item.question}
					<span aria-hidden="true">+</span>
				</summary>
				<p>{item.answer}</p>
			</details>
		{/each}
	</div>
</section>
