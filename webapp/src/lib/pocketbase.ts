import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.VITE_POCKETBASE_URL as string | undefined;

const pb = new PocketBase(pbUrl || '/');

pb.autoCancellation(false);

export default pb;
