<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { fetchOrder } from '$lib/data/orders';
	import OrderForm from '$lib/components/OrderForm.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import StateMessage from '$lib/components/StateMessage.svelte';
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
	<StateMessage type="loading" message="Loading order..." />
{:else if notFound || !order}
	<StateMessage type="error" message="Order not found." />
{:else}
	<PageHeader backHref={resolve(`/orders/${order.id}`)} backLabel="Back to Order" title="Edit Order" />
	<OrderForm {order} {items} {tagIds} {tagNames} />
{/if}