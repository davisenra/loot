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

	const icons: Record<string, string> = {
		loading: 'progress_activity',
		empty: 'inbox',
		error: 'error'
	};
</script>

<div class="py-20 text-center">
	<span
		class="material-symbols-outlined mb-2 text-3xl text-on-surface-variant {type === 'loading'
			? 'animate-spin'
			: ''}"
	>
		{icons[type]}
	</span>
	<p class="font-body text-on-surface-variant">{message}</p>
	{#if action}
		<a href={action.href} class="mt-4 inline-block font-label text-sm text-primary hover:underline">
			{action.label}
		</a>
	{/if}
</div>
