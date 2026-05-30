<script lang="ts">
	import { debounce } from '$lib/utils';

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		onsearch
	}: {
		value?: string;
		placeholder?: string;
		onsearch?: (query: string) => void;
	} = $props();

	const debouncedSearch = debounce((q: string) => {
		onsearch?.(q);
	}, 300);

	function onInput() {
		debouncedSearch(value);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			debouncedSearch.cancel?.();
			onsearch?.(value);
		}
	}
</script>

<div class="relative">
	<span
		class="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-on-surface-variant"
	>
		search
	</span>
	<input
		type="text"
		class="w-full rounded border-none bg-surface-container-lowest py-3 pr-4 pl-10 font-body text-on-surface shadow-ghost transition-all focus:shadow-ghost-focus focus:outline-none"
		bind:value
		{placeholder}
		oninput={onInput}
		onkeydown={onKeydown}
	/>
</div>
