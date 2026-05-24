<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import StatusProgress from '$lib/components/StatusProgress.svelte';
	import Button from '$lib/components/Button.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Card from '$lib/components/Card.svelte';
	import DetailRow from '$lib/components/DetailRow.svelte';
	import StateMessage from '$lib/components/StateMessage.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { Status } from '$lib/status';
	import { fetchOrder, deleteOrder, archiveOrder, unarchiveOrder } from '$lib/data/orders';
	import pb from '$lib/pocketbase';
	import type { OrdersRecord, OrderItemsRecord, TagsRecord } from '$lib/types';
	import { onMount } from 'svelte';
	import { formatCurrency, formatDate } from '$lib/format';

	let order: OrdersRecord | null = $state(null);
	let items: OrderItemsRecord[] = $state([]);
	let tags: TagsRecord[] = $state([]);
	let loading = $state(true);
	let error = $state(false);
	let showDeleteDialog = $state(false);

	function lineTotal(item: OrderItemsRecord): number {
		return item.quantity * item.unitPrice;
	}

	onMount(async () => {
		const id = page.params.id!;
		const result = await fetchOrder(id);
		if (result) {
			order = result.order;
			items = result.items;
			tags = result.tags;
		} else {
			error = true;
		}
		loading = false;
	});

	async function handleDelete() {
		if (!order) return;
		const success = await deleteOrder(order.id);
		if (success) {
			goto(resolve('/orders'), { replaceState: true });
		} else {
			showDeleteDialog = false;
		}
	}

	async function handleArchive() {
		if (!order) return;
		const result = await archiveOrder(order.id);
		if (result) order = { ...order, ...result };
	}

	async function handleUnarchive() {
		if (!order) return;
		const result = await unarchiveOrder(order.id);
		if (result) order = { ...order, ...result };
	}
</script>

