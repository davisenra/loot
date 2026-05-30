<script lang="ts">
	import { fetchOrders } from '$lib/data/orders';
	import type { OrdersRecord } from '$lib/types';
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import OrderCard from '$lib/components/OrderCard.svelte';
	import StateMessage from '$lib/components/StateMessage.svelte';

	let orders: OrdersRecord[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		const result = await fetchOrders({ status: 'draft' });
		orders = result.items;
		loading = false;
	});
</script>

<svelte:head>
	<title>Wishlist — Loot</title>
</svelte:head>

<div>
	<PageHeader title="Wishlist" />

	{#if loading}
		<StateMessage type="loading" message="Loading drafts..." />
	{:else if orders.length === 0}
		<StateMessage type="empty" message="No drafts yet." />
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
			{#each orders as order (order.id)}
				<OrderCard {order} />
			{/each}
		</div>
	{/if}
</div>
