import createClient, { type Middleware } from 'openapi-fetch';
import { useLocalUserStore } from '@/parcels/state/LocalUserStore.tsx';
import type { paths } from '@/schema/api';

const umoriClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
const authMiddleware: Middleware = {
  onRequest({ request }) {
    const session = useLocalUserStore.getState().session;
    if (session?.token) {
      request.headers.set('x-user-session', session.token);
    }

    // TODO: only during testing. prod server won't expect basic authh
    request.headers.set('Authorization', `Basic ${btoa('quagga:omnivoregarden42')}`);
    return request;
  },
};
umoriClient.use(authMiddleware);

export default umoriClient;
