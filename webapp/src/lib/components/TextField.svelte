<script lang="ts">
	let {
		id,
		label,
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		required = false,
		prefix,
		size = 'default',
		class: className = '',
		rows
	}: {
		id?: string;
		label?: string;
		type?: string;
		value?: string | number;
		placeholder?: string;
		required?: boolean;
		prefix?: string;
		size?: 'default' | 'compact';
		class?: string;
		rows?: number;
	} = $props();

	const inputBase =
		'w-full rounded border-none bg-surface-container-lowest font-body text-on-surface shadow-ghost transition-all focus:shadow-ghost-focus focus:outline-none';

	const sizeClasses: Record<string, string> = {
		default: 'px-4 py-3',
		compact: 'px-3 py-2 text-sm'
	};

	const prefixSizeClasses: Record<string, string> = {
		default: 'pl-8',
		compact: 'pl-7'
	};

	const inputClasses = $derived(
		`${inputBase} ${prefix ? prefixSizeClasses[size] : sizeClasses[size]} ${className}`
	);

	const isTextarea = $derived(type === 'textarea');
</script>

<div class="flex flex-col gap-2">
	{#if label}
		<label
			class="font-label {size === 'compact'
				? 'text-xs'
				: 'text-sm'} font-medium text-on-surface-variant"
			for={id}
		>
			{label}{#if required}
				<span class="text-error">*</span>{/if}
		</label>
	{/if}
	{#if isTextarea}
		<textarea {id} bind:value {placeholder} {required} class="{inputClasses} resize-y" {rows}>
		</textarea>
	{:else if prefix}
		<div class="relative">
			<span
				class="absolute {size === 'compact' ? 'top-2.5 left-3' : 'top-2 left-3'} font-body {size ===
				'compact'
					? 'text-sm'
					: ''} text-on-surface-variant"
			>
				{prefix}
			</span>
			<input {id} {type} step="any" bind:value {placeholder} {required} class={inputClasses} />
		</div>
	{:else}
		<input {id} {type} bind:value {placeholder} {required} class={inputClasses} />
	{/if}
</div>
