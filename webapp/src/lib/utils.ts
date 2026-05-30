export type DebouncedFn<A extends unknown[]> = ((...args: A) => void) & {
	cancel: () => void;
};

export function debounce<A extends unknown[]>(
	fn: (...args: A) => void,
	ms: number
): DebouncedFn<A> {
	let timer: ReturnType<typeof setTimeout>;
	const debounced = ((...args: A) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	}) as DebouncedFn<A>;
	debounced.cancel = () => clearTimeout(timer);
	return debounced;
}
