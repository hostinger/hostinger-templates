<script lang="ts">
	import { tick } from 'svelte';
	import { wedding } from '$lib/data/wedding';
	import type { RsvpValues } from '$lib/types/wedding';

	let values = $state<RsvpValues>({
		name: '',
		attendance: '',
		hasPlusOne: false,
		plusOneName: '',
		dietaryNeeds: '',
		message: ''
	});
	let errors = $state<Record<string, string>>({});
	let status = $state('');
	let submitted = $state(false);

	const validate = () => {
		const nextErrors: Record<string, string> = {};

		if (!values.name.trim()) nextErrors.name = 'Please tell us your name.';
		if (!values.attendance) nextErrors.attendance = 'Please choose whether you can join us.';
		if (values.attendance === 'yes' && values.hasPlusOne && !values.plusOneName.trim()) {
			nextErrors.plusOneName = 'Please add your guest’s name.';
		}

		errors = nextErrors;
		return Object.keys(nextErrors).length === 0;
	};

	const focusFirstError = async () => {
		await tick();
		const firstField = errors.name
			? document.querySelector<HTMLElement>('#name')
			: errors.attendance
				? document.querySelector<HTMLElement>('input[name="attendance"]')
				: document.querySelector<HTMLElement>('#plus-one');
		firstField?.focus();
	};

	const buildMailto = () => {
		const attendance = values.attendance === 'yes' ? 'Joyfully accepts' : 'Regretfully declines';
		const body = [
			`Name: ${values.name.trim()}`,
			`Response: ${attendance}`,
			values.attendance === 'yes'
				? `Guest: ${values.hasPlusOne ? values.plusOneName.trim() : 'No guest'}`
				: '',
			`Dietary needs: ${values.dietaryNeeds.trim() || 'None shared'}`,
			`Message: ${values.message.trim() || '—'}`
		]
			.filter(Boolean)
			.join('\n');

		return `mailto:${wedding.rsvp.email}?subject=${encodeURIComponent(`RSVP — ${values.name.trim()}`)}&body=${encodeURIComponent(body)}`;
	};

	const submit = async (event: SubmitEvent) => {
		event.preventDefault();
		status = '';
		submitted = false;

		if (!validate()) {
			status = 'Please check the highlighted fields.';
			await focusFirstError();
			return;
		}

		submitted = true;
		if (wedding.rsvp.email.trim()) {
			status = 'Your email app is opening with a prepared RSVP. Please review and send it to finish.';
			window.location.href = buildMailto();
		} else {
			status = 'Response saved on this screen only. Nothing was sent because an RSVP email is not configured.';
		}
	};

	const reset = () => {
		values = {
			name: '',
			attendance: '',
			hasPlusOne: false,
			plusOneName: '',
			dietaryNeeds: '',
			message: ''
		};
		errors = {};
		submitted = false;
		status = '';
	};
</script>

<section class="rsvp" id="rsvp">
	<div class="rsvp-intro">
		<p class="eyebrow">Will you join us?</p>
		<h2>Kindly reply</h2>
		<p>Please send your response by <strong>{wedding.rsvp.deadline}</strong>.</p>
		<p class="rsvp-note">
			{#if wedding.rsvp.email}
				Submitting prepares an email in your email app. You will still need to send it.
			{:else}
				Demo mode: your response will stay in this browser and will not be sent.
			{/if}
		</p>
	</div>

	{#if submitted}
		<div class="success-card" tabindex="-1">
			<span aria-hidden="true">✿</span>
			<h3>Thank you, {values.name.trim()}.</h3>
			<p role="status">{status}</p>
			<button class="text-button" type="button" onclick={reset}>Change response</button>
		</div>
	{:else}
		<form onsubmit={submit} novalidate>
			<div class="field field-full">
				<label for="name">Your name <span aria-hidden="true">*</span></label>
				<input
					id="name"
					name="name"
					type="text"
					autocomplete="name"
					bind:value={values.name}
					aria-invalid={errors.name ? 'true' : undefined}
					aria-describedby={errors.name ? 'name-error' : undefined}
				/>
				{#if errors.name}<p class="field-error" id="name-error">{errors.name}</p>{/if}
			</div>

			<fieldset class="field field-full" aria-describedby={errors.attendance ? 'attendance-error' : undefined}>
				<legend>Can you celebrate with us? <span aria-hidden="true">*</span></legend>
				<div class="choice-row">
					<label class="choice">
						<input
							type="radio"
							name="attendance"
							value="yes"
							bind:group={values.attendance}
						/>
						<span>Joyfully accepts</span>
					</label>
					<label class="choice">
						<input type="radio" name="attendance" value="no" bind:group={values.attendance} />
						<span>Regretfully declines</span>
					</label>
				</div>
				{#if errors.attendance}<p class="field-error" id="attendance-error">{errors.attendance}</p>{/if}
			</fieldset>

			{#if values.attendance === 'yes'}
				<div class="field field-full plus-one">
					<label class="check-choice">
						<input type="checkbox" bind:checked={values.hasPlusOne} />
						<span>I am bringing the guest named on my invitation</span>
					</label>
					{#if values.hasPlusOne}
						<label for="plus-one">Guest’s name <span aria-hidden="true">*</span></label>
						<input
							id="plus-one"
							name="plusOneName"
							type="text"
							autocomplete="name"
							bind:value={values.plusOneName}
							aria-invalid={errors.plusOneName ? 'true' : undefined}
							aria-describedby={errors.plusOneName ? 'plus-one-error' : undefined}
						/>
						{#if errors.plusOneName}<p class="field-error" id="plus-one-error">{errors.plusOneName}</p>{/if}
					{/if}
				</div>
			{/if}

			<div class="field">
				<label for="dietary">Dietary needs</label>
				<textarea id="dietary" name="dietaryNeeds" rows="3" bind:value={values.dietaryNeeds}></textarea>
			</div>
			<div class="field">
				<label for="message">A note for us</label>
				<textarea id="message" name="message" rows="3" bind:value={values.message}></textarea>
			</div>

			<div class="form-footer field-full">
				<p aria-live="polite">{status}</p>
				<button class="button button-light" type="submit">Send my reply <span aria-hidden="true">→</span></button>
			</div>
		</form>
	{/if}
</section>
