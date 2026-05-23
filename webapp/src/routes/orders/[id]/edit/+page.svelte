<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { fetchOrder } from '$lib/data/orders';
	import OrderForm from '$lib/components/OrderForm.svelte';
	import { onMount } from 'svelte';
	import type { OrdersRecord, OrderItemsRecord } from '$lib/types';

	let order: OrdersRecord | null = $state(null);
	let items: OrderItemsRecord[] = $state([]);
	let tagIds: string[] = $state([]);
	let tagNames: string[] = $state([]);
	let loading = $state(true);
	let notFound = $state(false);

	onMount(async () => {
		const id = page.params.id!;
		const result = await fetchOrder(id);
		if (result) {
			order = result.order;
			items = result.items;
			tagIds = result.tags.map((t) => t.id);
			tagNames = result.tags.map((t) => t.name);
		} else {
			notFound = true;
		}
		loading = false;
	});
</script>

<svelte:head>
	<title>Edit Order — Loot</title>
</svelte:head>

{#if loading}
	<div class="py-20 text-center">
		<p class="font-body text-on-surface-variant">Loading order...</p>
	</div>
{:else if notFound || !order}
	<div class="py-20 text-center">
		<p class="font-body text-on-surface-variant">Order not found.</p>
	</div>
{:else}
	<header class="mb-16">
		<a
			href={resolve(`/orders/${order.id}`)}
			class="group mb-6 inline-flex items-center gap-2 font-label text-sm text-on-surface-variant transition-colors hover:text-primary"
		>
			<span
				class="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1"
			>
				arrow_back
			</span>
			Back to Order
		</a>
		<h2 class="font-headline text-6xl tracking-tight text-on-surface">Edit Order</h2>
	</header>
	<OrderForm {order} {items} {tagIds} {tagNames} />
{/if}
