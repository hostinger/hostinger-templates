<script lang="ts">
	import { wedding } from '$lib/data/wedding';
</script>

<section class="travel section" id="travel">
	<div class="travel-heading">
		<p class="eyebrow">Getting there & staying over</p>
		<h2>A little way<br />into the country</h2>
		<p>{wedding.travel.intro}</p>
		<a class="text-link" href={wedding.venue.mapUrl} target="_blank" rel="noreferrer">
			View {wedding.venue.name} on the map <span aria-hidden="true">↗</span>
		</a>
	</div>
	<div class="hotel-list">
		{#each wedding.travel.hotels as hotel, index (hotel.name)}
			<article>
				<span class="hotel-number">0{index + 1}</span>
				<div>
					<p class="hotel-distance">{hotel.distance}</p>
					<h3>{hotel.name}</h3>
					<p>{hotel.detail}</p>
					<a href={hotel.url} target="_blank" rel="noreferrer">Visit hotel <span aria-hidden="true">↗</span></a>
				</div>
			</article>
		{/each}
	</div>
</section>
