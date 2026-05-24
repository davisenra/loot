export type Status = 'draft' | 'ordered' | 'inTransit' | 'delivered' | 'archived' | 'returned';

export const statusConfig: Record<Status, { bg: string; text: string; dot: string }> = {
	inTransit: { bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed', dot: 'bg-tertiary' },
	ordered: { bg: 'bg-surface-container-high', text: 'text-on-surface', dot: 'bg-outline' },
	delivered: { bg: 'bg-primary-fixed', text: 'text-on-primary-fixed', dot: 'bg-primary' },
	draft: { bg: 'bg-surface-container-high', text: 'text-on-surface', dot: 'bg-outline' },
	archived: { bg: 'bg-surface-container', text: 'text-on-surface-variant', dot: 'bg-secondary' },
	returned: { bg: 'bg-error-container', text: 'text-on-error-container', dot: 'bg-error' }
};

export const statusLabels: Record<Status, string> = {
	inTransit: 'In Transit',
	ordered: 'Ordered',
	delivered: 'Delivered',
	draft: 'Draft',
	archived: 'Archived',
	returned: 'Returned'
};

export const filterableStatuses: Status[] = ['ordered', 'inTransit', 'delivered'];

export const statusPipeline: Status[] = ['draft', 'ordered', 'inTransit', 'delivered'];
