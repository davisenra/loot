<script lang="ts">
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { resolve } from '$app/paths';
	import { type Status } from '$lib/status';
	import { fetchSummary, fetchRecentOrders } from '$lib/data/orders';
	import type { OrdersRecord } from '$lib/types';
	import { onMount } from 'svelte';

	interface SummaryCard {
		label: string;
		count: number;
		icon: string;
		type: 'activeOrders' | 'inTransit' | 'delivered';
	}

	const summaryCards: SummaryCard[] = [
		{ label: 'Active Orders', count: 0, icon: 'public', type: 'activeOrders' },
		{ label: 'In Transit', count: 0, icon: 'schedule', type: 'inTransit' },
		{ label: 'Delivered', count: 0, icon: 'inventory_2', type: 'delivered' }
	];

	let recentOrders: OrdersRecord[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		const [summary, recent] = await Promise.all([fetchSummary(), fetchRecentOrders()]);
		for (const card of summaryCards) {
			card.count = summary[card.type];
		}
		recentOrders = recent;
		loading = false;
	});
</script>

<div>
	<section class="mb-16 max-w-3xl">
		<h2 class="mb-6 font-headline text-5xl leading-tight text-on-surface">Welcome</h2>
	</section>

	<section class="mb-20 grid grid-cols-3 gap-6">
		{#each summaryCards as card (card.label)}
			<div
				class="{card.label === 'Delivered'
					? 'bg-primary text-on-primary shadow-sm'
					: card.label === 'In Transit'
						? 'bg-surface-container'
						: 'ghost-border bg-surface-container-lowest'} flex min-h-[200px] flex-col justify-between rounded-xl p-8"
			>
				<div class="mb-8 flex items-start justify-between">
					<span
						class="font-label text-sm tracking-widest uppercase {card.label === 'Delivered'
							? 'opacity-80'
							: 'text-on-surface-variant'}"
					>
						{card.label}
					</span>
					<span
						class="material-symbols-outlined {card.label === 'Delivered'
							? 'text-on-primary opacity-80'
							: card.label === 'In Transit'
								? 'text-tertiary'
								: 'text-primary'}"
					>
						{card.icon}
					</span>
				</div>
				<div>
					<div
						class="mb-2 font-headline text-5xl {card.label === 'Delivered'
							? ''
							: 'text-on-surface'}"
					>
						{loading ? '—' : String(card.count).padStart(2, '0')}
					</div>
				</div>
			</div>
		{/each}
	</section>

	<section>
		<div class="mb-8 flex items-end justify-between border-b border-surface-dim pb-4">
			<h3 class="font-headline text-2xl text-on-surface">Recent Orders</h3>
		</div>

		{#if loading}
			<div class="py-20 text-center">
				<p class="font-body text-on-surface-variant">Loading orders...</p>
			</div>
		{:else if recentOrders.length === 0}
			<div class="py-20 text-center">
				<p class="font-body text-on-surface-variant">No orders yet.</p>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				{#each recentOrders as order (order.id)}
					<a
						href={resolve(`/orders/${order.id}`)}
						class="group ghost-border flex cursor-pointer items-center gap-6 rounded-xl bg-transparent p-4 transition-colors duration-300 hover:bg-surface-container-lowest"
					>
						<div
							class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-highest text-outline"
						>
							<span class="material-symbols-outlined">package_2</span>
						</div>
						<div class="flex-1">
							<div class="mb-1 flex items-baseline justify-between">
								<h4 class="font-headline text-lg text-on-surface">{order.description}</h4>
								<span class="font-label text-xs text-on-surface-variant">
									{new Date(order.created).toLocaleDateString()}
								</span>
							</div>
							<div class="flex items-center gap-4">
								<span class="font-label text-xs tracking-wider text-on-surface-variant uppercase">
									{order.externalId}
								</span>
								<span class="h-1 w-1 rounded-full bg-surface-dim"></span>
								<span class="font-label text-xs text-on-surface-variant">{order.store}</span>
								<span class="h-1 w-1 rounded-full bg-surface-dim"></span>
								<StatusBadge status={order.status as Status} />
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>
