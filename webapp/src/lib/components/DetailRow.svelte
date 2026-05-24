<script lang="ts">
	let {
		label,
		highlight = false,
		children
	}: {
		label: string;
		highlight?: boolean;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<div class="flex justify-between text-on-surface-variant">
	<span>{label}</span>
	{#if children}
		<span
			class={highlight
				? 'font-headline text-3xl font-bold text-primary'
				: 'font-medium text-on-surface'}
		>
			{@render children()}
		</span>
	{/if}
</div>