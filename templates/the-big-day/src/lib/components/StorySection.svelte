<script lang="ts">
	import { wedding } from '$lib/data/wedding';
	import venueImage from '$lib/assets/images/garden-table.jpg';
</script>

<section class="story section" id="story">
	<div class="story-image-wrap">
		<img src={venueImage} alt="A long wedding table set beneath lush garden trees" />
		<span aria-hidden="true">Late summer, at last</span>
	</div>
	<div class="story-copy">
		<p class="eyebrow">{wedding.story.kicker}</p>
		<h2>{wedding.story.title}</h2>
		{#each wedding.story.paragraphs as paragraph (paragraph)}
			<p>{paragraph}</p>
		{/each}
		<p class="signature">{wedding.couple.first} & {wedding.couple.second}</p>
	</div>
</section>
