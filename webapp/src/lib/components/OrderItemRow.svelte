<script lang="ts">
	import type { ItemData } from '$lib/components/types';
	import TextField from '$lib/components/TextField.svelte';

	let {
		item = $bindable({ description: '', quantity: 1, unitPrice: 0, itemUrl: '' } as ItemData)
	}: { item: ItemData } = $props();
</script>

<div
	class="group relative flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-6 md:flex-row md:items-start"
>
	<div class="grid w-full grow grid-cols-1 gap-4 md:grid-cols-2">
		<div class="md:col-span-2">
			<TextField
				label="Description"
				type="text"
				bind:value={item.description}
				placeholder="Product description"
				required
				size="compact"
			/>
		</div>
		<TextField
			label="Quantity"
			type="number"
			bind:value={item.quantity}
			placeholder="1"
			required
			size="compact"
		/>
		<TextField
			label="Unit Price"
			type="number"
			bind:value={item.unitPrice}
			placeholder="0.00"
			required
			prefix="$"
			size="compact"
		/>
		<div class="md:col-span-2">
			<TextField
				label="Item URL"
				type="url"
				bind:value={item.itemUrl}
				placeholder="Link to product"
				size="compact"
			/>
		</div>
	</div>
</div>
