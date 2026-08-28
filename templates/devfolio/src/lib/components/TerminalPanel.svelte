<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { prompt, resume } from '$lib/resume';
	import { ASCII_BANNER } from '$lib/terminal/banner';
	import { completeCommand, executeCommand } from '$lib/terminal/commands';
	import { text, type TerminalLine } from '$lib/terminal/output';

	interface Entry {
		id: number;
		command: string;
		lines: TerminalLine[];
	}

	const QUICK_COMMANDS = ['help', 'about', 'experience', 'projects', 'skills', 'contact'];

	let ready = $state(false);
	let cleared = $state(false);
	let entries = $state<Entry[]>([]);
	let value = $state('');
	let inputEl: HTMLInputElement | undefined = $state();
	let outputEl: HTMLDivElement | undefined = $state();

	let history: string[] = [];
	let historyIndex: number | null = null;
	let draft = '';
	let nextId = 0;

	onMount(() => {
		ready = true;
	});

	// Keep the latest output in view whenever an entry is added or cleared.
	$effect(() => {
		void entries.length;
		void cleared;
		if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
	});

	async function moveCaretToEnd() {
		await tick();
		inputEl?.setSelectionRange(value.length, value.length);
	}

	function runCommand(raw: string) {
		const command = raw.trim();
		if (command) history.push(command);
		historyIndex = null;
		draft = '';

		const outcome = executeCommand(command);
		if (outcome.kind === 'clear') {
			entries = [];
			cleared = true;
		} else {
			entries.push({ id: nextId++, command: raw, lines: outcome.lines });
		}
		value = '';
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			runCommand(value);
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (history.length === 0) return;
			if (historyIndex === null) {
				draft = value;
				historyIndex = history.length - 1;
			} else if (historyIndex > 0) {
				historyIndex -= 1;
			}
			value = history[historyIndex];
			moveCaretToEnd();
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (historyIndex === null) return;
			if (historyIndex < history.length - 1) {
				historyIndex += 1;
				value = history[historyIndex];
			} else {
				historyIndex = null;
				value = draft;
			}
			moveCaretToEnd();
			return;
		}

		if (event.key === 'Tab') {
			event.preventDefault();
			const { completed, candidates } = completeCommand(value);
			if (completed) {
				value = completed;
				moveCaretToEnd();
			} else if (candidates.length > 1) {
				// Bash-style: echo the half-typed command and list the matches.
				entries.push({
					id: nextId++,
					command: value,
					lines: [text(candidates.join('   '), 'muted')]
				});
			}
			return;
		}

		// Any other key exits history navigation and edits the live line.
		historyIndex = null;
	}

	function focusInput(event: MouseEvent) {
		// Don't steal focus from links and buttons, or from an in-progress selection.
		const target = event.target as HTMLElement;
		if (target.closest('a, button, input')) return;
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) return;
		inputEl?.focus();
	}

	function runQuick(command: string) {
		runCommand(command);
		inputEl?.focus();
	}

	function isExternal(href: string) {
		return href.startsWith('http');
	}
</script>

