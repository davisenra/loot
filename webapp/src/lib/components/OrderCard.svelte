<script lang="ts">
	import StatusBadge from './StatusBadge.svelte';
	import { resolve } from '$app/paths';
	import type { OrdersRecord } from '$lib/types';
	import type { Status } from '$lib/status';

	let { order }: { order: OrdersRecord } = $props();
</script>

<a
	href={resolve(`/orders/${order.id}`)}
	class="group flex cursor-pointer flex-col gap-8 rounded-xl bg-surface-container-lowest p-8 shadow-[0_4px_24px_rgba(27,28,29,0.04)] transition-colors duration-300 hover:bg-surface-container-low"
>
	<div class="flex items-start justify-between">
		<div>
			<StatusBadge status={order.status as Status} />
			<h3 class="mt-2 font-headline text-2xl text-on-surface">{order.description}</h3>
		</div>
		<div class="text-right">
			<span class="font-body text-xl font-medium text-on-surface">
				{order.currency ? order.currency + ' ' : '$'}{order.totalPrice.toLocaleString('en-US', {
					minimumFractionDigits: 2
				})}
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
