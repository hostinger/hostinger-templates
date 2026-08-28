<script lang="ts">
	import type { PlanSession } from '$lib/types';
	import { progress } from '$lib/progress.svelte';
	import { formatMinutes } from '$lib/format';

	let { session, id, number }: { session: PlanSession; id: string; number: number } = $props();
</script>

<li class="session">
	<input
		class="check-input"
		type="checkbox"
		{id}
		checked={progress.isDone(id)}
		onchange={() => progress.toggle(id)}
	/>
	<label class="card" for={id}>
		<span class="check-box" aria-hidden="true">
			<svg viewBox="0 0 24 24" width="15" height="15">
				<path
					d="M5 12.5 10 17.5 19 7"
					fill="none"
					stroke="currentColor"
					stroke-width="3.4"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
		<span class="text">
			<span class="title">Session {number} — {session.title}</span>
			<span class="workout">{session.workout}</span>
		</span>
		<span class="meta">
			<span class="minutes">{formatMinutes(session.minutes)}</span>
			<span class="done-tag">Done</span>
		</span>
	</label>
</li>

<style>
	.session {
		position: relative;
		display: flex;
		min-width: 0;
	}

	.check-input {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: 0;
		opacity: 0;
	}

	.card {
		flex: 1;
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		padding: 1rem 1.05rem;
		background: var(--color-card);
		border: 1.5px solid var(--color-line);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			border-color 150ms ease,
			background 150ms ease;
	}

	.card:hover {
		border-color: rgba(16, 29, 58, 0.4);
	}

	.check-box {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		flex-shrink: 0;
		margin-top: 2px;
		border: 2px solid rgba(16, 29, 58, 0.35);
		border-radius: 8px;
		color: transparent;
		transition:
			background 150ms ease,
			border-color 150ms ease,
			color 150ms ease;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		min-width: 0;
	}

	.title {
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.35;
	}

	.workout {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-ink-soft);
	}

	.meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.4rem;
		flex-shrink: 0;
		margin-left: auto;
	}

	.minutes {
		padding: 0.2rem 0.55rem;
		background: rgba(16, 29, 58, 0.07);
		border-radius: var(--radius-pill);
		color: var(--color-ink-soft);
		font-size: 0.74rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.done-tag {
		visibility: hidden;
		color: var(--color-coral-dark);
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.session:has(.check-input:checked) .card {
		background: var(--color-coral-tint);
		border-color: var(--color-coral);
	}

	.session:has(.check-input:checked) .check-box {
		background: var(--color-coral);
		border-color: var(--color-coral);
		color: var(--color-cream);
	}

	.session:has(.check-input:checked) .done-tag {
		visibility: visible;
	}

	.session:has(.check-input:focus-visible) .card {
		outline: 3px solid var(--color-coral);
		outline-offset: 2px;
	}

	@media (max-width: 380px) {
		.card {
			flex-wrap: wrap;
		}

		.meta {
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			gap: 0.6rem;
			width: calc(100% - 26px - 0.85rem);
			margin-left: calc(26px + 0.85rem);
		}
	}
</style>
