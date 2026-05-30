<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { logout } from '$lib/auth';
	import { goto } from '$app/navigation';
	import pb from '$lib/pocketbase';
	import Button from '$lib/components/Button.svelte';

	let { sidebarOpen = false, onclose }: { sidebarOpen?: boolean; onclose: () => void } = $props();

	const navItems = [
		{ href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
		{ href: '/orders', icon: 'package_2', label: 'Orders' },
		{ href: '/wishlist', icon: 'bookmark_border', label: 'Wishlist' },
		{ href: '/tags', icon: 'label', label: 'Tags' }
	] as const;

	function handleLogout() {
		logout();
		goto(resolve('/login'), { replaceState: true });
	}
</script>

<nav
	class="fixed top-0 left-0 z-50 flex h-dvh w-64 flex-col overflow-y-auto bg-surface-container-low p-4 transition-transform duration-300 md:translate-x-0 md:p-6 {sidebarOpen
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<button
		onclick={onclose}
		class="mb-2 flex items-center justify-center self-end rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container md:hidden"
		aria-label="Close sidebar"
	>
		<span class="material-symbols-outlined">close</span>
	</button>

	<div class="mb-6 md:mb-12">
		<h1 class="mb-1 font-headline text-2xl font-bold text-on-surface">Loot</h1>
		<p class="font-label text-sm text-on-surface-variant">
			{(pb.authStore.record as Record<string, unknown>)?.email ?? 'User'}
		</p>
	</div>

	<Button
		href={resolve('/orders/new')}
		variant="primary"
		class="mb-6 w-full justify-center md:mb-10"
	>
		<span class="material-symbols-outlined text-lg">add</span>
		New Order
	</Button>

	<div class="text-body-medium flex flex-1 flex-col gap-2 font-body">
		{#each navItems as item (item.href)}
			{@const active = page.url.pathname === item.href}
			<a
				href={resolve(item.href)}
				class="flex items-center gap-3 rounded-full px-4 py-3 transition-all duration-200
					{active
					? 'scale-95 bg-surface-container-high font-semibold text-primary'
					: 'text-on-secondary-fixed-variant hover:bg-surface-container'}"
			>
				<span class="material-symbols-outlined {active ? 'filled-icon' : ''}">
					{item.icon}
				</span>
				<span>{item.label}</span>
			</a>
		{/each}
	</div>

	<div class="mt-auto flex flex-col border-t border-surface-dim pt-4">
		<Button variant="tertiary" onclick={handleLogout}>
			<span class="material-symbols-outlined text-sm!">logout</span>
			<span>Sign out</span>
		</Button>
	</div>
</nav>
