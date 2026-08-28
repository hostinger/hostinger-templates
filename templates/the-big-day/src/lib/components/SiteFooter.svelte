<script lang="ts">
	import { wedding } from '$lib/data/wedding';
</script>

<footer>
	<p>{wedding.footer.signoff},</p>
	<h2>{wedding.couple.first} <i>&</i> {wedding.couple.second}</h2>
	<div>
		<span>{wedding.date.short}</span>
		<span>{wedding.footer.note}</span>
		<a href="#top">Back to top ↑</a>
	</div>
</footer>
