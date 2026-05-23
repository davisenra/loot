<script lang="ts">
	import { statusConfig, statusLabels, type Status } from '$lib/status';

	let { status }: { status: Status } = $props();

	let cfg = $derived(statusConfig[status]);
	let label = $derived(statusLabels[status]);
</script>

<span
	class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 {cfg.bg} {cfg.text} font-label text-xs"
>
	<span class="h-1.5 w-1.5 rounded-full {cfg.dot}"></span>
	{label}
</span>
