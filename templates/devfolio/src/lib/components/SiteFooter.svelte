<script lang="ts">
	import { prompt, resume } from '$lib/resume';

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="container">
		<p class="exit" aria-hidden="true">
			<span class="prompt">{prompt}</span> <span class="cmd">exit</span><br />
			<span class="logout">logout</span>
		</p>
		<p class="legal">
			© {year}
			{resume.name}. MIT-licensed template — fork it and make it yours.
		</p>
	</div>
</footer>

<style>
	.footer {
		margin-top: 4.5rem;
		padding-block: 2.2rem 2.6rem;
		border-top: 1px solid var(--color-line);
	}

	.exit .prompt {
		color: var(--color-green);
	}

	.exit .cmd {
		color: var(--color-amber);
	}

	.logout {
		color: var(--color-dim);
	}

	.legal {
		margin-top: 1.3rem;
		color: var(--color-muted);
		font-size: 0.85rem;
	}
</style>
