<script lang="ts">
	import { login, isAuthenticated } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/Button.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	if ($isAuthenticated) {
		goto(resolve('/dashboard'), { replaceState: true });
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			await login(email, password);
			goto(resolve('/dashboard'), { replaceState: true });
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message || 'Invalid email or password.';
			} else {
				error = 'Invalid email or password.';
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-surface">
	<div class="w-full max-w-md rounded-2xl bg-surface-container-lowest p-10 shadow-lg">
		<div class="mb-10 text-center">
			<h1 class="mb-1 font-headline text-3xl text-on-surface">Loot</h1>
		</div>

		<form onsubmit={handleSubmit} class="space-y-6">
			{#if error}
				<div
					class="rounded-lg border border-error-container bg-error-container px-4 py-3 font-label text-sm text-on-error-container"
				>
					{error}
				</div>
			{/if}

			<div>
				<label for="email" class="mb-2 block font-label text-sm text-on-surface-variant">
					Email
				</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					autocomplete="email"
					required
					class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface transition-colors focus:border-primary focus:outline-none"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="mb-2 block font-label text-sm text-on-surface-variant">
					Password
				</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					autocomplete="current-password"
					required
					class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body text-on-surface transition-colors focus:border-primary focus:outline-none"
					placeholder="Enter your password"
				/>
			</div>

			<Button type="submit" variant="primary" disabled={loading} class="w-full justify-center">
				{loading ? 'Signing in...' : 'Sign in'}
			</Button>
		</form>
	</div>
</div>
