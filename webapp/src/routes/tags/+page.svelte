<script lang="ts">
	import { fetchTags, fetchTagOrderCounts, deleteTag } from '$lib/data/orders';
	import type { TagsRecord } from '$lib/types';
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import StateMessage from '$lib/components/StateMessage.svelte';

	let tags: TagsRecord[] = $state([]);
	let orderCounts: Map<string, number> = $state(new Map());
	let loading = $state(true);

	let tagToDelete: { id: string; name: string; count: number } | null = $state(null);
	let deleting = $state(false);

	onMount(async () => {
		const [fetchedTags, counts] = await Promise.all([fetchTags(), fetchTagOrderCounts()]);
		tags = fetchedTags;
		orderCounts = counts;
		loading = false;
	});

	async function handleDelete() {
		if (!tagToDelete) return;
		deleting = true;
		const success = await deleteTag(tagToDelete.id);
		deleting = false;
		if (success) {
			tags = tags.filter((t) => t.id !== tagToDelete!.id);
		}
		tagToDelete = null;
	}

	function confirmDelete(tag: TagsRecord) {
		tagToDelete = {
			id: tag.id,
			name: tag.name,
			count: orderCounts.get(tag.id) ?? 0
		};
	}

	function cancelDelete() {
		tagToDelete = null;
	}

	function orderCountLabel(count: number): string {
		return count === 1 ? '1 order' : `${count} orders`;
	}
</script>

<svelte:head>
	<title>Tags — Loot</title>
</svelte:head>

<div>
	<PageHeader title="Tags" />

	{#if loading}
		<StateMessage type="loading" message="Loading tags..." />
	{:else if tags.length === 0}
		<StateMessage type="empty" message="No tags yet." />
	{:else}
		<div class="flex flex-wrap gap-2">
			{#each tags as tag (tag.id)}
				{@const count = orderCounts.get(tag.id) ?? 0}
				<div
					class="flex items-center gap-1 rounded-md bg-surface-container-high px-2 py-1 font-label text-xs text-on-surface"
				>
					<div class="flex items-center space-x-2">
						<span class="font-body text-on-surface">{tag.name}</span>
						<span class="font-label text-xs text-on-surface-variant">
							({orderCountLabel(count)})
						</span>
					</div>
					<button
						type="button"
						onclick={() => confirmDelete(tag)}
						class=" cursor-pointer text-on-surface-variant hover:text-error"
					>
						X
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<ConfirmDialog
	open={tagToDelete !== null}
	title="Delete Tag"
	message={tagToDelete
		? `Delete tag "${tagToDelete.name}"? It will be removed from ${tagToDelete.count} order(s).`
		: ''}
	confirmLabel={deleting ? 'Deleting...' : 'Delete'}
	onconfirm={handleDelete}
	oncancel={cancelDelete}
/>
