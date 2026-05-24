<script lang="ts">
	let { value = $bindable('BRL') } = $props();

	const currencies = [
		{ code: 'BRL', label: 'BRL — Brazilian Real' },
		{ code: 'USD', label: 'USD — US Dollar' },
		{ code: 'EUR', label: 'EUR — Euro' },
		{ code: 'GBP', label: 'GBP — British Pound' },
		{ code: 'JPY', label: 'JPY — Japanese Yen' },
		{ code: 'CAD', label: 'CAD — Canadian Dollar' },
		{ code: 'AUD', label: 'AUD — Australian Dollar' },
		{ code: 'CHF', label: 'CHF — Swiss Franc' },
		{ code: 'CNY', label: 'CNY — Chinese Yuan' },
		{ code: 'ARS', label: 'ARS — Argentine Peso' },
		{ code: 'MXN', label: 'MXN — Mexican Peso' },
		{ code: 'INR', label: 'INR — Indian Rupee' }
	];
</script>

<select
	bind:value
	class="w-full rounded border-none bg-surface-container-lowest px-4 py-3 font-body text-on-surface shadow-ghost transition-all focus:shadow-ghost-focus focus:outline-none"
>
	{#each currencies as c (c.code)}
		<option value={c.code}>{c.label}</option>
	{/each}
</select>
