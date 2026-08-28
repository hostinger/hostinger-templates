<script lang="ts">
	import { wedding } from '$lib/data/wedding';
</script>

<section class="schedule-section" id="schedule">
	<div class="schedule-heading">
		<p class="eyebrow">Order of celebrations</p>
		<h2>One fine day</h2>
		<p>Everything happens at {wedding.venue.name}. Arrive hungry, leave happy.</p>
	</div>
	<div class="schedule-ribbon">
		{#each wedding.schedule as item, index (item.time)}
			<article class:offset={index % 2 === 1}>
				<time>{item.time}</time>
				<div class="schedule-dot" aria-hidden="true"></div>
				<h3>{item.title}</h3>
				<p>{item.detail}</p>
			</article>
		{/each}
	</div>
</section>
