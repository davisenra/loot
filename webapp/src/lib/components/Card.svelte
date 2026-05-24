<script lang="ts">
	let {
		variant = 'filled',
		children
	}: {
		variant?: 'filled' | 'ghost' | 'elevated';
		children?: import('svelte').Snippet;
	} = $props();

	const variantClasses: Record<string, string> = {
		filled: 'rounded-2xl bg-surface-container-low p-8',
		ghost: 'ghost-border rounded-2xl bg-surface-container-lowest p-8',
		elevated: 'rounded-xl bg-surface-container-lowest p-8 shadow-elevated'
	};
</script>

<div class={variantClasses[variant]}>
	{#if children}{@render children()}{/if}
</div>