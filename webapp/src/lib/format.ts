export function formatCurrency(value: number, currency?: string): string {
	const prefix = currency ? `${currency} ` : '$';
	return `${prefix}${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString();
}