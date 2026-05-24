<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { logout } from '$lib/auth';
	import { goto } from '$app/navigation';
	import pb from '$lib/pocketbase';
	import Button from '$lib/components/Button.svelte';

	const navItems = [
		{ href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
		{ href: '/orders', icon: 'package_2', label: 'Orders' },
		{ href: '/tags', icon: 'label', label: 'Tags' }
	] as const;

	function handleLogout() {
		logout();
		goto(resolve('/login'), { replaceState: true });
	}
</script>

<nav class="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col bg-surface-container-low p-6">
	<div class="mb-12">
		<h1 class="mb-1 font-headline text-xl text-on-surface">Loot</h1>
	</div>

	<Button href={resolve('/orders/new')} variant="primary" class="mb-10 w-full justify-center">
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

	<div class="mt-auto border-t border-surface-dim pt-4">
		<div class="mb-3 px-2">
			<p class="font-label text-sm text-on-surface">
				{(pb.authStore.record as Record<string, unknown>)?.email ?? 'User'}
			</p>
		</div>
		<Button variant="tertiary" onclick={handleLogout}>
			<span class="material-symbols-outlined">logout</span>
			<span>Sign out</span>
		</Button>
	</div>
</nav>
