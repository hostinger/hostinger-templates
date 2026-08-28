<script lang="ts">
	import { progress } from '$lib/progress.svelte';
	import { totalSessions } from '$lib/plan';

	let confirming = $state(false);
	let cleared = $state(false);

	function requestReset() {
		confirming = true;
		cleared = false;
	}

	function cancelReset() {
		confirming = false;
	}

	function confirmReset() {
		progress.reset();
		confirming = false;
		cleared = true;
	}
</script>

<div class="reset">
	{#if confirming}
		<p class="question">Clear all {totalSessions} ticks saved on this device?</p>
		<div class="choices">
			<button type="button" class="btn-confirm" onclick={confirmReset}>Yes, reset</button>
			<button type="button" class="btn-cancel" onclick={cancelReset}>Keep my progress</button>
		</div>
	{:else}
		<button type="button" class="btn-reset" onclick={requestReset}>
			<svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14">
				<path
					d="M4.5 10a8 8 0 1 1 1.6 6.4"
					fill="none"
					stroke="currentColor"
					stroke-width="2.6"
					stroke-linecap="round"
				/>
				<path
					d="M4.5 4.5v6h6"
					fill="none"
					stroke="currentColor"
					stroke-width="2.6"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Reset progress
		</button>
	{/if}
	<p class="status" role="status">{cleared && !confirming ? 'Progress cleared.' : ''}</p>
</div>

<style>
	.reset {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.45rem;
	}

	.btn-reset {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.95rem;
		background: transparent;
		border: 1.5px solid rgba(195, 51, 23, 0.45);
		border-radius: var(--radius-pill);
		color: var(--color-coral-dark);
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
		transition:
			border-color 140ms ease,
			background 140ms ease;
	}

	.btn-reset:hover {
		background: var(--color-coral-tint);
		border-color: var(--color-coral-dark);
	}

	.question {
		max-width: 250px;
		font-size: 0.85rem;
		font-weight: 600;
		text-align: right;
	}

	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.btn-confirm {
		padding: 0.45rem 0.9rem;
		background: var(--color-coral-dark);
		border: none;
		border-radius: var(--radius-pill);
		color: var(--color-cream);
		font-size: 0.82rem;
		font-weight: 700;
		cursor: pointer;
		transition: filter 140ms ease;
	}

	.btn-confirm:hover {
		filter: brightness(1.12);
	}

	.btn-cancel {
		padding: 0.45rem 0.9rem;
		background: transparent;
		border: 1.5px solid rgba(16, 29, 58, 0.3);
		border-radius: var(--radius-pill);
		color: var(--color-ink);
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition: border-color 140ms ease;
	}

	.btn-cancel:hover {
		border-color: var(--color-ink);
	}

	.status {
		min-height: 1.1em;
		margin: 0;
		font-size: 0.78rem;
		color: var(--color-ink-soft);
	}

	@media (max-width: 760px) {
		.reset {
			align-items: flex-start;
		}

		.question {
			text-align: left;
		}
	}
</style>
