<script lang="ts">
	let {
		title,
		backHref,
		backLabel,
		children
	}: {
		title?: string;
		backHref?: string;
		backLabel?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<header class="mb-8 md:mb-16">
	{#if backHref && backLabel}
		<a
			href={backHref}
			class="group mb-6 inline-flex items-center gap-2 font-label text-sm text-on-surface-variant transition-colors hover:text-primary"
		>
			<span
				class="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1"
			>
				arrow_back
			</span>
			{backLabel}
		</a>
	{/if}
	{#if children}
		{@render children()}
	{:else if title}
		<h2 class="font-headline text-4xl tracking-tight text-on-surface md:text-6xl">{title}</h2>
	{/if}
</header>
