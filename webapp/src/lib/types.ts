import type { Status } from './status';

export type OrdersRecord = {
	id: string;
	description: string;
	notes: string;
	status: Status;
	externalId: string;
	store: string;
	currency: string;
	totalPrice: number;
	shippingCost: number;
	orderUrl: string;
	trackingCode: string;
	orderedAt: string;
	deliveredAt: string;
	archivedAt: string;
	user: string;
	created: string;
	updated: string;
	tags: string[];
};

export type OrderItemsRecord = {
	id: string;
	order: string;
	description: string;
	quantity: number;
	unitPrice: number;
	itemUrl: string;
	image: string;
	created: string;
	updated: string;
};

export type TagsRecord = {
	id: string;
	name: string;
	user: string;
	created: string;
	updated: string;
};

export type UsersRecord = {
	id: string;
	email: string;
	name: string;
	created: string;
	updated: string;
};

export type ExpandedOrder = OrdersRecord & {
	expand?: {
		tags?: TagsRecord[];
	};
};

export type ExpandedOrderItem = OrderItemsRecord;

export type OrderSummary = {
	activeOrders: number;
	inTransit: number;
	delivered: number;
};
