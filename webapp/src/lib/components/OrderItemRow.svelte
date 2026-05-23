<script lang="ts">
	import type { ItemData } from '$lib/components/types';

	let {
		item = $bindable({ description: '', quantity: 1, unitPrice: 0, itemUrl: '' } as ItemData)
	}: { item: ItemData } = $props();
</script>

<div
	class="group relative flex flex-col gap-4 rounded-lg bg-surface-container-lowest p-6 md:flex-row md:items-start"
>
	<div class="grid w-full flex-grow grid-cols-1 gap-4 md:grid-cols-2">
		<div class="flex flex-col gap-2 md:col-span-2">
			<label class="font-label text-xs font-medium text-on-surface-variant">
				Description <span class="text-error">*</span>
			</label>
			<input
				type="text"
				bind:value={item.description}
				placeholder="Product description"
				required
				class="w-full rounded border-none bg-surface-container-lowest px-3 py-2 font-body text-sm text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<label class="font-label text-xs font-medium text-on-surface-variant">
				Quantity <span class="text-error">*</span>
			</label>
			<input
				type="number"
				bind:value={item.quantity}
				min="1"
				placeholder="1"
				required
				class="w-full rounded border-none bg-surface-container-lowest px-3 py-2 font-body text-sm text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<label class="font-label text-xs font-medium text-on-surface-variant">
				Unit Price <span class="text-error">*</span>
			</label>
			<div class="relative">
				<span class="absolute top-2.5 left-3 font-body text-sm text-on-surface-variant">$</span>
				<input
					type="number"
					bind:value={item.unitPrice}
					min="0"
					step="0.01"
					placeholder="0.00"
					required
					class="w-full rounded border-none bg-surface-container-lowest py-2 pr-3 pl-7 font-body text-sm text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-2 md:col-span-2">
			<label class="font-label text-xs font-medium text-on-surface-variant">Item URL</label>
			<input
				type="url"
				bind:value={item.itemUrl}
				placeholder="Link to product"
				class="w-full rounded border-none bg-surface-container-lowest px-3 py-2 font-body text-sm text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
			/>
		</div>
	</div>
</div>