{#if loading}
	<StateMessage type="loading" message="Loading order..." />
{:else if error || !order}
	<StateMessage
		type="error"
		message="Order not found."
		action={{ label: 'Back to Orders', href: resolve('/orders') }}
	/>
{:else}
	<PageHeader backHref={resolve('/orders')} backLabel="Back to Orders">
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-8">
				<div>
					<div class="mb-3 flex items-center gap-4">
						<h2 class="font-headline text-6xl tracking-tight text-on-surface">
							{order.description}
						</h2>
						<StatusBadge status={order.status as Status} />
					</div>
					{#if order.externalId}
						<p class="font-body text-lg text-on-surface-variant">
							{order.externalId}
						</p>
					{/if}
					<p class="mt-2 font-label text-sm text-on-surface-variant">
						{order.store} &middot; Placed on {formatDate(order.orderedAt || order.created)}
					</p>
					{#if tags.length > 0}
						<div class="mt-4 flex gap-2">
							{#each tags as tag (tag.id)}
								<span
									class="rounded-md bg-surface-container px-2 py-1 font-label text-xs text-on-surface-variant"
								>
									{tag.name}
								</span>
							{/each}
						</div>
					{/if}
					{#if order.notes}
						<p class="mt-4 font-body text-sm text-on-surface-variant">{order.notes}</p>
					{/if}
				</div>

				<div class="my-6">
					<StatusProgress status={order.status as Status} />
				</div>

				<div class="flex flex-col space-y-16">
					<section>
						<h3
							class="mb-8 border-b border-surface-container-highest pb-4 font-headline text-2xl text-on-surface"
						>
							Items
						</h3>
						{#if items.length === 0}
							<StateMessage type="empty" message="No items in this order." />
						{:else}
							<div class="space-y-6">
								{#each items as item, i (i)}
									<article
										class="flex cursor-default gap-6 rounded-2xl bg-surface-container-lowest p-6"
									>
										{#if item.image}
											<img
												src={pb.files.getURL(item, item.image)}
												alt={item.description}
												class="h-32 w-32 shrink-0 rounded-xl object-cover"
											/>
										{:else}
											<div
												class="flex h-32 w-32 shrink-0 items-center justify-center rounded-xl bg-surface-container text-outline"
											>
												<span class="material-symbols-outlined text-3xl opacity-50">
													inventory_2
												</span>
											</div>
										{/if}
										<div class="flex flex-1 flex-col justify-between">
											<div class="flex items-start justify-between gap-4">
												<div>
													<h4 class="font-headline text-xl text-on-surface">
														{item.description}
													</h4>
												</div>
												<div class="text-right">
													<p class="font-label text-xs text-on-surface-variant">
														Price: {formatCurrency(item.unitPrice, order.currency)}
													</p>
													<p class="mt-1 font-label text-xs text-on-surface-variant">
														Qty: {item.quantity}
													</p>
												</div>
											</div>
											<div
												class="mt-4 flex items-center justify-between border-t border-surface-container-highest pt-4"
											>
												{#if item.itemUrl}
													<a
														href={item.itemUrl}
														target="_blank"
														rel="noopener noreferrer"
														class="inline-flex items-center gap-1 font-label text-sm text-primary"
													>
														<span class="material-symbols-outlined text-sm">open_in_new</span>
														Item Link
													</a>
												{:else}
													<span></span>
												{/if}
												<p class="font-headline text-lg font-semibold text-on-surface">
													{formatCurrency(lineTotal(item), order.currency)}
												</p>
											</div>
										</div>
									</article>
								{/each}
							</div>
						{/if}
					</section>
				</div>
			</div>
			<div class="col-span-4 flex flex-col gap-8">
				<div class="flex items-center gap-3">
					<Button href={resolve(`/orders/${order.id}/edit`)} variant="secondary">
						<span class="material-symbols-outlined text-lg">edit</span>
						Edit
					</Button>
					{#if order.status === 'archived'}
						<Button variant="secondary" onclick={handleUnarchive}>
							<span class="material-symbols-outlined text-lg">unarchive</span>
							Unarchive
						</Button>
					{:else}
						<Button variant="secondary" onclick={handleArchive}>
							<span class="material-symbols-outlined text-lg">archive</span>
							Archive
						</Button>
					{/if}
					<Button variant="danger" onclick={() => (showDeleteDialog = true)}>
						<span class="material-symbols-outlined text-lg">delete</span>
						Delete
					</Button>
				</div>
				<div class="col-span-4 space-y-8">
					<Card variant="elevated">
						<h3 class="mb-6 font-headline text-xl text-on-surface">Total</h3>
						<div class="space-y-4 font-body text-sm">
							{#if order.shippingCost}
								<DetailRow label="Subtotal">
									{formatCurrency(order.totalPrice - order.shippingCost, order.currency)}
								</DetailRow>
								<DetailRow label="Shipping">
									{formatCurrency(order.shippingCost, order.currency)}
								</DetailRow>
								<div class="border-t border-surface-container-highest pt-4"></div>
							{/if}
							<DetailRow label="Total" highlight>
								{formatCurrency(order.totalPrice, order.currency)}
							</DetailRow>
						</div>
					</Card>

					<Card variant="ghost">
						<div class="mb-6 flex items-center gap-3">
							<span class="material-symbols-outlined text-on-surface-variant">info</span>
							<h3 class="font-headline text-xl text-on-surface">Details</h3>
						</div>
						<div class="space-y-4 font-body text-sm">
							{#if order.trackingCode}
								<DetailRow label="Tracking">{order.trackingCode}</DetailRow>
							{/if}
							{#if order.currency}
								<DetailRow label="Currency">{order.currency.toUpperCase()}</DetailRow>
							{/if}
							<DetailRow label="Store">{order.store}</DetailRow>
							{#if order.orderedAt}
								<DetailRow label="Ordered">{formatDate(order.orderedAt)}</DetailRow>
							{/if}
							{#if order.deliveredAt}
								<DetailRow label="Delivered">{formatDate(order.deliveredAt)}</DetailRow>
							{/if}
							{#if order.archivedAt}
								<DetailRow label="Archived">{formatDate(order.archivedAt)}</DetailRow>
							{/if}
							<DetailRow label="Created">{formatDate(order.created)}</DetailRow>
							{#if order.orderUrl}
								<a
									href={order.orderUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="mt-2 inline-flex items-center gap-1 font-label text-sm text-primary"
								>
									<span class="material-symbols-outlined text-sm">open_in_new</span>
									External Order
								</a>
							{/if}
						</div>
					</Card>
				</div>
			</div>
		</div>
	</PageHeader>

	<ConfirmDialog
		open={showDeleteDialog}
		title="Delete Order"
		message="Are you sure you want to delete this order? This action cannot be undone."
		confirmLabel="Delete"
		onconfirm={handleDelete}
		oncancel={() => (showDeleteDialog = false)}
	/>
{/if}
