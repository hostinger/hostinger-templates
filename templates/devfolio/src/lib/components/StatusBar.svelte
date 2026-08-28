<script lang="ts">
	import { resume } from '$lib/resume';

	const identity = `${resume.meta.username}@${resume.meta.hostname}`;

	const navItems = [
		{ label: 'about', href: '#about' },
		{ label: 'experience', href: '#experience' },
		{ label: 'projects', href: '#projects' },
		{ label: 'skills', href: '#skills' },
		{ label: 'contact', href: '#contact' }
	];
</script>

<header class="status-bar">
	<div class="container inner">
		<p class="identity">
			<span class="user">{identity}</span><span class="path">:~/resume</span>
		</p>
		<nav aria-label="Résumé sections">
			<ul>
				{#each navItems as item (item.href)}
					<li><a href={item.href}><span aria-hidden="true">./</span>{item.label}</a></li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	.status-bar {
		position: sticky;
		top: 0;
		z-index: 50;
		border-bottom: 1px solid var(--color-line);
		background: rgba(0, 0, 0, 0.88);
		backdrop-filter: blur(6px);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		column-gap: 1.5rem;
		row-gap: 0.1rem;
		padding-block: 0.7rem;
		font-size: 0.85rem;
	}

	.identity {
		white-space: nowrap;
	}

	.user {
		color: var(--color-green);
		font-weight: 700;
	}

	.path {
		color: var(--color-muted);
	}

	nav ul {
		display: flex;
		flex-wrap: wrap;
		column-gap: 1.15rem;
		row-gap: 0.1rem;
	}

	nav a {
		color: var(--color-muted);
		text-decoration: none;
	}

	nav a span {
		color: var(--color-dim);
	}

	nav a:hover {
		color: var(--color-green);
		text-shadow: var(--glow-green);
	}

	@media (max-width: 700px) {
		.path {
			display: none;
		}
	}

	@media (max-width: 380px) {
		nav ul {
			column-gap: 0.8rem;
		}

		.inner {
			font-size: 0.78rem;
		}
	}
</style>
