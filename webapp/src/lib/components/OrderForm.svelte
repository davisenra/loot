<script lang="ts">
	import type { OrdersRecord, OrderItemsRecord } from '$lib/types';
	import type { Status } from '$lib/status';
	import { statusLabels } from '$lib/status';
	import { createOrder, updateOrder } from '$lib/data/orders';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import OrderItemRow from '$lib/components/OrderItemRow.svelte';
	import TagInput from '$lib/components/TagInput.svelte';
	import CurrencySelect from '$lib/components/CurrencySelect.svelte';
	import type { ItemData } from '$lib/components/types';

	let {
		order,
		items: initialItems = [],
		tagIds: initialTagIds = [],
		tagNames: initialTagNames = []
	}: {
		order?: OrdersRecord | null;
		items?: OrderItemsRecord[];
		tagIds?: string[];
		tagNames?: string[];
	} = $props();

	const isEdit = $derived(!!order);

	let description = $state(order?.description ?? '');
	let store = $state(order?.store ?? '');
	let status = $state<Status>(order?.status ?? 'draft');
	let orderUrl = $state(order?.orderUrl ?? '');
	let externalId = $state(order?.externalId ?? '');
	let trackingCode = $state(order?.trackingCode ?? '');
	let notes = $state(order?.notes ?? '');
	let currency = $state(order?.currency ?? 'BRL');
	let shippingCost = $state(order?.shippingCost ?? 0);

	let selectedTagIds = $state<string[]>([...initialTagIds]);
	let selectedTagNames = $state<string[]>([...initialTagNames]);

	let itemList = $state<ItemData[]>(
		initialItems.length > 0
			? initialItems.map((item) => ({
					description: item.description,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
					itemUrl: item.itemUrl
				}))
			: [{ description: '', quantity: 1, unitPrice: 0, itemUrl: '' }]
	);

	let submitting = $state(false);
	let error = $state('');

	let currencyPrefix = $derived(currency ? `${currency} ` : '$');
	let itemCount = $derived(itemList.length);
	let subtotal = $derived(itemList.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
	let total = $derived(subtotal + (shippingCost || 0));

	const allStatuses: Status[] = [
		'draft',
		'ordered',
		'inTransit',
		'delivered',
		'archived',
		'returned'
	];

	function addItem() {
		itemList = [...itemList, { description: '', quantity: 1, unitPrice: 0, itemUrl: '' }];
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		error = '';

		const itemsTotal = itemList.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
		const totalPrice = itemsTotal + (shippingCost || 0);

		try {
			if (isEdit && order) {
				const newItems = itemList
					.filter((item, i) => {
						const existing = initialItems[i];
						return !existing;
					})
					.map((item) => ({
						description: item.description,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						itemUrl: item.itemUrl,
						image: ''
					}));

				const updatedItems = itemList
					.map((item, i) => {
						const existing = initialItems[i];
						if (!existing) return null;
						return {
							id: existing.id,
							data: {
								description: item.description,
								quantity: item.quantity,
								unitPrice: item.unitPrice,
								itemUrl: item.itemUrl
							}
						};
					})
					.filter(Boolean) as { id: string; data: Partial<OrderItemsRecord> }[];

				const result = await updateOrder(
					order.id,
					{
						description,
						store,
						status,
						orderUrl,
						externalId,
						trackingCode,
						notes,
						currency,
						totalPrice,
						shippingCost,
						tags: selectedTagIds
					},
					newItems,
					updatedItems
				);
				goto(resolve(`/orders/${result.id}`), { replaceState: true });
			} else {
				const result = await createOrder(
					{
						description,
						store,
						status,
						orderUrl,
						externalId,
						trackingCode,
						notes,
						currency,
						totalPrice,
						shippingCost,
						tags: selectedTagIds,
						orderedAt: '',
						deliveredAt: '',
						archivedAt: ''
					},
					itemList.map((item) => ({
						description: item.description,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						itemUrl: item.itemUrl,
						image: ''
					}))
				);
				goto(resolve(`/orders/${result.id}`), { replaceState: true });
			}
		} catch (err) {
			console.error('Failed to save order:', err);
			error = 'Failed to save order. Please try again.';
			submitting = false;
		}
	}
</script>

<form class="space-y-12" onsubmit={handleSubmit}>
	<!-- Section: Order Meta -->
	<section
		class="rounded-xl border-0 bg-surface-container-lowest p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
	>
		<h3 class="mb-6 font-headline text-xl text-on-surface">Order Details</h3>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="description">
					Description <span class="text-error">*</span>
				</label>
				<input
					id="description"
					type="text"
					bind:value={description}
					placeholder="e.g. Summer Wardrobe"
					required
					class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="store">
					Store <span class="text-error">*</span>
				</label>
				<input
					id="store"
					type="text"
					bind:value={store}
					placeholder="e.g. Example Store"
					required
					class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="orderUrl">
					Order URL
				</label>
				<input
					id="orderUrl"
					type="url"
					bind:value={orderUrl}
					placeholder="https://example.com/order/123"
					class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="externalId">
					External ID
				</label>
				<input
					id="externalId"
					type="text"
					bind:value={externalId}
					placeholder="e.g. ORD-12345"
					class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="trackingCode">
					Tracking Code
				</label>
				<input
					id="trackingCode"
					type="text"
					bind:value={trackingCode}
					placeholder="e.g. 1Z9999999999999999"
					class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				/>
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="status">
					Status
				</label>
				<select
					id="status"
					bind:value={status}
					class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				>
					{#each allStatuses as s (s)}
						<option value={s}>{statusLabels[s]}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="currency">
					Currency
				</label>
				<CurrencySelect bind:value={currency} />
			</div>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="shippingCost">
					Shipping Cost
				</label>
				<div class="relative">
					<span class="absolute top-3 left-4 font-body text-on-surface-variant">$</span>
					<input
						id="shippingCost"
						type="number"
						bind:value={shippingCost}
						min="0"
						step="0.01"
						placeholder="0.00"
						class="w-full rounded border-none bg-surface-container-lowest py-3 pr-4 pl-8 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-2 md:col-span-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="notes">
					Notes
				</label>
				<textarea
					id="notes"
					bind:value={notes}
					rows="3"
					placeholder="Any additional notes..."
					class="w-full resize-y rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-all focus:shadow-[inset_0_0_0_2px_var(--color-primary)] focus:outline-none"
				></textarea>
			</div>

			<div class="flex flex-col gap-2 md:col-span-2">
				<span class="font-label text-sm font-medium text-on-surface-variant">Tags</span>
				<TagInput bind:selected={selectedTagIds} bind:selectedNames={selectedTagNames} />
			</div>
		</div>
	</section>

	<!-- Section: Items -->
	<section class="space-y-6">
		<h3 class="font-headline text-xl text-on-surface">Items</h3>
		{#each itemList as item, i (i)}
			<OrderItemRow {item} />
		{/each}
		<button
			type="button"
			onclick={addItem}
			class="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-surface-variant py-4 font-label text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
		>
			<span class="material-symbols-outlined">add</span>
			Add Another Item
		</button>
	</section>

	<!-- Section: Order Summary -->
	<section class="ghost-border rounded-2xl bg-surface-container-lowest p-8">
		<h3 class="mb-6 font-headline text-xl text-on-surface">Order Summary</h3>
		<div class="space-y-4 font-body text-sm">
			<div class="flex justify-between text-on-surface-variant">
				<span>Items</span>
				<span class="font-medium text-on-surface">
					{itemCount}
					{itemCount === 1 ? 'item' : 'items'}
				</span>
			</div>
			<div class="flex justify-between text-on-surface-variant">
				<span>Subtotal</span>
				<span class="font-medium text-on-surface">
					{currencyPrefix}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
				</span>
			</div>
			<div class="flex justify-between text-on-surface-variant">
				<span>Shipping</span>
				<span class="font-medium text-on-surface">
					{currencyPrefix}{(shippingCost || 0).toLocaleString('en-US', {
						minimumFractionDigits: 2
					})}
				</span>
			</div>
			<div class="border-t border-surface-container-highest pt-4"></div>
			<div class="flex justify-between text-on-surface-variant">
				<span>Total</span>
				<span class="font-headline text-3xl font-bold text-primary">
					{currencyPrefix}{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
				</span>
			</div>
		</div>
	</section>

	{#if error}
		<p class="text-center font-body text-sm text-error">{error}</p>
	{/if}

	<!-- Actions -->
	<div class="flex justify-end gap-4 pt-8">
		<a
			href={resolve('/orders')}
			class="px-6 py-3 font-label text-on-surface-variant underline decoration-on-surface-variant underline-offset-4 transition-all hover:no-underline"
		>
			Cancel
		</a>
		<button
			type="submit"
			disabled={submitting}
			class="rounded-full bg-gradient-to-r from-primary to-primary-container px-8 py-3 font-label font-semibold text-on-primary shadow-sm transition-all hover:opacity-95 hover:shadow-md disabled:opacity-50"
		>
			{submitting ? 'Saving...' : isEdit ? 'Update Order' : 'Save Order'}
		</button>
	</div>
</form>
