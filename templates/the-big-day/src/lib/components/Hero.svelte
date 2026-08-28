<script lang="ts">
	import { wedding } from '$lib/data/wedding';
	import coupleImage from '$lib/assets/images/couple-garden.jpg';
</script>

<section class="hero" id="top">
	<div class="hero-copy">
		<p class="eyebrow">{wedding.hero.eyebrow}</p>
		<h1>
			<span>{wedding.couple.first}</span>
			<i>&</i>
			<span>{wedding.couple.second}</span>
		</h1>
		<div class="hero-details">
			<p>{wedding.date.display}</p>
			<span aria-hidden="true">✦</span>
			<p>{wedding.venue.location}</p>
		</div>
		<p class="hero-note">{wedding.hero.note}</p>
		<a class="button button-primary" href="#rsvp">Kindly reply</a>
	</div>
	<figure class="hero-image">
		<img src={coupleImage} alt="A couple holding hands at the water’s edge at sunset" />
		<figcaption>{wedding.date.short}</figcaption>
	</figure>
	<svg class="botanical botanical-left" viewBox="0 0 210 360" aria-hidden="true">
		<path d="M32 352C47 251 75 152 174 28M66 253c-22-39-25-69-4-92 25 32 26 64 4 92Zm28-70c10-42 31-67 64-71-3 40-26 65-64 71Zm24-62c-14-35-10-63 11-79 18 32 14 59-11 79Z" />
	</svg>
</section>
