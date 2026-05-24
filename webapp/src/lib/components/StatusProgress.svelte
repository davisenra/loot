<script lang="ts">
	import { statusPipeline, statusLabels, type Status } from '$lib/status';

	let { status }: { status: Status } = $props();

	let currentIndex = $derived(statusPipeline.indexOf(status));
	let isTerminal = $derived(status === 'archived' || status === 'returned');
</script>

<div class="flex items-center gap-0">
	{#if isTerminal}
		<div class="flex items-center gap-3">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full {status === 'returned'
					? 'bg-error-container'
					: 'bg-surface-container'}"
			>
				<span
					class="material-symbols-outlined text-sm {status === 'returned'
						? 'text-on-error-container'
						: 'text-on-surface-variant'}"
				>
					{status === 'returned' ? 'undo' : 'archive'}
				</span>
			</div>
			<span class="font-label text-sm {status === 'returned' ? 'text-error' : 'text-on-surface-variant'}">
				{statusLabels[status]}
			</span>
		</div>
	{:else}
		{#each statusPipeline as step, i (step)}
			<div class="flex items-center">
				<div class="flex flex-col items-center">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full transition-colors {i < currentIndex
							? 'bg-primary text-on-primary'
							: i === currentIndex
								? 'bg-primary text-on-primary ring-2 ring-primary/30'
								: 'bg-surface-container-high text-on-surface-variant'}"
					>
						{#if i < currentIndex}
							<span class="material-symbols-outlined filled-icon text-sm">check</span>
						{:else}
							<span class="font-label text-xs">{i + 1}</span>
						{/if}
					</div>
					<span
						class="mt-2 font-label text-xs {i <= currentIndex
							? 'text-on-surface'
							: 'text-on-surface-variant'}"
					>
						{statusLabels[step]}
					</span>
				</div>
				{#if i < statusPipeline.length - 1}
					<div
						class="mx-1 h-0.5 w-10 transition-colors {i < currentIndex
							? 'bg-primary'
							: 'bg-surface-container-highest'}"
					></div>
				{/if}
			</div>
		{/each}
	{/if}
</div>