<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { page } from '$app/state';
	import { isAuthenticated } from '$lib/auth';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

	let { children } = $props();
	let sidebarOpen = $state(false);

	$effect(() => {
		const path = page.url.pathname;
		const isLoginPage = path === resolve('/login');
		if (!$isAuthenticated && !isLoginPage) {
			goto(resolve('/login'), { replaceState: true });
		} else if ($isAuthenticated && isLoginPage) {
			goto(resolve('/dashboard'), { replaceState: true });
		}
	});

	$effect(() => {
		void page.url.pathname;
		sidebarOpen = false;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Loot</title>
</svelte:head>

{#if $isAuthenticated && page.url.pathname !== resolve('/login')}
	<div
		class="flex min-h-screen overflow-x-hidden bg-surface text-on-surface antialiased selection:bg-primary selection:text-on-primary"
	>
		{#if sidebarOpen}
			<button
				class="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-sm md:hidden"
				onclick={() => (sidebarOpen = false)}
				aria-label="Close sidebar"
			></button>
		{/if}
		<Sidebar {sidebarOpen} onclose={() => (sidebarOpen = false)} />
		<main class="min-h-screen min-w-0 flex-1 md:ml-64">
			<div class="flex items-center gap-4 border-b border-surface-dim px-4 py-3 md:hidden">
				<button
					onclick={() => (sidebarOpen = true)}
					class="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
					aria-label="Open menu"
				>
					<span class="material-symbols-outlined">menu</span>
				</button>
				<h1 class="font-headline text-xl font-bold text-on-surface">Loot</h1>
			</div>
			<div class="mx-auto max-w-7xl px-4 pt-4 pb-16 md:px-16 md:pt-8 md:pb-24">
				{@render children()}
			</div>
		</main>
	</div>
{:else}
	{@render children()}
{/if}
