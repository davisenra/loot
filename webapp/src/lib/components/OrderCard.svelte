<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import { resolve } from '$app/paths';
	import type { OrdersRecord } from '$lib/types';
	import type { Status } from '$lib/status';
	import { formatCurrency } from '$lib/format';

	let { order }: { order: OrdersRecord } = $props();
</script>

<a
	href={resolve(`/orders/${order.id}`)}
	class="group flex cursor-pointer flex-col gap-8 rounded-xl bg-surface-container-lowest p-8 shadow-card transition-colors duration-300 hover:bg-surface-container-low"
>
	<div class="flex items-start justify-between">
		<div>
			<StatusBadge status={order.status as Status} />
			<h3 class="mt-2 font-headline text-2xl text-on-surface">{order.description}</h3>
		</div>
		<div class="text-right">
			<span class="font-body text-xl font-medium text-on-surface">
				{formatCurrency(order.totalPrice, order.currency)}
			</span>
		</div>
	</div>
	<div
		class="mt-auto flex items-center gap-4 pt-4 font-label text-xs tracking-wider text-on-surface-variant uppercase"
	>
		<span>{order.externalId}</span>
		<span class="h-1 w-1 rounded-full bg-surface-dim"></span>
		<span class="normal-case">{order.store}</span>
	</div>
</a>
