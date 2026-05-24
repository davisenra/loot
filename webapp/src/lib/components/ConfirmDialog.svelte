<script lang="ts">
	import Button from './Button.svelte';

	let {
		open = false,
		title = 'Confirm',
		message = 'Are you sure?',
		confirmLabel = 'Confirm',
		onconfirm,
		oncancel
	}: {
		open: boolean;
		title?: string;
		message?: string;
		confirmLabel?: string;
		onconfirm: () => void;
		oncancel: () => void;
	} = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<button
			class="fixed inset-0 bg-on-surface/40 backdrop-blur-sm"
			onclick={oncancel}
			aria-label="Close dialog"
		></button>
		<div
			class="relative z-10 w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shadow-dialog"
		>
			<h3 class="mb-3 font-headline text-xl text-on-surface">{title}</h3>
			<p class="mb-8 font-body text-sm text-on-surface-variant">{message}</p>
			<div class="flex justify-end gap-4">
				<Button variant="tertiary" onclick={oncancel}>Cancel</Button>
				<Button variant="danger" onclick={onconfirm}>{confirmLabel}</Button>
			</div>
		</div>
	</div>
{/if}
