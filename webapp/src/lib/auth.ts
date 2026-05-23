import { writable, derived } from 'svelte/store';
import pb from '$lib/pocketbase';

function createAuthStore() {
	const { subscribe, set } = writable(pb.authStore.isValid);

	pb.authStore.onChange(() => {
		set(pb.authStore.isValid);
	});

	return {
		subscribe,
		get isValid() {
			return pb.authStore.isValid;
		},
		get record() {
			return pb.authStore.record;
		},
		get email() {
			return (pb.authStore.record as Record<string, unknown>)?.email as string | undefined;
		},
		get userId() {
			return pb.authStore.record?.id;
		}
	};
}

export const auth = createAuthStore();

export const isAuthenticated = derived(auth, ($auth) => $auth);

export async function login(email: string, password: string) {
	const result = await pb.collection('users').authWithPassword(email, password);
	return result;
}

export function logout() {
	pb.authStore.clear();
}
