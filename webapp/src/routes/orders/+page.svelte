<script lang="ts">
	import { statusLabels, filterableStatuses, type Status } from '$lib/status';
	import { fetchOrders } from '$lib/data/orders';
	import type { OrdersRecord } from '$lib/types';
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import OrderCard from '$lib/components/OrderCard.svelte';
	import StateMessage from '$lib/components/StateMessage.svelte';

	let orders: OrdersRecord[] = $state([]);
	let activeFilter: Status | 'all' = $state('all');
	let loading = $state(true);

	let filteredOrders = $derived(
		activeFilter === 'all' ? orders : orders.filter((o) => o.status === activeFilter)
	);

	onMount(async () => {
		orders = await fetchOrders();
		loading = false;
	});

	function setFilter(filter: Status | 'all') {
		activeFilter = filter;
	}
</script>

<svelte:head>
	<title>Orders — Loot</title>
</svelte:head>

<div>
	<PageHeader title="Orders" />

	<nav class="mb-12 flex gap-6 border-b border-surface-dim">
		<button
			class="pb-4 font-label whitespace-nowrap {activeFilter === 'all'
				? 'border-b-2 border-primary font-semibold text-primary'
				: 'text-on-surface-variant transition-colors hover:text-primary'}"
			onclick={() => setFilter('all')}
		>
			All Orders
		</button>
		{#each filterableStatuses as status (status)}
			<button
				class="pb-4 font-label whitespace-nowrap {activeFilter === status
					? 'border-b-2 border-primary font-semibold text-primary'
					: 'text-on-surface-variant transition-colors hover:text-primary'}"
				onclick={() => setFilter(status)}
			>
				{statusLabels[status]}
			</button>
		{/each}
	</nav>

	{#if loading}
		<StateMessage type="loading" message="Loading orders..." />
	{:else if filteredOrders.length === 0}
		<StateMessage
			type="empty"
			message={orders.length === 0 ? 'No orders yet.' : 'No orders match this filter.'}
		/>
	{:else}
		<div class="grid grid-cols-2 gap-8">
			{#each filteredOrders as order (order.id)}
				<OrderCard {order} />
			{/each}
		</div>
	{/if}
</div>
