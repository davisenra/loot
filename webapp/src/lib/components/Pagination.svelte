<script lang="ts">
	let {
		page,
		totalPages,
		onchange
	}: {
		page: number;
		totalPages: number;
		onchange: (page: number) => void;
	} = $props();

	function pages(): (number | '...')[] {
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}
		const result: (number | '...')[] = [1];
		const start = Math.max(2, page - 1);
		const end = Math.min(totalPages - 1, page + 1);
		if (start > 2) result.push('...');
		for (let i = start; i <= end; i++) result.push(i);
		if (end < totalPages - 1) result.push('...');
		result.push(totalPages);
		return result;
	}
</script>

{#if totalPages > 1}
	<nav class="mt-8 flex items-center justify-center gap-2">
		<button
			class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:pointer-events-none disabled:opacity-50"
			disabled={page <= 1}
			onclick={() => onchange(page - 1)}
			aria-label="Previous page"
		>
			<span class="material-symbols-outlined">chevron_left</span>
		</button>

		{#each pages() as p (p === '...' ? `ellipsis-${page}` : p)}
			{#if p === '...'}
				<span class="flex h-9 w-9 items-center justify-center text-sm text-on-surface-variant">
					…
				</span>
			{:else}
				<button
					class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors {p ===
					page
						? 'bg-primary font-semibold text-on-primary'
						: 'text-on-surface-variant hover:bg-surface-container-low'}"
					onclick={() => onchange(p)}
					aria-label="Page {p}"
					aria-current={p === page ? 'page' : undefined}
				>
					{p}
				</button>
			{/if}
		{/each}

		<button
			class="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:pointer-events-none disabled:opacity-50"
			disabled={page >= totalPages}
			onclick={() => onchange(page + 1)}
			aria-label="Next page"
		>
			<span class="material-symbols-outlined">chevron_right</span>
		</button>
	</nav>
{/if}
