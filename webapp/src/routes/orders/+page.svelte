<script lang="ts">
	import OrderCard from '$lib/components/OrderCard.svelte';
	import { statusLabels, filterableStatuses, type Status } from '$lib/status';
	import { fetchOrders } from '$lib/data/orders';
	import type { OrdersRecord } from '$lib/types';
	import { onMount } from 'svelte';

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

	async function setFilter(filter: Status | 'all') {
		activeFilter = filter;
	}
</script>

<div>
	<header class="mb-16">
		<h2 class="mb-4 font-headline text-6xl tracking-tight text-on-surface">Orders</h2>
	</header>

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
		<div class="py-20 text-center">
			<p class="font-body text-on-surface-variant">Loading orders...</p>
		</div>
	{:else if filteredOrders.length === 0}
		<div class="py-20 text-center">
			<p class="font-body text-on-surface-variant">
				{orders.length === 0 ? 'No orders yet.' : 'No orders match this filter.'}
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 gap-8">
			{#each filteredOrders as order (order.id)}
				<OrderCard {order} />
			{/each}
		</div>
	{/if}
</div>
