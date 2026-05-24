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
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import DetailRow from '$lib/components/DetailRow.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { formatCurrency } from '$lib/format';
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

	// svelte-ignore state_referenced_locally
	let description = $state(order?.description ?? '');
	// svelte-ignore state_referenced_locally
	let store = $state(order?.store ?? '');
	// svelte-ignore state_referenced_locally
	let status = $state<Status>(order?.status ?? 'draft');
	// svelte-ignore state_referenced_locally
	let orderUrl = $state(order?.orderUrl ?? '');
	// svelte-ignore state_referenced_locally
	let externalId = $state(order?.externalId ?? '');
	// svelte-ignore state_referenced_locally
	let trackingCode = $state(order?.trackingCode ?? '');
	// svelte-ignore state_referenced_locally
	let notes = $state(order?.notes ?? '');
	// svelte-ignore state_referenced_locally
	let currency = $state(order?.currency ?? 'BRL');
	// svelte-ignore state_referenced_locally
	let shippingCost = $state(order?.shippingCost ?? 0);

	// svelte-ignore state_referenced_locally
	let selectedTagIds = $state<string[]>([...initialTagIds]);
	// svelte-ignore state_referenced_locally
	let selectedTagNames = $state<string[]>([...initialTagNames]);

	// svelte-ignore state_referenced_locally
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
	<Card variant="elevated">
		<h3 class="mb-6 font-headline text-xl text-on-surface">Order Details</h3>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<TextField
				id="description"
				label="Description"
				type="text"
				bind:value={description}
				placeholder="e.g. Summer Wardrobe"
				required
			/>
			<TextField
				id="store"
				label="Store"
				type="text"
				bind:value={store}
				placeholder="e.g. Example Store"
				required
			/>
			<TextField
				id="orderUrl"
				label="Order URL"
				type="url"
				bind:value={orderUrl}
				placeholder="https://example.com/order/123"
			/>
			<TextField
				id="externalId"
				label="External ID"
				type="text"
				bind:value={externalId}
				placeholder="e.g. ORD-12345"
			/>
			<TextField
				id="trackingCode"
				label="Tracking Code"
				type="text"
				bind:value={trackingCode}
				placeholder="e.g. 1Z9999999999999999"
			/>

			<div class="flex flex-col gap-2">
				<label class="font-label text-sm font-medium text-on-surface-variant" for="status">
					Status
				</label>
				<select
					id="status"
					bind:value={status}
					class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-ghost transition-all focus:shadow-ghost-focus focus:outline-none"
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

			<TextField
				id="shippingCost"
				label="Shipping Cost"
				type="number"
				bind:value={shippingCost}
				placeholder="0.00"
				prefix="$"
			/>

			<div class="flex flex-col gap-2 md:col-span-2">
				<TextField
					id="notes"
					label="Notes"
					type="textarea"
					bind:value={notes}
					placeholder="Any additional notes..."
					rows={3}
				/>
			</div>

			<div class="flex flex-col gap-2 md:col-span-2">
				<span class="font-label text-sm font-medium text-on-surface-variant">Tags</span>
				<TagInput bind:selected={selectedTagIds} bind:selectedNames={selectedTagNames} />
			</div>
		</div>
	</Card>

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

	<Card variant="ghost">
		<h3 class="mb-6 font-headline text-xl text-on-surface">Order Summary</h3>
		<div class="space-y-4 font-body text-sm">
			<DetailRow label="Items">
				{itemCount}
				{itemCount === 1 ? 'item' : 'items'}
			</DetailRow>
			<DetailRow label="Subtotal">
				{formatCurrency(subtotal, currency)}
			</DetailRow>
			<DetailRow label="Shipping">
				{formatCurrency(shippingCost || 0, currency)}
			</DetailRow>
			<div class="border-t border-surface-container-highest pt-4"></div>
			<DetailRow label="Total" highlight>
				{formatCurrency(total, currency)}
			</DetailRow>
		</div>
	</Card>

	{#if error}
		<p class="text-center font-body text-sm text-error">{error}</p>
	{/if}

	<div class="flex justify-end gap-4 pt-8">
		<Button href={resolve('/orders')} variant="tertiary">Cancel</Button>
		<Button type="submit" variant="primary" disabled={submitting}>
			{submitting ? 'Saving...' : isEdit ? 'Update Order' : 'Save Order'}
		</Button>
	</div>
</form>
