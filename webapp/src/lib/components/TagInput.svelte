<script lang="ts">
	import { fetchTags, createTag } from '$lib/data/orders';
	import type { TagsRecord } from '$lib/types';
	import { onMount } from 'svelte';

	let { selected = $bindable([] as string[]), selectedNames = $bindable([] as string[]) } =
		$props();

	let allTags: TagsRecord[] = $state([]);
	let query = $state('');
	let suggestions: TagsRecord[] = $state([]);
	let showDropdown = $state(false);

	onMount(async () => {
		allTags = await fetchTags();
		suggestions = allTags.filter((t) => !selected.includes(t.id));
	});

	function onInput() {
		const q = query.trim().toLowerCase();
		if (!q) {
			suggestions = allTags.filter((t) => !selected.includes(t.id));
		} else {
			suggestions = allTags.filter(
				(t) => !selected.includes(t.id) && t.name.toLowerCase().includes(q)
			);
		}
		showDropdown = suggestions.length > 0 || q.length > 0;
	}

	async function addTag(tag: TagsRecord) {
		if (!selected.includes(tag.id)) {
			selected = [...selected, tag.id];
			selectedNames = [...selectedNames, tag.name];
		}
		query = '';
		showDropdown = false;
		onInput();
	}

	async function addNewTag() {
		const name = query.trim();
		if (!name) return;
		const existing = allTags.find((t) => t.name.toLowerCase() === name.toLowerCase());
		if (existing) {
			addTag(existing);
			return;
		}
		const tag = await createTag(name);
		allTags = [...allTags, tag];
		addTag(tag);
	}

	function removeTag(id: string) {
		const idx = selected.indexOf(id);
		selected = selected.filter((t) => t !== id);
		selectedNames = selectedNames.filter((_, i) => i !== idx);
		onInput();
	}
</script>

<div
	class="flex min-h-13 flex-wrap items-center gap-2 rounded border border-transparent bg-surface-container-lowest px-4 py-2 shadow-ghost transition-all focus-within:border-transparent focus-within:shadow-ghost-focus"
>
	{#each selected as id, i (id)}
		<span
			class="flex items-center gap-1 rounded-md bg-surface-container-high px-2 py-1 font-label text-xs text-on-surface"
		>
			{selectedNames[i] || id}
			<button
				type="button"
				onclick={() => removeTag(id)}
				class=" cursor-pointer text-on-surface-variant hover:text-error"
			>
				X
			</button>
		</span>
	{/each}
	<div class="relative min-w-25 flex-1">
		<input
			type="text"
			bind:value={query}
			oninput={() => onInput()}
			onfocus={() => {
				onInput();
				showDropdown = true;
			}}
			onblur={() => setTimeout(() => (showDropdown = false), 150)}
			onkeydown={(e) => {
				if (e.key === 'Enter' && query.trim()) {
					e.preventDefault();
					addNewTag();
				}
			}}
			placeholder={selected.length === 0 ? 'Add a tag...' : ''}
			class="w-full border-none bg-transparent p-1 font-body text-sm text-on-surface outline-none"
		/>
		{#if showDropdown}
			<div
				class="absolute top-full left-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-lg bg-surface-container-lowest shadow-lg"
			>
				{#if suggestions.length > 0}
					{#each suggestions as tag (tag.id)}
						<button
							type="button"
							onclick={() => addTag(tag)}
							class="block w-full px-4 py-2 text-left font-label text-sm text-on-surface hover:bg-surface-container-low"
						>
							{tag.name}
						</button>
					{/each}
				{:else if query.trim()}
					<button
						type="button"
						onclick={() => addNewTag()}
						class="block w-full px-4 py-2 text-left font-label text-sm text-primary hover:bg-surface-container-low"
					>
						Create "{query.trim()}"
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