<section class="terminal" aria-label="Interactive terminal résumé">
	<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
	<div class="frame" onclick={focusInput}>
		<div class="titlebar" aria-hidden="true">
			<span class="dot dot--amber"></span>
			<span class="dot dot--dim"></span>
			<span class="dot dot--green"></span>
			<span class="title">{resume.meta.username}@{resume.meta.hostname}: ~/resume</span>
		</div>

		<div class="screen" bind:this={outputEl}>
			<div class="output" role="log" aria-live="polite" aria-label="Terminal output">
				{#if !cleared}
					<div class="welcome">
						<pre class="banner" aria-hidden="true">{ASCII_BANNER}</pre>
						<p class="sr-only">{resume.meta.siteTitle} — an interactive terminal résumé.</p>
						<p class="caption">{resume.name} — {resume.role} · {resume.location}</p>
						<p class="hint">
							Type <kbd>help</kbd> to list commands. Try <kbd>projects</kbd> or
							<kbd>experience</kbd>.
						</p>
						<noscript>
							<p class="noscript">
								JavaScript is off, so this prompt stays quiet — the full résumé continues as
								regular HTML <a href="#resume">just below</a>.
							</p>
						</noscript>
					</div>
				{/if}

				{#each entries as entry (entry.id)}
					<div class="entry">
						<!-- The command keeps a leading space (template literal, since Svelte trims plain boundary whitespace) so copied lines read `user@host:~$ cmd`. -->
						<p class="echo"><span class="prompt" aria-hidden="true">{prompt}</span><span
								class="cmd">{` ${entry.command}`}</span></p>
						{#each entry.lines as line, lineIndex (lineIndex)}
							{#if line.type === 'blank'}
								<p class="line" aria-hidden="true">&nbsp;</p>
							{:else if line.type === 'heading'}
								<p class="line line--heading">{line.text}</p>
							{:else if line.type === 'text'}
								<p class="line line--{line.tone} indent-{line.indent}">{line.text}</p>
							{:else if line.type === 'pair'}
								<p class="line line--pair">
									<span class="pair-key">{line.key}</span><span class="pair-value"
										>{line.value}</span
									>
								</p>
							{:else}
								<p class="line line--links indent-{line.indent}">
									{#each line.links as link (link.href)}
										<a
											class="bracket-link"
											href={link.href}
											target={isExternal(link.href) ? '_blank' : undefined}
											rel={isExternal(link.href) ? 'noreferrer' : undefined}>{link.label}</a
										>
									{/each}
								</p>
							{/if}
						{/each}
					</div>
				{/each}
			</div>

			<div class="input-line">
				<label class="sr-only" for="terminal-input"
					>Terminal command. Type help and press Enter to list commands.</label
				>
				<span class="prompt" aria-hidden="true">{prompt}</span>
				<input
					id="terminal-input"
					bind:this={inputEl}
					bind:value
					onkeydown={onKeydown}
					type="text"
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
					enterkeyhint="go"
					disabled={!ready}
					style:width="{Math.max(value.length + 1, 2)}ch"
					aria-describedby="terminal-help"
				/>
				<span class="cursor" aria-hidden="true"></span>
			</div>
			<p id="terminal-help" class="sr-only">
				Use the up and down arrow keys to move through command history. Press Tab to complete a
				command name.
			</p>
		</div>

		{#if ready}
			<div class="quick">
				<span class="quick-label" aria-hidden="true">try:</span>
				{#each QUICK_COMMANDS as command (command)}
					<button type="button" class="quick-btn" onclick={() => runQuick(command)}
						>{command}</button
					>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.frame {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-line-strong);
		border-radius: var(--radius-panel);
		background: var(--color-panel);
		box-shadow:
			0 0 0 1px rgba(55, 242, 109, 0.06),
			0 0 44px rgba(55, 242, 109, 0.13),
			inset 0 0 70px rgba(55, 242, 109, 0.05);
	}

	.titlebar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 0.95rem;
		border-bottom: 1px solid var(--color-line);
	}

	.dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.dot--amber {
		background: var(--color-amber);
	}

	.dot--dim {
		background: var(--color-dim);
	}

	.dot--green {
		background: var(--color-green);
	}

	.title {
		margin-left: 0.5rem;
		color: var(--color-dim);
		font-size: 0.8rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.screen {
		height: clamp(320px, 52vh, 460px);
		padding: 1rem 1.1rem;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		scrollbar-color: var(--color-line-strong) transparent;
		font-size: 0.92rem;
	}

	.banner {
		color: var(--color-green);
		text-shadow: var(--glow-green);
		font-size: clamp(0.4rem, 2.7vw, 0.78rem);
		line-height: 1.25;
		overflow-x: auto;
	}

	.caption {
		margin-top: 0.8rem;
		color: var(--color-text);
		font-weight: 700;
	}

	.hint,
	.noscript {
		margin-top: 0.45rem;
		color: var(--color-muted);
	}

	.entry {
		margin-top: 0.9rem;
	}

	.echo {
		white-space: pre-wrap;
	}

	.echo .prompt {
		color: var(--color-green);
	}

	.echo .cmd {
		color: var(--color-amber);
		overflow-wrap: anywhere;
	}

	.line {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.line--heading {
		color: var(--color-green);
		font-weight: 700;
		letter-spacing: 0.1em;
	}

	.line--muted {
		color: var(--color-muted);
	}

	.line--accent {
		color: var(--color-amber);
		font-weight: 700;
	}

	.line--error {
		color: var(--color-error);
	}

	.indent-1 {
		padding-left: 2ch;
	}

	.indent-2 {
		padding-left: 4ch;
	}

	.pair-key {
		display: inline-block;
		min-width: 12ch;
		padding-right: 1ch;
		color: var(--color-green);
	}

	.line--links a {
		margin-right: 1.25ch;
	}

	.input-line {
		display: flex;
		align-items: center;
		margin-top: 0.9rem;
		overflow-x: hidden;
	}

	.input-line .prompt {
		flex-shrink: 0;
		color: var(--color-green);
		margin-right: 1ch;
	}

	.input-line input {
		max-width: 100%;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--color-amber);
		font: inherit;
		caret-color: var(--color-amber);
	}

	.input-line input:focus {
		outline: none;
	}

	.input-line input:disabled {
		opacity: 0.55;
	}

	.cursor {
		flex-shrink: 0;
		width: 0.62em;
		height: 1.25em;
		background: var(--color-amber);
		box-shadow: var(--glow-amber);
		animation: blink 1.1s steps(2, start) infinite;
	}

	/* The native amber caret takes over while typing. */
	.input-line:focus-within .cursor {
		opacity: 0;
		animation: none;
	}

	/* Without JavaScript the prompt is disabled — show a calm, steady block. */
	input:disabled + .cursor {
		opacity: 0.35;
		animation: none;
		box-shadow: none;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.quick {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
		padding: 0.65rem 0.95rem;
		border-top: 1px solid var(--color-line);
	}

	.quick-label {
		color: var(--color-dim);
		font-size: 0.8rem;
		margin-right: 0.2rem;
	}

	.quick-btn {
		padding: 0.14rem 0.6rem;
		border: 1px solid var(--color-line-strong);
		border-radius: var(--radius-small);
		background: var(--color-raised);
		color: var(--color-muted);
		font-size: 0.8rem;
	}

	.quick-btn:hover {
		border-color: var(--color-green);
		color: var(--color-green);
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor {
			animation: none;
		}
	}

	@media (max-width: 480px) {
		.screen {
			height: clamp(300px, 48vh, 420px);
			padding-inline: 0.8rem;
			font-size: 0.86rem;
		}

		.pair-key {
			min-width: 9ch;
		}
	}
</style>
