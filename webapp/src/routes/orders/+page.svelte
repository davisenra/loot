<script lang="ts">
	import { statusLabels, filterableStatuses, type Status } from '$lib/status';
	import { fetchOrders } from '$lib/data/orders';
	import type { OrdersRecord } from '$lib/types';
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import OrderCard from '$lib/components/OrderCard.svelte';
	import StateMessage from '$lib/components/StateMessage.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	let orders: OrdersRecord[] = $state([]);
	let activeFilter: Status | 'all' = $state('all');
	let searchQuery = $state('');
	let page = $state(1);
	let totalPages = $state(1);
	let totalItems = $state(0);
	let loading = $state(true);

	const PER_PAGE = 10;

	async function loadOrders() {
		loading = true;
		const result = await fetchOrders({
			page,
			perPage: PER_PAGE,
			status: activeFilter,
			search: searchQuery || undefined
		});
		orders = result.items;
		totalItems = result.totalItems;
		totalPages = result.totalPages;
		loading = false;
	}

	onMount(loadOrders);

	function setFilter(filter: Status | 'all') {
		activeFilter = filter;
		page = 1;
		loadOrders();
	}

	function onSearch(query: string) {
		searchQuery = query;
		page = 1;
		loadOrders();
	}

	function setPage(p: number) {
		page = p;
		loadOrders();
	}
</script>

<svelte:head>
	<title>Orders — Loot</title>
</svelte:head>

<div>
	<PageHeader title="Orders" />

	<div class="mb-8">
		<SearchBar bind:value={searchQuery} placeholder="Search orders..." onsearch={onSearch} />
	</div>

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
	{:else if orders.length === 0}
		<StateMessage
			type="empty"
			message={totalItems === 0 ? 'No orders yet.' : 'No orders match your search.'}
		/>
	{:else}
		<div class="grid grid-cols-2 gap-8">
			{#each orders as order (order.id)}
				<OrderCard {order} />
			{/each}
		</div>
		<Pagination {page} {totalPages} onchange={setPage} />
	{/if}
</div>
