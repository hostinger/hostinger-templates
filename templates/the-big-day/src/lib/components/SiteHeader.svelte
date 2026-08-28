<script lang="ts">
	import { wedding } from '$lib/data/wedding';
</script>

<header class="site-header">
	<a class="monogram" href="#top" aria-label={`${wedding.couple.first} and ${wedding.couple.second}, home`}>
		{wedding.couple.monogram}
	</a>
	<nav aria-label="Main navigation">
		{#each wedding.navigation as item (item.href)}
			<a href={item.href}>{item.label}</a>
		{/each}
	</nav>
	<a class="header-rsvp" href="#rsvp">Reply by {wedding.rsvp.deadline}</a>
</header>
