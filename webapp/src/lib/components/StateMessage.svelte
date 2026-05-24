<script lang="ts">
	let {
		type = 'loading',
		message = '',
		action
	}: {
		type?: 'loading' | 'empty' | 'error';
		message: string;
		action?: { label: string; href: string };
	} = $props();
</script>

<div class="py-20 text-center">
	<p class="font-body text-on-surface-variant">{message}</p>
	{#if action}
		<a
			href={action.href}
			class="mt-4 inline-block font-label text-sm text-primary hover:underline"
		>
			{action.label}
		</a>
	{/if}
</div>