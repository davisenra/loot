import pb from '$lib/pocketbase';
import type { OrdersRecord, OrderItemsRecord, TagsRecord, OrderSummary } from '$lib/types';
import type { Status } from '$lib/status';

export async function fetchOrders(filter?: Status): Promise<OrdersRecord[]> {
	try {
		const options: Record<string, string> = {
			sort: '-created'
		};
		if (filter) {
			options.filter = pb.filter('status = {:status}', { status: filter });
		}
		return await pb.collection('orders').getFullList<OrdersRecord>(options);
	} catch (err) {
		console.error('Failed to fetch orders:', err);
		return [];
	}
}

export async function fetchOrder(id: string): Promise<{
	order: OrdersRecord;
	items: OrderItemsRecord[];
	tags: TagsRecord[];
} | null> {
	try {
		const order = await pb.collection('orders').getOne<OrdersRecord>(id, {
			expand: 'tags'
		});
		const items = await pb
			.collection('orderItems')
			.getFullList<OrderItemsRecord>({ filter: pb.filter('order = {:order}', { order: id }) });

		const tags: TagsRecord[] =
			(order as OrdersRecord & { expand?: { tags?: TagsRecord[] } }).expand?.tags || [];

		return { order, items, tags };
	} catch (err) {
		console.error('Failed to fetch order:', err);
		return null;
	}
}

export async function fetchRecentOrders(limit = 4): Promise<OrdersRecord[]> {
	try {
		const result = await pb.collection('orders').getList<OrdersRecord>(1, limit, {
			sort: '-updated'
		});
		return result.items;
	} catch (err) {
		console.error('Failed to fetch recent orders:', err);
		return [];
	}
}

export async function fetchSummary(): Promise<OrderSummary> {
	try {
		const [activeOrders, inTransit, delivered] = await Promise.all([
			pb.collection('orders').getList(1, 1, {
				filter: "status != 'delivered' && status != 'archived' && status != 'returned'"
			}),
			pb.collection('orders').getList(1, 1, {
				filter: "status = 'inTransit'"
			}),
			pb.collection('orders').getList(1, 1, {
				filter: "status = 'delivered'"
			})
		]);
		return {
			activeOrders: activeOrders.totalItems,
			inTransit: inTransit.totalItems,
			delivered: delivered.totalItems
		};
	} catch (err) {
		console.error('Failed to fetch summary:', err);
		return { activeOrders: 0, inTransit: 0, delivered: 0 };
	}
}

export async function fetchTags(): Promise<TagsRecord[]> {
	try {
		return await pb.collection('tags').getFullList<TagsRecord>({ sort: 'name' });
	} catch (err) {
		console.error('Failed to fetch tags:', err);
		return [];
	}
}

export async function createTag(name: string): Promise<TagsRecord> {
	return await pb.collection('tags').create<TagsRecord>({
		name,
		user: pb.authStore.record?.id
	});
}

export async function fetchTagOrderCounts(): Promise<Map<string, number>> {
	try {
		const orders = await pb.collection('orders').getFullList<OrdersRecord>();
		const counts = new Map<string, number>();
		for (const order of orders) {
			for (const tagId of order.tags) {
				counts.set(tagId, (counts.get(tagId) ?? 0) + 1);
			}
		}
		return counts;
	} catch (err) {
		console.error('Failed to fetch tag order counts:', err);
		return new Map();
	}
}

export async function deleteTag(id: string): Promise<boolean> {
	try {
		const orders = await pb
			.collection('orders')
			.getFullList<OrdersRecord>({ filter: pb.filter('tags ~ {:tagId}', { tagId: id }) });
		for (const order of orders) {
			await pb.collection('orders').update(order.id, {
				tags: order.tags.filter((tid) => tid !== id)
			});
		}
		await pb.collection('tags').delete(id);
		return true;
	} catch (err) {
		console.error('Failed to delete tag:', err);
		return false;
	}
}

export async function createOrder(
	data: Omit<OrdersRecord, 'id' | 'created' | 'updated' | 'user'>,
	items: Omit<OrderItemsRecord, 'id' | 'created' | 'updated' | 'order'>[]
): Promise<OrdersRecord> {
	const order = await pb.collection('orders').create<OrdersRecord>({
		...data,
		user: pb.authStore.record?.id
	});

	for (const item of items) {
		await pb.collection('orderItems').create({
			...item,
			order: order.id
		});
	}

	return order;
}

export async function updateOrder(
	id: string,
	data: Partial<OrdersRecord>,
	newItems: Omit<OrderItemsRecord, 'id' | 'created' | 'updated' | 'order'>[],
	updatedItems: { id: string; data: Partial<OrderItemsRecord> }[]
): Promise<OrdersRecord> {
	const order = await pb.collection('orders').update<OrdersRecord>(id, data);

	for (const item of newItems) {
		await pb.collection('orderItems').create({
			...item,
			order: id
		});
	}

	for (const item of updatedItems) {
		await pb.collection('orderItems').update(item.id, item.data);
	}

	return order;
}

export async function archiveOrder(id: string): Promise<OrdersRecord | null> {
	try {
		return await pb.collection('orders').update<OrdersRecord>(id, {
			status: 'archived',
			archivedAt: new Date().toISOString()
		});
	} catch (err) {
		console.error('Failed to archive order:', err);
		return null;
	}
}

export async function unarchiveOrder(id: string): Promise<OrdersRecord | null> {
	try {
		return await pb.collection('orders').update<OrdersRecord>(id, {
			status: 'draft',
			archivedAt: ''
		});
	} catch (err) {
		console.error('Failed to unarchive order:', err);
		return null;
	}
}

export async function deleteOrder(id: string): Promise<boolean> {
	try {
		const items = await pb
			.collection('orderItems')
			.getFullList<OrderItemsRecord>({ filter: pb.filter('order = {:order}', { order: id }) });
		for (const item of items) {
			await pb.collection('orderItems').delete(item.id);
		}
		await pb.collection('orders').delete(id);
		return true;
	} catch (err) {
		console.error('Failed to delete order:', err);
		return false;
	}
}
