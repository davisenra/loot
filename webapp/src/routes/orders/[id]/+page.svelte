<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Status } from '$lib/status';
	import { fetchOrder } from '$lib/data/orders';
	import pb from '$lib/pocketbase';
	import type { OrdersRecord, OrderItemsRecord, TagsRecord } from '$lib/types';
	import { onMount } from 'svelte';

	let order: OrdersRecord | null = $state(null);
	let items: OrderItemsRecord[] = $state([]);
	let tags: TagsRecord[] = $state([]);
	let loading = $state(true);
	let error = $state(false);

	function lineTotal(item: OrderItemsRecord): string {
		return (item.quantity * item.unitPrice).toLocaleString('en-US', {
			minimumFractionDigits: 2
		});
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
</script>

{#if loading}
	<div class="py-20 text-center">
		<p class="font-body text-on-surface-variant">Loading order...</p>
	</div>
{:else if error || !order}
	<div class="py-20 text-center">
		<p class="font-body text-on-surface-variant">Order not found.</p>
		<a
			href={resolve('/orders')}
			class="mt-4 inline-block font-label text-sm text-primary hover:underline"
		>
			Back to Orders
		</a>
	</div>
{:else}
	<header class="mb-16">
		<a
			href={resolve('/orders')}
			class="group mb-6 inline-flex items-center gap-2 font-label text-sm text-on-surface-variant transition-colors hover:text-primary"
		>
			<span
				class="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1"
			>
				arrow_back
			</span>
			Back to Orders
		</a>

		<div class="flex flex-wrap items-start justify-between gap-6">
			<div>
				<div class="mb-3 flex items-center gap-4">
					<h2 class="font-headline text-6xl tracking-tight text-on-surface">
						{order.externalId || order.description}
					</h2>
					<StatusBadge status={order.status as Status} />
				</div>
				<p class="font-body text-lg text-on-surface-variant">
					{order.description}
				</p>
				<p class="mt-2 font-label text-sm text-on-surface-variant">
					{order.store} &middot; Placed on {new Date(
						order.orderedAt || order.created
					).toLocaleDateString()}
				</p>
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
				{#if tags.length > 0}
					<div class="mt-4 flex gap-2">
						{#each tags as tag (tag.id)}
							<span
								class="rounded-md border border-outline-variant bg-surface-container px-2 py-1 font-label text-xs text-on-surface-variant"
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
			<a
				href={resolve(`/orders/${order.id}/edit`)}
				class="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest px-5 py-2.5 font-label text-sm text-on-surface-variant shadow-[inset_0_0_0_1px_rgba(195,198,213,0.15)] transition-colors hover:bg-surface-container hover:text-primary"
			>
				<span class="material-symbols-outlined text-lg">edit</span>
				Edit
			</a>
		</div>
	</header>

	<div class="grid grid-cols-12 gap-12">
		<div class="col-span-8 space-y-16">
			<section>
				<h3
					class="mb-8 border-b border-surface-container-highest pb-4 font-headline text-2xl text-on-surface"
				>
					Items
				</h3>
				{#if items.length === 0}
					<div class="py-8 text-center">
						<p class="font-body text-on-surface-variant">No items in this order.</p>
					</div>
				{:else}
					<div class="space-y-6">
						{#each items as item, i (i)}
							<article
								class="flex cursor-default gap-6 rounded-2xl bg-surface-container-lowest p-6 transition-colors hover:bg-surface-container-low"
							>
								{#if item.image}
									<img
										src={pb.files.getURL(item, item.image)}
										alt={item.description}
										class="h-32 w-32 flex-shrink-0 rounded-xl object-cover"
									/>
								{:else}
									<div
										class="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-outline"
									>
										<span class="material-symbols-outlined text-3xl opacity-50">inventory_2</span>
									</div>
								{/if}
								<div class="flex flex-1 flex-col justify-between">
									<div class="flex items-start justify-between gap-4">
										<div>
											<h4 class="font-headline text-xl text-on-surface">{item.description}</h4>
										</div>
										<div class="text-right">
											<p class="font-headline text-xl text-on-surface">
												${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
												class="inline-flex items-center gap-1 font-label text-sm text-primary hover:underline"
											>
												<span class="material-symbols-outlined text-sm">open_in_new</span>
												Item Link
											</a>
										{:else}
											<span></span>
										{/if}
										<p class="font-headline text-lg font-semibold text-on-surface">
											${lineTotal(item)}
										</p>
									</div>
								</div>
							</article>
						{/each}
					</div>
				{/if}
			</section>
		</div>

		<div class="col-span-4 space-y-8">
			<div class="rounded-2xl bg-surface-container-low p-8">
				<h3 class="mb-6 font-headline text-xl text-on-surface">Total</h3>
				<div class="space-y-4 font-body text-sm">
					{#if order.shippingCost}
						<div class="flex justify-between text-on-surface-variant">
							<span>Subtotal</span>
							<span class="font-medium text-on-surface">
								{order.currency ? `${order.currency} ` : '$'}
								{(order.totalPrice - order.shippingCost).toLocaleString('en-US', {
									minimumFractionDigits: 2
								})}
							</span>
						</div>
						<div class="flex justify-between text-on-surface-variant">
							<span>Shipping</span>
							<span class="font-medium text-on-surface">
								{order.currency ? `${order.currency} ` : '$'}
								{order.shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
							</span>
						</div>
						<div class="border-t border-surface-container-highest pt-4"></div>
					{/if}
					<div class="flex justify-between text-on-surface-variant">
						<span>Total</span>
						<span class="font-headline text-3xl font-bold text-primary">
							{order.currency ? `${order.currency} ` : '$'}
							{order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
						</span>
					</div>
				</div>
			</div>

			<div class="ghost-border rounded-2xl bg-surface-container-lowest p-8">
				<div class="mb-6 flex items-center gap-3">
					<span class="material-symbols-outlined text-on-surface-variant">info</span>
					<h3 class="font-headline text-xl text-on-surface">Details</h3>
				</div>
				<div class="space-y-4 font-body text-sm">
					{#if order.trackingCode}
						<div class="flex justify-between">
							<span class="text-on-surface-variant">Tracking</span>
							<span class="font-medium text-on-surface">
								{order.trackingCode}
							</span>
						</div>
					{/if}
					{#if order.currency}
						<div class="flex justify-between">
							<span class="text-on-surface-variant">Currency</span>
							<span class="font-medium text-on-surface">
								{order.currency.toUpperCase()}
							</span>
						</div>
					{/if}
					<div class="flex justify-between">
						<span class="text-on-surface-variant">Store</span>
						<span class="font-medium text-on-surface">
							{order.store}
						</span>
					</div>
					{#if order.orderedAt}
						<div class="flex justify-between">
							<span class="text-on-surface-variant">Ordered</span>
							<span class="font-medium text-on-surface">
								{new Date(order.orderedAt).toLocaleDateString()}
							</span>
						</div>
					{/if}
					<div class="flex justify-between">
						<span class="text-on-surface-variant">Created</span>
						<span class="font-medium text-on-surface">
							{new Date(order.created).toLocaleDateString()}
						</span>
					</div>
					{#if order.deliveredAt}
						<div class="flex justify-between">
							<span class="text-on-surface-variant">Delivered</span>
							<span class="font-medium text-on-surface">
								{new Date(order.deliveredAt).toLocaleDateString()}
							</span>
						</div>
					{/if}
					{#if order.archivedAt}
						<div class="flex justify-between">
							<span class="text-on-surface-variant">Archived</span>
							<span class="font-medium text-on-surface">
								{new Date(order.archivedAt).toLocaleDateString()}
							</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
