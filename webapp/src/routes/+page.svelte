<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import pb from '$lib/pocketbase';

	onMount(() => {
		if (pb.authStore.isValid) {
			goto(resolve('/dashboard'), { replaceState: true });
		} else {
			goto(resolve('/login'), { replaceState: true });
		}
	});
</script>
