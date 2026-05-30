<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import { resolve } from '$app/paths';
	import type { OrdersRecord } from '$lib/types';
	import type { Status } from '$lib/status';
	import { formatCurrency, formatDate } from '$lib/format';

	let { order }: { order: OrdersRecord } = $props();
</script>

<a
	href={resolve(`/orders/${order.id}`)}
	class="group flex min-w-0 cursor-pointer flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-card transition-colors duration-300 hover:bg-surface-container-low md:gap-8 md:p-8"
>
	<div class="flex min-w-0 items-start justify-between gap-4">
		<div class="min-w-0">
			<h3 class="truncate font-headline text-2xl text-on-surface">{order.description}</h3>
		</div>
		<StatusBadge status={order.status as Status} />
	</div>
	<div
		class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 font-label text-[11px] tracking-wider text-on-surface-variant uppercase"
	>
		<p class="normal-case">{order.store}</p>
		<span class="h-1 w-1 rounded-full bg-surface-dim"></span>
		<p>{formatCurrency(order.totalPrice, order.currency)}</p>
		<span class="h-1 w-1 rounded-full bg-surface-dim"></span>
		<span class="font-label text-xs text-on-surface-variant">
			{formatDate(order.created)}
		</span>
	</div>
</a>
