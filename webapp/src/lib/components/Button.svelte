<script lang="ts">
	let {
		variant = 'primary',
		href,
		type = 'button',
		disabled = false,
		class: className = '',
		onclick,
		children
	}: {
		variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children?: import('svelte').Snippet;
	} = $props();

	const base = 'inline-flex items-center gap-2 font-label text-sm transition-colors duration-300';

	const variants: Record<string, string> = {
		primary:
			'rounded-full bg-primary px-4 py-3 text-on-primary hover:bg-primary-container hover:text-on-primary-container disabled:cursor-not-allowed disabled:opacity-50',
		secondary:
			'rounded-full bg-surface-container-lowest px-5 py-2.5 text-on-surface-variant shadow-ghost hover:bg-surface-container hover:text-primary',
		tertiary:
			'px-6 py-3 text-on-surface-variant underline decoration-on-surface-variant underline-offset-4 hover:no-underline',
		danger:
			'rounded-full px-5 py-2.5 text-on-surface-variant shadow-ghost hover:bg-error/10 hover:text-error'
	};

	const classes = $derived(`${base} ${variants[variant]} ${className}`);

	function handleClick(e: MouseEvent) {
		if (!disabled && onclick) onclick(e);
	}
</script>

{#if href}
	<a href={href} class={classes} onclick={handleClick}>
		{#if children}{@render children()}{/if}
	</a>
{:else}
	<button {type} {disabled} class={classes} onclick={handleClick}>
		{#if children}{@render children()}{/if}
	</button>
{/if}