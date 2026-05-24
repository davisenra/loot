<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { page } from '$app/state';
	import { isAuthenticated } from '$lib/auth';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let { children } = $props();

	$effect(() => {
		const path = page.url.pathname;
		const isLoginPage = path === resolve('/login');
		if (!$isAuthenticated && !isLoginPage) {
			goto(resolve('/login'), { replaceState: true });
		} else if ($isAuthenticated && isLoginPage) {
			goto(resolve('/dashboard'), { replaceState: true });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Loot</title>
</svelte:head>

{#if $isAuthenticated && page.url.pathname !== resolve('/login')}
	<div
		class="flex min-h-screen bg-surface text-on-surface antialiased selection:bg-primary selection:text-on-primary"
	>
		<Sidebar />
		<main class="ml-64 min-h-screen flex-1">
			<div class="mx-auto max-w-7xl px-16 pt-8 pb-24">
				{@render children()}
			</div>
		</main>
	</div>
{:else}
	{@render children()}
{/if}
